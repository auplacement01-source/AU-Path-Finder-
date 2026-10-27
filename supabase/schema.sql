-- Pathfinder Career Compass: apply in Supabase SQL Editor before accepting student data.
-- Student records contain identifiable educational information. Do not add public access policies.

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  student_name text not null check (char_length(student_name) between 2 and 120),
  registration_number text not null check (char_length(registration_number) between 1 and 80),
  program text not null check (char_length(program) between 2 and 160),
  semester text not null check (char_length(semester) between 1 and 40),
  degree_field text not null check (degree_field in (
    'computing', 'business', 'engineering', 'data', 'social', 'education',
    'health', 'environment', 'arts', 'humanities', 'public', 'other'
  )),
  instrument_version text not null check (char_length(instrument_version) <= 80),
  consent_version text not null check (char_length(consent_version) <= 80),
  consented_at timestamptz not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  result jsonb not null check (jsonb_typeof(result) = 'object')
);

create index if not exists assessments_created_at_desc_idx
  on public.assessments (created_at desc);
create index if not exists assessments_program_idx
  on public.assessments (program);
create index if not exists assessments_semester_idx
  on public.assessments (semester);

alter table public.assessments enable row level security;

-- All assessment writes and reads go through Vercel serverless functions.
-- The server verifies request shape for submissions and verifies Supabase Auth plus
-- COUNSELOR_EMAILS before counselor reads. Never create anon/authenticated policies here.
revoke all on table public.assessments from anon, authenticated;
grant all on table public.assessments to service_role;

comment on table public.assessments is
  'Pathfinder identifiable student exploration responses; private, counselor-restricted educational records.';
