"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PRIMARY_ROLE = "Touring Professional";
const DEFAULT_CITY = "Unknown";
const DEFAULT_BIO = "";

function normalizeUsername(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

  return normalized.length ? normalized : "";
}

function buildFallbackUsername(email: string | null, userId: string) {
  if (email) {
    const prefix = email.split("@")[0];
    const candidate = normalizeUsername(prefix);
    if (candidate) {
      return `${candidate}-${userId.slice(0, 6)}`;
    }
  }

  return `user-${userId.slice(0, 8)}`;
}

export async function getProfile(username: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createProfileForUser(
  userId: string,
  username: string,
  fullName: string,
  metadata: Record<string, unknown> = {},
) {
  const supabase = await createClient();

  const normalizedUsername = normalizeUsername(username) || buildFallbackUsername(metadata.email as string | null, userId);

  const profilePayload = {
    id: userId,
    username: normalizedUsername,
    full_name: fullName || (metadata.full_name as string) || "Touring Professional",
    primary_role: DEFAULT_PRIMARY_ROLE,
    city: DEFAULT_CITY,
    bio: DEFAULT_BIO,
    resume_url: null,
    availability: null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(profilePayload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function ensureProfileForUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw new Error("Unable to verify your profile at this time.");
  }

  if (existingProfile) {
    return existingProfile;
  }

  const candidateUsername = normalizeUsername(
    (user.user_metadata as Record<string, unknown>)?.username as string | undefined ||
      (user.user_metadata as Record<string, unknown>)?.name as string | undefined ||
      user.email ||
      "",
  );

  const fallbackUsername = buildFallbackUsername(user.email ?? null, user.id);
  const username = candidateUsername || fallbackUsername;
  const fullName =
    ((user.user_metadata as Record<string, unknown>)?.full_name as string | undefined) ||
    ((user.user_metadata as Record<string, unknown>)?.name as string | undefined) ||
    username ||
    "Touring Professional";

  try {
    return await createProfileForUser(user.id, username, fullName, {
      email: user.email,
      full_name: fullName,
    });
  } catch (error) {
    const message = (error as { message?: string }).message || "Unable to bootstrap your profile.";
    
    // If username is taken, try with fallback username
    if (message.includes("duplicate") && username !== fallbackUsername) {
      try {
        return await createProfileForUser(user.id, fallbackUsername, fullName, {
          email: user.email,
          full_name: fullName,
        });
      } catch {
        // Even fallback failed, which shouldn't happen unless database is broken
        throw new Error("Unable to create your profile. Please contact support.");
      }
    }
    
    throw new Error(message);
  }
}

export async function getCurrentUserProfile() {
  const profile = await ensureProfileForUser();
  return profile;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to update your profile");
  }

  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;
  const primaryRole = formData.get("primaryRole") as string;
  const city = formData.get("city") as string;
  const bio = formData.get("bio") as string;
  const experienceSummary = formData.get("experienceSummary") as string;
  const resumeUrl = formData.get("resumeUrl") as string;
  const availability = formData.get("availability") as string;

  if (!fullName || !username || !primaryRole || !city) {
    throw new Error("Required fields must be filled");
  }

  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    throw new Error("Please choose a valid username.");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizedUsername)
    .neq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    throw new Error("Username is already taken");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: normalizedUsername,
      full_name: fullName,
      primary_role: primaryRole,
      city,
      bio,
      experience_summary: experienceSummary,
      resume_url: resumeUrl || null,
      availability: availability || null,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/settings/profile");
  revalidatePath(`/profile/${normalizedUsername}`);
}
