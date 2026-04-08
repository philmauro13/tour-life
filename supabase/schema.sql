create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  primary_role text not null,
  city text not null,
  bio text,
  avatar_url text,
  specialties text[] default '{}',
  experience_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  role text not null,
  location text not null,
  start_date date not null,
  end_date date,
  pay text not null,
  urgency text not null check (urgency in ('urgent', 'this_week', 'planned')),
  description text not null,
  status text not null default 'open' check (status in ('open', 'filled', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique(job_id, user_id)
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger jobs_set_updated_at
before update on public.jobs
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

create policy "profiles are viewable by everyone" on public.profiles
for select using (true);

create policy "users can update their own profile" on public.profiles
for update using (auth.uid() = id);

create policy "users can insert their own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "jobs are viewable by everyone" on public.jobs
for select using (true);

create policy "authenticated users can create jobs" on public.jobs
for insert with check (auth.uid() = created_by);

create policy "owners can update their jobs" on public.jobs
for update using (auth.uid() = created_by);

create policy "applications visible to applicant or job owner" on public.applications
for select using (
  auth.uid() = user_id or exists (
    select 1 from public.jobs where jobs.id = applications.job_id and jobs.created_by = auth.uid()
  )
);

create policy "authenticated users can apply" on public.applications
for insert with check (auth.uid() = user_id);
