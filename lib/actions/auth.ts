"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProfileForUser } from "@/lib/actions/profiles";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (existingProfile) {
    throw new Error("Username is already taken");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;
  if (!user) {
    throw new Error(
      "Signup succeeded but we could not confirm your user session. Please check your email and sign in once the account is confirmed.",
    );
  }

  try {
    await createProfileForUser(user.id, username, fullName, {
      email,
      full_name: fullName,
    });
  } catch (profileError) {
    const message = (profileError as { message?: string }).message;
    if (message?.includes("duplicate")) {
      throw new Error("Username is already taken. Please choose another one.");
    }
    throw new Error("Account created, but profile setup failed. Please contact support.");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}