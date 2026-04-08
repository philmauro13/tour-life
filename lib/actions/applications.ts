"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getUserApplications(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        location,
        pay,
        role
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getApplicationsReceivedByUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        location,
        pay,
        role,
        created_by
      ),
      profiles (
        id,
        username,
        full_name,
        primary_role,
        city
      )
    `)
    .eq("jobs.created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserApplicationForJob(jobId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getJobApplications(jobId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      profiles (
        id,
        username,
        full_name,
        primary_role,
        city
      )
    `)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function applyToJob(jobId: string, message: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to apply" };
  }

  // Check if already applied
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingApplication) {
    return { error: "You have already applied to this job" };
  }

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    user_id: user.id,
    message,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}