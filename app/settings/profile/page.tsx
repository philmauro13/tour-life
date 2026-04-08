import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/actions/profiles";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";

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

  return <ProfileSettingsForm profile={profile} />;
}
