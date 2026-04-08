export type Urgency = "urgent" | "this_week" | "planned";
export type JobStatus = "open" | "filled" | "closed";
export type ApplicationStatus = "submitted" | "reviewing" | "accepted" | "declined";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  primary_role: string;
  city: string;
  bio: string | null;
  avatar_url: string | null;
  specialties?: string[];
  experience_summary?: string | null;
  resume_url?: string | null;
  availability?: string | null;
  years_experience?: number | null;
  travel_readiness?: string | null;
  portfolio_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  created_by: string;
  title: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  pay: string;
  urgency: Urgency;
  description: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  message: string;
  status: ApplicationStatus;
  created_at: string;
}
