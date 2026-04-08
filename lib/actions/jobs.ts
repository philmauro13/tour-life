"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfileForUser } from "@/lib/actions/profiles";

export async function createJob(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to create a job.");
  }

  await ensureProfileForUser();

  const title = formData.get("title") as string;
  const role = formData.get("role") as string;
  const location = formData.get("location") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const pay = formData.get("pay") as string;
  const urgency = formData.get("urgency") as string;
  const description = formData.get("description") as string;

  if (!title || !role || !location || !startDate || !pay || !urgency || !description) {
    throw new Error("All required fields must be filled.");
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      created_by: user.id,
      title,
      role,
      location,
      start_date: startDate,
      end_date: endDate || null,
      pay,
      urgency: urgency as "urgent" | "this_week" | "planned",
      description,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/live");
  redirect(`/jobs/${data.id}`);
}

export async function getJobs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getJob(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getUserJobs(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}