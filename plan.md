# Pathfinder Career Compass — implementation plan

## Product and implementation approach

Build a mobile-ready university career exploration portal that begins with the supplied Logo-DSA mark and a public student assessment, then presents a transparent profile and **8 ranked occupation pathways** (within the requested 5–10 range). Spotlight the leading exploratory match in a bright brand-orange feature card. “Bright” means visual emphasis only; the interface will not imply an employment-demand outlook without localized, sourced labor-market data.

Students provide the requested **Name, Registration, Program, and Semester**, plus an explicit privacy/assessment consent. The experience will explain that results are for educational exploration—not diagnosis, hiring, or a prediction of ability, success, or employability. No gender, age, health, or other unnecessary sensitive data will be requested. The portal will offer a clear contact/advisor next step.

The assessment will keep constructs distinct: custom, activity-based RIASEC interest prompts; work-value priorities; workplace-style preferences; and student self-ratings of selected skills. Skill ratings will be called self-reported confidence/exposure, not objective aptitude. Scoring will use a documented, deterministic, versioned occupational-profile comparison; the first version's component weights are design hypotheses, not empirically established parameters. For each suggested occupation, show the component signals, matching rationale, relevant tasks/skills, and a “keep your degree—build a bridge” action plan with complementary course topics, projects, electives, experience, and advisor prompts. Degree relevance and skill-bridge ideas will be separated from interest-fit scoring so an unfamiliar pathway is not silently suppressed. Results are suggestions, not probabilities. An “emerging / mixed / clearer exploration signal” may describe response differentiation only; it must never be called a psychometric confidence interval.

This restraint follows the benchmark: platforms distinguish interests, values, skills, and aptitude; make pathway connections and next steps visible; and encourage counselor interpretation. Benchmark sources do not justify an accuracy guarantee for a new instrument or any claim of objectively correct individual career fit. The implementation will also follow current university guidance toward explainable recommendations and human support; AI will not make career decisions or invent validation. See the [five-portal benchmark](research/assessment-benchmark.md), OpenPsychometrics' explicit use disclaimer, [O*NET's distinction between interests, values, and abilities](https://www.dol.gov/agencies/eta/onet/tools), and the 2026 systematic review's cautions on explainability, automation bias, human-in-the-loop advising, and the lack of longitudinal evaluation ([Frontiers in Education, 2026](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1787689/full)).

### Recommended stack and data flow

Use **React + TypeScript + Vite** for the student and counselor interfaces, with Vercel's TypeScript serverless functions under `/api` and **Supabase Postgres + Supabase Auth** for persistence and counselor sign-in. This respects the requested deployment services rather than coupling data to the Manus-hosted database.

A student submission will be re-validated and scored on the server, then inserted using a server-only Supabase service-role key. The browser will never receive that key. Row-level security will be enabled on the assessment table without public read/write policies; counselor result reads will go through a serverless endpoint that verifies a Supabase Auth token and a `COUNSELOR_EMAILS` allowlist. Public code cannot query student records directly. Required environment values will be documented in `.env.example`; actual secrets belong only in local ignored `.env` or Vercel environment settings. Without Supabase configuration, the live submission flow will give a setup error rather than imply student data was saved.

The counselor portal will show submitted student details and results with search/filtering and CSV export. Access is restricted to pre-created Supabase Auth counselors explicitly listed in the server environment. Students do not need to create accounts.

The user has not specified a country, institutional program catalogue, or local labor-market feed. Version one will therefore avoid salary and job-growth promises, use portable occupation descriptions and course-topic recommendations, and label links to external labor-market tools by geography. Institution-specific majors, available electives, local course providers, and national job outlook can be added later from verified catalogues.

## Proposed project structure

- `public/`: supplied logo, favicon/brand assets, and the webdev route manifest.
- `src/components/`: accessible shared shell, progress/scale components, student form, questionnaire steps, results cards, and counselor dashboard.
- `src/data/`: versioned questionnaire, RIASEC/value/workstyle constructs, occupation profiles, degree-field transfer maps, and skill-bridge suggestions.
- `src/lib/`: shared types, form validation, deterministic match calculations, formatting, and CSV export.
- `src/pages/`: public assessment/results state and protected counselor sign-in/dashboard routes.
- `api/`: Vercel serverless submission and counselor-read endpoints, shared server-side Supabase and authorization helpers.
- `supabase/schema.sql`: assessment table, indexes, grants, RLS, and counselor Auth setup notes.
- `research/assessment-benchmark.md`: sourced comparison of five relevant portals.
- `docs/assessment-method.md`: constructs, scoring/versioning, limitations, intended use, and a responsible local pilot/validation plan.
- Root configuration and handoff: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, TypeScript/Vite configuration, `vercel.json`, `.env.example`, `.gitignore`, and a step-by-step `README.md` for GitHub, Supabase, and Vercel.

## Visual design

- **Design movement:** A warm editorial career-planning notebook, adapted from the user's orange-and-charcoal institutional logo.
- **Core principles:** Clearly separate evidence from interpretation; reassure rather than label students; keep each decision legible; make recommendations actionable and accessible.
- **Color philosophy:** Use the logo's orange as the ownable, optimistic accent; charcoal/graphite grounds institutional trust; warm off-white supports long questionnaire sessions. Teal/blue may distinguish secondary profile dimensions but will remain secondary. Text and controls will meet contrast requirements; orange will not carry meaning by itself.
  - **Layout paradigm:** An editorial, left-anchored progression rail for assessment steps; spacious, single-column question cards; a results “career map” that moves from profile to top match to bridge plan; a compact counselor workspace optimized for scanning rather than decorative tiles.
  - **Signature elements:** A fine-line RIASEC compass/ring; a degree-to-career bridge ribbon; one orange spotlight for the leading exploratory match.
  - **Interaction philosophy:** One question per card or small group, clear response labels, visible progress, editable previous answers, keyboard and screen-reader support, and no forced fast response. Motion is subtle, optional, and respects reduced-motion settings.
  - **Typography system:** Manrope for headings and DM Sans for body/interface text, with a restrained scale and generous line height.
  - **Brand essence:** “A clear next step from the degree you are already building.” Curious, practical, encouraging.
  - **Brand voice:** Warm, plain-spoken, non-deterministic. Examples: “Your degree is a starting point—not a box.” “Explore the pattern. Keep what fits; question what doesn’t.”
  - **Wordmark & logo:** Keep the supplied DSA logo as the institutional signature in the header/footer and use a small original compass/bridge glyph for Pathfinder UI accents; never redraw or replace the supplied mark.
- **Signature brand color:** DSA orange sampled visually from the supplied mark, paired with graphite rather than a generic blue SaaS theme.

## Implementation and launch status

The approved design has been implemented as a React/TypeScript student portal and counselor workspace, with Supabase schema and protected Vercel functions, source documentation, and GitHub/Vercel deployment instructions. TypeScript and production build checks pass, and the route manifest and SPA endpoints were verified locally. A downloadable source bundle is included separately.

The project is not yet live in the user's accounts. Production use still requires the institution's privacy/retention and rate-control decisions, a user's Supabase project and private Vercel environment values, creation of counselor Auth accounts and allowlist, a GitHub repository/Vercel connection, and a pilot submission using test data. The included README documents these steps; do not send service-role secrets in chat or commit them.
