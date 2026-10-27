# Pathfinder Career Compass

A university student career-exploration portal built with React, TypeScript, Vite, Vercel Functions, and Supabase. The site keeps the supplied DSA logo and orange/charcoal theme, collects student profile details with consent, computes eight explainable exploratory career pathways, and gives authorized university counselors a private submission dashboard.

**This is an exploratory prototype, not a validated psychometric or aptitude instrument.** The score is not a probability or prediction. Read [the assessment method and responsible-use notes](docs/assessment-method.md) and the [five-portal benchmark](research/assessment-benchmark.md) before using it with students.

## What is included

- Public student journey: Name, Registration number, Program, Semester, broad study area, consent, 30 original interest prompts, three selected work values, six workstyle preferences, and eight self-rated skill areas.
- Student report: six interest-theme scores, selected work values, separate self-reported workstyle and skill-confidence snapshots, eight ranked occupations, a visually highlighted leading pathway, explanations, degree-preserving skill/course-topic bridges, starter projects, supervised-experience ideas, and advisor prompts.
- Counselor portal: Supabase Auth sign-in, server-verified allowlist, record search/filtering and pagination, report review, and CSV export.
- Private Supabase storage through Vercel serverless functions. The service-role key is never placed in browser code. RLS is enabled and direct public table access is revoked.
- A clearly labeled sample report that uses no student data and is never saved.

## Before launch: university decisions

Before inviting students, an authorized university administrator must supply the institution's privacy/contact details, decide and publish an assessment-record retention period and deletion process, approve appropriate student language/consent and any required ethics/privacy review, and define which staff may counsel students. The supplied consent copy says to ask the advisor about local data-retention policy because the university's policy was not provided. Replace or expand that copy with the approved university notice before production use. Restrict counselor accounts to staff who need these records.

The public submission endpoint requires a same-origin browser `Origin`, includes strict server validation and a honeypot, but this starter does not implement a distributed rate limiter or CAPTCHA. Before broadly distributing the open student link, configure and test appropriate platform/API rate limiting and monitor Supabase usage.

The initial 18 occupation profiles and broad degree-to-career bridges are portable examples, not a local job-market feed or the university's actual course catalogue. There are no salary, job-growth, or demand claims. O*NET is labeled as U.S.-oriented. Add only verified regional occupation/course data if local recommendations are needed.

## 1. Create and configure Supabase

1. Create a Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard). Keep the database password in a password manager; it is not needed in this application's frontend.
2. In the Supabase project, open **SQL Editor → New query**. Copy and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `assessments` table, timestamps, indexes, JSON result columns, Row Level Security, revokes direct `anon`/`authenticated` access, and grants table access only to the server `service_role`.
3. In **Project Settings → API** (or the current API keys settings page), copy the project URL and the public publishable/anon key. Copy the **service_role / secret key** separately. The public key is designed for browser use; the service-role key is private and bypasses RLS. Do not paste the service key into a browser variable, source file, GitHub, a student message, or a support ticket.
4. In **Authentication → Users**, create a counselor user for each approved staff member. Disable self-service/public sign-ups unless the institution has a reviewed need for them. Use secure passwords and your organization's account lifecycle rules.
5. Copy the counselor's exact sign-in email address for `COUNSELOR_EMAILS`. This allowlist is enforced in the server function in addition to Supabase Auth. A valid Supabase login not on this list cannot view records.
6. Configure and approve the university-specific privacy notice, contact, and retention/deletion policy described above before a real student cohort uses the portal.

