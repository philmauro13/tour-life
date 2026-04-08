import { Application, Job, Profile } from "@/types";

export const mockJobs: Job[] = [
  {
    id: "job-1",
    created_by: "user-1",
    title: "FOH Engineer Needed for 3-Show Midwest Run",
    role: "Front of House Engineer",
    location: "Chicago, IL",
    start_date: "2026-04-18",
    end_date: "2026-04-21",
    pay: "$450/day + hotel",
    urgency: "urgent",
    description:
      "National alternative act needs an experienced FOH engineer comfortable on M32 and festival changeovers. Must be calm under pressure and fast with scenes.",
    status: "open",
    created_at: "2026-04-07T09:00:00.000Z",
    updated_at: "2026-04-07T09:00:00.000Z",
  },
  {
    id: "job-2",
    created_by: "user-2",
    title: "Merch Seller for Weekend Fly Dates",
    role: "Merchandise",
    location: "Los Angeles, CA",
    start_date: "2026-04-22",
    end_date: "2026-04-24",
    pay: "$300/day + buyout",
    urgency: "this_week",
    description:
      "Looking for a polished merch seller who can handle cash, inventory, and VIP bundle fulfillment for a sold-out weekend.",
    status: "open",
    created_at: "2026-04-06T18:30:00.000Z",
    updated_at: "2026-04-06T18:30:00.000Z",
  },
  {
    id: "job-3",
    created_by: "user-3",
    title: "Touring LD + Timecode Operator",
    role: "Lighting Director",
    location: "Nashville, TN",
    start_date: "2026-05-03",
    end_date: "2026-05-26",
    pay: "$1,800/week",
    urgency: "planned",
    description:
      "Support package needs a touring LD who can run playback-integrated cues, maintain files, and coordinate with house LDs nightly.",
    status: "open",
    created_at: "2026-04-05T16:10:00.000Z",
    updated_at: "2026-04-05T16:10:00.000Z",
  },
];

export const mockProfiles: Profile[] = [
  {
    id: "user-1",
    username: "casey-fader",
    full_name: "Casey Fader",
    primary_role: "Front of House Engineer",
    city: "Chicago, IL",
    bio: "Touring FOH engineer focused on modern rock, pop routing, and fast festival turnovers.",
    avatar_url: null,
    specialties: ["M32", "CL5", "Festival changeovers"],
    experience_summary: "8 years touring clubs, theaters, and festivals.",
    created_at: "2026-01-02T00:00:00.000Z",
    updated_at: "2026-04-07T00:00:00.000Z",
  },
  {
    id: "user-2",
    username: "maya-merch",
    full_name: "Maya Brooks",
    primary_role: "Merchandise Manager",
    city: "Los Angeles, CA",
    bio: "Merch ops lead with venue, VIP, and nightly settlement experience.",
    avatar_url: null,
    specialties: ["Settlement", "Inventory", "VIP"],
    experience_summary: "Handled merch for 120+ show runs and festival activations.",
    created_at: "2026-02-10T00:00:00.000Z",
    updated_at: "2026-04-07T00:00:00.000Z",
  },
];

export const mockApplications: Application[] = [
  {
    id: "app-1",
    job_id: "job-1",
    user_id: "user-2",
    message: "Available and local. I can fly if needed and have references from two current touring PMs.",
    status: "reviewing",
    created_at: "2026-04-07T11:30:00.000Z",
  },
];
