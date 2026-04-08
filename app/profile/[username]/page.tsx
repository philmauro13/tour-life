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
      </div>
    </div>
  );
}
