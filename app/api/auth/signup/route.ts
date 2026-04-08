import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function normalizeUsername(value?: string) {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

export async function POST(request: NextRequest) {
  const { fullName, username, email, password } = (await request.json()) as {
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  };

  if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ success: true });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const normalizedUsername = normalizeUsername(username) || "user";
  
  // Step 1: Check if username is already taken BEFORE signup
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json(
      { error: "Username is already taken. Pick another handle." },
      { status: 409 },
    );
  }

  // Step 2: Create auth user with profile metadata
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
    options: {
      data: {
        full_name: fullName.trim(),
        username: normalizedUsername,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;
  
  // Step 3: Attempt to create profile, but don't fail signup if it does
  // The profile will be bootstrapped lazily on first authenticated request
  if (user) {
    try {
      await supabase.from("profiles").insert({
        id: user.id,
        username: normalizedUsername,
        full_name: fullName.trim(),
        primary_role: "Touring Professional",
        city: "Unknown",
        bio: "",
      });
      // Profile created successfully
    } catch {
      // Profile creation failed, but that's OK
      // ensureProfileForUser() will handle bootstrap on next auth request
    }
  }

  return response;
}
