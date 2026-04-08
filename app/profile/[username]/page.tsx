import { notFound } from "next/navigation";
import { getProfile } from "@/lib/actions/profiles";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container-shell py-16">
      <div className="glass-strong rounded-[32px] p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="badge bg-white/5 text-cyan-200">Public profile</div>
            <h1 className="mt-4 text-4xl font-semibold">{profile.full_name}</h1>
            <div className="mt-3 text-lg text-white/65">{profile.primary_role} · {profile.city}</div>
            <p className="mt-6 max-w-2xl leading-8 text-white/72">{profile.bio}</p>
          </div>
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-3xl font-semibold text-violet-200">
            {profile.full_name.charAt(0)}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-[28px] p-6">
            <h2 className="text-lg font-semibold">Specialties</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.specialties?.map((specialty: string) => (
                <span key={specialty} className="badge bg-white/5 text-white/75">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          <div className="glass rounded-[28px] p-6">
            <h2 className="text-lg font-semibold">Experience summary</h2>
            <p className="mt-4 text-white/68 leading-7">{profile.experience_summary}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {profile.years_experience && (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-lg font-semibold">Years of Experience</h2>
              <p className="mt-4 text-2xl font-bold text-cyan-400">{profile.years_experience} years</p>
            </div>
          )}
          {profile.availability && (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-lg font-semibold">Availability</h2>
              <p className="mt-4 text-white/68 leading-7">{profile.availability}</p>
            </div>
          )}
          {profile.travel_readiness && (
            <div className="glass rounded-[28px] p-6">
              <h2 className="text-lg font-semibold">Travel Readiness</h2>
              <p className="mt-4 text-white/68 leading-7">{profile.travel_readiness}</p>
            </div>
          )}
        </div>

        {(profile.resume_url || profile.portfolio_url) && (
          <div className="mt-6 glass rounded-[28px] p-6">
            <h2 className="text-lg font-semibold">Links</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Resume
                </a>
              )}
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Portfolio
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
