import Link from "next/link";
import { BriefcaseBusiness, FileText, Inbox, Plus, UserCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getUserJobs } from "@/lib/actions/jobs";
import { getUserApplications, getApplicationsReceivedByUser } from "@/lib/actions/applications";
import { ensureProfileForUser } from "@/lib/actions/profiles";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Middleware should handle this
  }

  await ensureProfileForUser();

  const [jobs, applications, receivedApplications] = await Promise.all([
    getUserJobs(user.id),
    getUserApplications(user.id),
    getApplicationsReceivedByUser(user.id),
  ]);

  return (
    <div className="container-shell py-16">
      <div className="mb-10 max-w-3xl">
        <div className="badge bg-white/5 text-cyan-200">Dashboard</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Your touring labor control center.</h1>
        <p className="mt-3 text-sm text-white/65">
          Track active posts, review your applications, and see incoming responses from crews across your tour.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Active job posts" value={String(jobs.length)} icon={<BriefcaseBusiness className="h-5 w-5" />} />
        <StatCard label="Applications submitted" value={String(applications.length)} icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="Applications received" value={String(receivedApplications.length)} icon={<FileText className="h-5 w-5" />} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-[28px] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Posted jobs</h2>
              <p className="mt-2 text-sm text-white/60">Current crew calls you’ve published.</p>
            </div>
            <Link href="/post" className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/10">
              <Plus className="h-4 w-4" /> Post job
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {jobs.length ? (
              jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="font-medium text-white">{job.title}</div>
                  <div className="mt-2 text-sm text-white/55">{job.location} · {job.pay}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                No active posts yet. Create a crew call to start receiving applications from local touring professionals.
              </div>
            )}
          </div>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div>
            <h2 className="text-xl font-semibold">Your applications</h2>
            <p className="mt-2 text-sm text-white/60">Everything you’ve applied to so far.</p>
          </div>
          <div className="mt-5 space-y-4">
            {applications.length ? (
              applications.map((application) => (
                <div key={application.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="font-medium text-white">{application.jobs?.title || "Unknown job"}</div>
                  <div className="mt-2 text-sm text-white/65">{application.jobs?.location || "Unknown location"}</div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/55">
                    <UserCheck className="h-4 w-4 text-cyan-200" />
                    <span>Status: {application.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                No applications submitted yet. Browse live jobs and submit a strong application to get noticed.
              </div>
            )}
          </div>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div>
            <h2 className="text-xl font-semibold">Received applications</h2>
            <p className="mt-2 text-sm text-white/60">Responses to the jobs you posted.</p>
          </div>
          <div className="mt-5 space-y-4">
            {receivedApplications.length ? (
              receivedApplications.map((application) => (
                <div key={application.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="font-medium text-white">{application.jobs?.title || "Unknown job"}</div>
                  <div className="mt-2 text-sm text-white/65">From: {application.profiles?.full_name || "Crew member"}</div>
                  <div className="mt-3 text-sm text-white/55">Status: {application.status}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                No applications received yet. Publish a job and keep your posting visible to touring professionals.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
