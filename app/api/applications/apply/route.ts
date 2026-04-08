import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureProfileForUser } from "@/lib/actions/profiles";

export async function POST(request: Request) {
  const body = await request.json();
  const { jobId, message } = body as { jobId?: string; message?: string };

  if (!jobId || !message?.trim()) {
    return NextResponse.json({ error: "Please enter a message before applying." }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to apply." }, { status: 401 });
  }

  await ensureProfileForUser();

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("created_by")
    .eq("id", jobId)
    .maybeSingle();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  if (job.created_by === user.id) {
    return NextResponse.json({ error: "You cannot apply to your own job." }, { status: 403 });
  }

  const { data: existingApplication, error: existingError } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: "Unable to verify your application status." }, { status: 500 });
  }

  if (existingApplication) {
    return NextResponse.json({ error: "You have already applied to this job." }, { status: 409 });
  }

  const { error: insertError } = await supabase.from("applications").insert({
    job_id: jobId,
    user_id: user.id,
    message: message.trim(),
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  revalidatePath(`/jobs/${jobId}`);
  return NextResponse.json({ success: true }, { status: 201 });
}
