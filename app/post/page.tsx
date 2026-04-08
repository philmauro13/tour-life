import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input, Textarea } from "@/components/forms/input";
import { createJob } from "@/lib/actions/jobs";

export const metadata = {
  title: "Post a Job",
};

export default function PostJobPage() {
  return (
    <div className="container-shell py-16">
      <SectionHeading
        eyebrow="Post a crew need"
        title="Create a clean, credible listing in minutes."
        description="Built for production managers, tour managers, and teams who need the right person fast."
      />

      <form action={createJob} className="glass mt-10 grid rounded-[32px] p-6 md:grid-cols-2 md:gap-6 md:p-8">
        <div className="space-y-2">
          <label className="text-sm text-white/65">Role</label>
          <Input name="role" placeholder="FOH Engineer" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Title</label>
          <Input name="title" placeholder="FOH Engineer Needed for 4-Show Run" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Location</label>
          <Input name="location" placeholder="Chicago, IL" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Pay</label>
          <Input name="pay" placeholder="$450/day + hotel" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">Start date</label>
          <Input name="startDate" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/65">End date</label>
          <Input name="endDate" type="date" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/65">Urgency</label>
          <select name="urgency" className="input-base" required>
            <option value="urgent">Urgent</option>
            <option value="this_week">This week</option>
            <option value="planned">Planned</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/65">Description</label>
          <Textarea name="description" placeholder="Describe the run, console/package, expectations, travel details, and anything that helps the right crew member self-select quickly." required />
        </div>
        <div className="mt-4 md:col-span-2">
          <Button type="submit">Publish job</Button>
        </div>
      </form>
    </div>
  );
}
