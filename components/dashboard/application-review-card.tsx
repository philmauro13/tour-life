import { format } from "date-fns";
import { Calendar, MapPin, User, FileText, ExternalLink, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/lib/actions/applications";

interface ApplicationWithDetails {
  id: string;
  message: string;
  status: string;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    location: string;
    pay: string;
    role: string;
  } | null;
  profiles: {
    id: string;
    username: string;
    full_name: string;
    primary_role: string;
    city: string;
    bio: string | null;
    experience_summary: string | null;
    resume_url: string | null;
    availability: string | null;
    years_experience: number | null;
    travel_readiness: string | null;
    portfolio_url: string | null;
  } | null;
}

interface ApplicationReviewCardProps {
  application: ApplicationWithDetails;
}

export function ApplicationReviewCard({ application }: ApplicationReviewCardProps) {
  const profile = application.profiles;
  const job = application.jobs;

  if (!profile || !job) {
    return null;
  }

  const statusColors = {
    submitted: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    reviewing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    accepted: "text-green-400 bg-green-400/10 border-green-400/20",
    declined: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
      {/* Header with applicant info and status */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{profile.full_name}</h3>
            <p className="text-sm text-white/70">@{profile.username}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile.city}
              </span>
              <span>{profile.primary_role}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[application.status as keyof typeof statusColors] || statusColors.submitted}`}>
          {application.status}
        </div>
      </div>

      {/* Job info */}
      <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
        <h4 className="font-medium text-white mb-1">{job.title}</h4>
        <p className="text-sm text-white/70">{job.role} • {job.location} • {job.pay}</p>
      </div>

      {/* Application message */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Application Message
        </h5>
        <p className="text-sm text-white/70 leading-relaxed">{application.message}</p>
      </div>

      {/* Profile details */}
      <div className="space-y-3">
        {profile.bio && (
          <div>
            <h5 className="text-sm font-medium text-white/80 mb-1">Bio</h5>
            <p className="text-sm text-white/70">{profile.bio}</p>
          </div>
        )}

        {profile.experience_summary && (
          <div>
            <h5 className="text-sm font-medium text-white/80 mb-1">Experience</h5>
            <p className="text-sm text-white/70">{profile.experience_summary}</p>
          </div>
        )}

        {profile.availability && (
          <div>
            <h5 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Availability
            </h5>
            <p className="text-sm text-white/70">{profile.availability}</p>
          </div>
        )}

        {profile.years_experience && (
          <div>
            <h5 className="text-sm font-medium text-white/80 mb-1">Years of Experience</h5>
            <p className="text-sm text-white/70">{profile.years_experience} years</p>
          </div>
        )}

        {profile.travel_readiness && (
          <div>
            <h5 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Travel Readiness
            </h5>
            <p className="text-sm text-white/70">{profile.travel_readiness}</p>
          </div>
        )}

        {profile.portfolio_url && (
          <div>
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Portfolio
            </a>
          </div>
        )}

        {profile.resume_url && (
          <div>
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Resume
            </a>
          </div>
        )}
      </div>

      {/* Footer with application date and actions */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Calendar className="w-3 h-3" />
            Applied {format(new Date(application.created_at), "MMM d, yyyy 'at' h:mm a")}
          </div>
          
          <div className="flex items-center gap-2">
            {application.status === 'submitted' && (
              <form action={updateApplicationStatus} className="inline">
                <input type="hidden" name="applicationId" value={application.id} />
                <input type="hidden" name="status" value="reviewing" />
                <Button type="submit" variant="secondary" className="text-xs px-3 py-1 h-7">
                  <Eye className="w-3 h-3 mr-1" />
                  Review
                </Button>
              </form>
            )}
            
            {application.status === 'reviewing' && (
              <>
                <form action={updateApplicationStatus} className="inline">
                  <input type="hidden" name="applicationId" value={application.id} />
                  <input type="hidden" name="status" value="accepted" />
                  <Button type="submit" variant="secondary" className="text-xs px-3 py-1 h-7 text-green-400 hover:bg-green-400/10">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                </form>
                
                <form action={updateApplicationStatus} className="inline">
                  <input type="hidden" name="applicationId" value={application.id} />
                  <input type="hidden" name="status" value="declined" />
                  <Button type="submit" variant="secondary" className="text-xs px-3 py-1 h-7 text-red-400 hover:bg-red-400/10">
                    <XCircle className="w-3 h-3 mr-1" />
                    Decline
                  </Button>
                </form>
              </>
            )}
            
            {(application.status === 'accepted' || application.status === 'declined') && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                application.status === 'accepted' 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {application.status === 'accepted' ? 'Accepted' : 'Declined'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}