Supabase's official [Row Level Security guide](https://supabase.com/docs/guides/database/postgres/row-level-security) explains table policies and roles; this project intentionally has no public policy for student records. Supabase's [Auth documentation](https://supabase.com/docs/guides/auth) covers the counselor account provider.

## 2. Add the project to GitHub

1. Create a **private** GitHub repository for student-data application source unless the university approves a public code repository. Never place student records or real `.env` values in it.
2. Download and unzip the project bundle (or copy the complete contents of this repository) into a local folder. Keep `.env.example`; do not create a committed `.env`.
3. Install Node.js 22 or newer and pnpm 11.25.0, then run `pnpm install --frozen-lockfile` from the project root.
4. If using the Git command line, initialize the folder and push it to the new repository:

   ```bash
   git init -b main
   git add .
   git commit -m "Build Pathfinder Career Compass"
   git remote add origin https://github.com/YOUR-ORG/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   You may instead use GitHub's web upload. Make sure the uploaded root includes `package.json`, `pnpm-lock.yaml`, `vercel.json`, `api/`, `src/`, `server/`, `public/`, `supabase/`, and `docs/`.
5. Check the repository for secrets before every push. The included `.gitignore` excludes local env files, dependency folders, and build output.

Vercel's [Git deployment guide](https://vercel.com/docs/git) describes automatic preview and production deploys when a connected Git repository changes.

## 3. Deploy the GitHub repository on Vercel

1. Sign in at [vercel.com](https://vercel.com/), select **Add New → Project**, and import the GitHub repository. Approve the requested repository access only for this project if practical.
2. Set the framework preset to **Vite** (Vercel normally detects it), root directory to the repository root, install command to `pnpm install --frozen-lockfile`, build command to `pnpm build`, and output directory to `dist`. The checked-in `vercel.json` contains these settings.
3. Under the Vercel project's **Settings → Environment Variables**, add the following to **Production** and to **Preview** only if you intend to test with a separate, non-production Supabase project:

   ```text
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_ANON_KEY=YOUR_PUBLIC_PUBLISHABLE_OR_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_PRIVATE_SERVICE_ROLE_OR_SECRET_KEY
   COUNSELOR_EMAILS=advisor@example.edu,second-advisor@example.edu
   ```

   `VITE_*` values are embedded in the browser build, so only the Supabase URL and public key belong there. Mark `SUPABASE_SERVICE_ROLE_KEY` as a **Secret** in Vercel and keep it server-side. `SUPABASE_ANON_KEY` is used by the server to verify counselor Auth sessions. Use the same URL for both variable names; do not include spaces around comma-separated emails.
4. Save the variables and redeploy, because Vite's `VITE_*` values are read during build.
5. When the deployment succeeds, open the assigned `*.vercel.app` production domain. Verify `/`, `/assessment`, `/results`, and `/counselor` load directly. Verify the sample report works and is explicitly labeled.
6. Using a test student (never a real student until the university has approved the notice and controls), complete the assessment. Confirm only a confirmed server response takes the browser to the “saved” results view. In Supabase's table editor, confirm a row appears. Try an unauthenticated request to `/api/admin/assessments` and confirm it returns **401**; sign in with an allowlisted counselor and confirm the record appears; confirm an authenticated but non-allowlisted account gets **403**.
7. Verify the browser bundle does not contain the service-role key, then assign a production domain if desired. New pushes to the configured production branch trigger production deployments; branch/PR builds are previews according to your Vercel settings.

See Vercel's [Vite guide](https://vercel.com/docs/frameworks/frontend/vite) and [environment variable guide](https://vercel.com/docs/environment-variables) for current dashboard labels and deployment behavior.

## 4. Local development

1. Copy `.env.example` to `.env.local` for local use, fill in values from your non-production Supabase project, and keep the file untracked. Never use real student information in development.
2. Install dependencies and run the frontend:

   ```bash
   pnpm install --frozen-lockfile
   pnpm dev
   ```

   Vite Preview intentionally returns a clear 503 setup notice for `/api/*` and does not save data. The sample report remains available so the interface can be reviewed without credentials.
3. To exercise the real Vercel functions locally, use the Vercel CLI after linking the repository to a Vercel project. Add local environment variables with `vercel env pull .env.local` (or create a protected local env file), then run `pnpm dev:vercel`. Review the Vercel CLI instructions and avoid connecting a local test to production data.
   If the CLI is not installed, install it with `pnpm add --global vercel` before using the `dev:vercel` script.
4. Run `pnpm typecheck` and `pnpm build` before pushing changes.

## Environment reference

| Variable | Used by | Visibility |
|---|---|---|
| `VITE_SUPABASE_URL` | Browser Auth client | Public; compiled into frontend |
| `VITE_SUPABASE_ANON_KEY` | Browser Auth client | Public; compiled into frontend |
| `SUPABASE_URL` | Vercel API functions | Server environment |
| `SUPABASE_ANON_KEY` | Server-side Supabase Auth token verification | Server environment; public-key value, but keep outside source code |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel API database operations | **Secret; server-only** |
| `COUNSELOR_EMAILS` | Counselor authorization allowlist | Server environment; emails are case-insensitive and comma-separated |

`.env.example` contains placeholders only. If any real secret is exposed, rotate it in Supabase/Vercel immediately.

## Deployment and privacy limitations

No Supabase project credentials, counselor emails, GitHub repository, Vercel account, regional occupation feed, or university course catalogue were supplied in this build session. The project is therefore prepared for those services but not connected to your accounts or published. This folder contains source and deployment instructions; the deployment becomes live only after you configure the actual accounts and deploy a successful Vercel production build.

This code is not a substitute for institution-specific privacy/legal review, a psychometric validation study, licensed career counseling, or official course/job-market data. The published assessment and matching parameters should be versioned and evaluated with qualified university staff before stronger claims are made.
