# Tour Crew Network

Premium marketplace for touring and live production labor, built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Local development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file with the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These values are required for Supabase auth, session handling, and data access.

## Available scripts

- `npm run dev` — run the development server
- `npm run build` — build the app for production
- `npm run start` — run the production build locally
- `npm run lint` — run lint checks

## Deployment on Vercel

This app is ready for Vercel deployment.

1. Connect the repository in Vercel.
2. Add environment variables in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Use the default build command:

```bash
npm run build
```

4. If prompted, set the output directory to `.next`.

## Project overview

- `app/` — App Router pages, layouts, and route handlers
- `components/` — reusable UI components
- `lib/` — Supabase utilities and action helpers
- `supabase/schema.sql` — database schema for profiles, jobs, and applications

## Notes

- Auth-protected pages use Supabase session-aware routing.
- Users without a profile row are automatically repaired on sign-in.
- Core flows include live jobs, job posting, applications, dashboard, and profile settings.

For launch, confirm Supabase credentials are stored securely in Vercel and remove any local test/demo data before publishing.
