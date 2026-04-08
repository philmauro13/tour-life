import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getJob } from "@/lib/actions/jobs";
import { getUserApplicationForJob } from "@/lib/actions/applications";
import { ApplicationForm } from "@/components/applications/application-form";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  const isJobOwner = userId === job.created_by;
  const existingApplication = userId ? await getUserApplicationForJob(id, userId) : null;

  return (
    <div className="container-shell py-16">
      <div className="glass-strong rounded-[32px] p-8 md:p-10">
        <div className="badge mb-4 bg-rose-500/15 text-rose-300">
          {job.urgency.replace("_", " ")}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">{job.title}</h1>
        <div className="mt-4 grid gap-3 text-sm text-white/65 md:grid-cols-2">
          <div>Role: {job.role}</div>
          <div>Location: {job.location}</div>
          <div>Dates: {job.start_date} → {job.end_date || "TBD"}</div>
          <div>Pay: {job.pay}</div>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-8 text-white/74">{job.description}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="glass rounded-[28px] border border-white/10 p-6">
              <div className="text-sm text-white/65">Ready to move fast?</div>
              <div className="mt-3 text-lg font-semibold text-white">Submit your application with a short message.</div>
            </div>

            {userId ? (
              isJobOwner ? (
                <div className="glass rounded-[28px] border border-white/10 p-6 text-white/70">
                  You cannot apply to your own job posting.
                </div>
              ) : existingApplication ? (
                <div className="glass rounded-[28px] border border-white/10 p-6 text-white/70">
                  You have already applied to this job. Your application status is <span className="font-medium text-white">{existingApplication.status}</span>.
                </div>
              ) : (
                <ApplicationForm jobId={id} />
              )
            ) : (
              <div className="glass rounded-[28px] border border-white/10 p-6 text-white/70">
                <div className="mb-3 text-lg font-semibold text-white">Sign in to apply</div>
                <p className="text-sm text-white/65">
                  Create an account or log in to submit your message and connect with the hiring manager.
                </p>
                <Link href="/login">
                  <Button className="mt-5">Sign in</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="glass rounded-[28px] border border-white/10 p-6">
            <div className="text-sm text-white/65">Job details</div>
            <div className="mt-5 space-y-3 text-sm text-white/75">
              <div>
                <span className="font-semibold text-white">Location:</span> {job.location}
              </div>
              <div>
                <span className="font-semibold text-white">Dates:</span> {job.start_date} → {job.end_date || "TBD"}
              </div>
              <div>
                <span className="font-semibold text-white">Pay:</span> {job.pay}
              </div>
              <div>
                <span className="font-semibold text-white">Role:</span> {job.role}
              </div>
              <div>
                <span className="font-semibold text-white">Urgency:</span> {job.urgency.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
