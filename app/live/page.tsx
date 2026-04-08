import { JobCard } from "@/components/jobs/job-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getJobs } from "@/lib/actions/jobs";

export const metadata = {
  title: "Live Jobs",
};

export default async function LiveJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="container-shell py-16">
      <SectionHeading
        eyebrow="Live jobs"
        title="Open calls from tours, production teams, and venues."
        description="Filter by role, city, and urgency. This feed is designed for speed — fast scan, fast decision, fast contact."
      />

      <div className="glass mt-10 rounded-[28px] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input className="input-base" placeholder="Role · FOH, TM, LD, Merch" />
          <input className="input-base" placeholder="Location · City or region" />
          <select className="input-base">
            <option>All urgency levels</option>
            <option>Urgent</option>
            <option>This week</option>
            <option>Planned</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {jobs.length ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="glass rounded-[28px] p-10 text-center text-white/60">
            No live jobs yet. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
