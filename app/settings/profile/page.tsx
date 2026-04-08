import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/forms/input";
import { getCurrentUserProfile, updateProfile } from "@/lib/actions/profiles";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Edit Profile",
};

export default async function SettingsProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container-shell py-16">
      <div className="mb-8">
        <div className="badge bg-white/5 text-violet-200">Profile settings</div>
        <h1 className="mt-4 text-4xl font-semibold">Shape how production teams see you.</h1>
      </div>

      <form action={updateProfile} className="glass rounded-[32px] p-6 md:grid md:grid-cols-2 md:gap-6 md:p-8">
        <div className="space-y-2">
          <label className="text-sm text-white/65">Full name</label>
          <Input name="fullName" defaultValue={profile.full_name} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Username</label>
          <Input name="username" defaultValue={profile.username} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Primary role</label>
          <Input name="primaryRole" defaultValue={profile.primary_role} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">City</label>
          <Input name="city" defaultValue={profile.city} required />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/65">Bio</label>
          <Textarea name="bio" defaultValue={profile.bio || ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/65">Experience summary</label>
          <Textarea name="experienceSummary" defaultValue={profile.experience_summary || ""} />
        </div>
        <div className="mt-4 md:col-span-2">
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </div>
  );
}
