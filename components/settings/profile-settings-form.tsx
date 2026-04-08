"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/forms/input";
import { Profile } from "@/types";
import { updateProfile } from "@/lib/actions/profiles";

interface ProfileSettingsFormProps {
  profile: Profile;
}

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      await updateProfile(formData);
      startTransition(() => {
        setStatus("success");
        setMessage("Profile saved successfully.");
        router.refresh();
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to save profile.";
      setStatus("error");
      setMessage(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container-shell py-16">
      <div className="mb-8">
        <div className="badge bg-white/5 text-violet-200">Profile settings</div>
        <h1 className="mt-4 text-4xl font-semibold">Shape how production teams see you.</h1>
      </div>

      {status === "success" && (
        <div className="mb-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-[32px] p-6 md:grid md:grid-cols-2 md:gap-6 md:p-8">
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
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/65">Specialties</label>
          <Input
            name="specialties"
            defaultValue={profile.specialties?.join(", ") || ""}
            placeholder="Add comma-separated specialties"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Resume URL</label>
          <Input name="resumeUrl" type="url" defaultValue={profile.resume_url || ""} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Availability</label>
          <Input
            name="availability"
            defaultValue={profile.availability || ""}
            placeholder="e.g., Available immediately, 2 weeks notice"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Years of Experience</label>
          <Input
            name="yearsExperience"
            type="number"
            min="0"
            defaultValue={profile.years_experience ?? ""}
            placeholder="e.g., 5"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Travel Readiness</label>
          <Input
            name="travelReadiness"
            defaultValue={profile.travel_readiness || ""}
            placeholder="e.g., Willing to travel anywhere, US only, Local only"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Portfolio URL</label>
          <Input name="portfolioUrl" type="url" defaultValue={profile.portfolio_url || ""} placeholder="https://..." />
        </div>
        <div className="mt-4 md:col-span-2">
          <Button type="submit" disabled={isSaving || isPending}>
            {isSaving || isPending ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
