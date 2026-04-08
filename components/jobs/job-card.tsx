import Link from "next/link";
import { MapPin, CalendarDays, Zap } from "lucide-react";
import { Job } from "@/types";

const urgencyStyles = {
  urgent: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  this_week: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  planned: "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
};

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="glass group block rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-sm font-medium text-cyan-200">{job.role}</div>
          <h3 className="text-xl font-semibold text-white transition group-hover:text-violet-200">
            {job.title}
          </h3>
        </div>
        <div className={`badge ${urgencyStyles[job.urgency]}`}>
          <Zap className="h-3.5 w-3.5" />
          {job.urgency.replace("_", " ")}
        </div>
      </div>

      <div className="grid gap-3 text-sm text-white/68 md:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-white/40" />
          {job.location}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/40" />
          {job.start_date} {job.end_date ? `→ ${job.end_date}` : ""}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
        <div className="text-sm text-white/55">Compensation</div>
        <div className="text-sm font-semibold text-white">{job.pay}</div>
      </div>
    </Link>
  );
}
