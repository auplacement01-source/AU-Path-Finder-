# Pathfinder assessment method and responsible use

## What this first version asks about

Pathfinder is an educational career-exploration tool. It is not a clinical instrument, a hiring screen, a selection test, or a forecast of who will succeed in an occupation. A score does not determine a student's ability, identity, degree choice, or future.

The 30 original activity prompts are distributed evenly over six Holland-style RIASEC interest themes. They ask how appealing work activities sound, using a five-point response scale. They are inspired by the broad interest framework and the user's OpenPsychometrics RIASEC reference; they are **not** the 48 IIP RIASEC Markers items, an O*NET Interest Profiler form, or a psychometrically equivalent or validated substitute. OpenPsychometrics itself describes its 48-item test as educational/entertainment use and gives no accuracy or fitness guarantee for it [1]. O*NET's separate Interest Profiler has its own instruments and published development evidence; that evidence cannot be transferred to Pathfinder's custom questions [2] [3].

Students also select three work values from eight plain-language choices. Six workstyle responses represent preferences such as collaboration, structure, autonomy, pace, people contact, and hands-on work. Eight skill ratings are self-reported familiarity/confidence. None is an objective aptitude test or a formal broad personality inventory. These constructs are deliberately labeled separately: the U.S. Department of Labor's career-exploration framework also distinguishes interests, work importance, and abilities [4].

## Matching method

The first version ranks 18 curated occupation profiles and returns the eight highest-scoring options, within the requested range of 5–10. Profiles contain illustrative RIASEC emphasis, work values, workstyle targets, common skill areas, example work activities, and bridge ideas. They are hand-curated product prototypes, **not official O*NET job profiles**, locally calibrated norms, or labor-market predictions.

The displayed 0–100 **exploration-alignment index** combines four components using provisional design weights: 50% RIASEC activity-interest profile similarity, 15% self-rated skill overlap, 20% value overlap, and 15% workstyle similarity. Interest shape is compared by Pearson correlation across the six interest dimensions and linearly mapped from −1…+1 to 0…100; a profile with no variation receives a neutral 50 rather than an invented distinction. Selected values are compared with the occupation's illustrative values using Jaccard overlap. Self-rated skills are compared with skill-importance ratings, weighted by the occupation's profile. Workstyle uses average closeness on a one-to-five scale. The application calculates the same deterministic score on the server after validating the submitted responses.

These weights and prototype profiles have **not** been validated, normed, or estimated from Pathfinder student outcomes. The index is neither a probability, percentile, test grade, nor likelihood of job success. The component values exist to make the product's current ranking inspectable, not to suggest that two careers separated by a few points are meaningfully different. The “clearer / some separation / broad or mixed” label describes only the difference between the top two interest-theme scores under a simple product threshold. It is not test reliability, diagnostic confidence, or statistical uncertainty.

A separate “related study area” label checks whether the student's broad selected field appears in an occupation's illustrative field list. It does not inspect the exact degree curriculum and contributes **zero** points to the exploration score. For any pathway—including an adjacent route—the result offers skill topics, a small project, experiential ideas, and a prompt for an academic or career advisor. It is written to support adding a bridge to a current degree, not tell a student to abandon that degree.

## What the portal should not claim

Until a qualified local assessment team evaluates the actual item wording, scoring, occupation data, user experience, and outcomes, Pathfinder should not claim that it is accurate, reliable, predictive, validated, comprehensive, unbiased, clinically meaningful, or able to identify a student's objectively “best” career. Evidence about the general RIASEC theory, a different RIASEC test, product adoption, a vendor's prior product, or an intervention study is not evidence that this instrument predicts an individual outcome. Results should not be used for admissions, progression, employment selection, scholarship awards, mental-health decisions, or any other high-stakes decision.

A student may disagree with a suggestion, have changing interests, face constraints that this questionnaire does not capture, or have skills that improve with instruction. Encourage students to question, compare, and revise the options with a trusted advisor. O*NET links are clearly labeled as U.S.-oriented resources; salaries, demand, licenses, and qualifications vary by location. The portal does not currently integrate verified regional labor-market data or the university's live course catalogue.

## Data and student safeguards

Before answering, students see that their name, registration number, program, semester, broad study area, answers, and generated report are saved for authorized university career staff. The site asks for explicit agreement before proceeding and avoids collecting age, gender, health details, or other unnecessary demographics. Student assessment rows have Row Level Security enabled, public table privileges are revoked, and record reads go through a server endpoint that verifies Supabase Auth and a counselor-email allowlist. The Supabase service-role key is server-only and must never be exposed to browser code or committed to GitHub.

Before live student collection, the institution should insert its own contact details, privacy notice, retention period, record-access process, deletion process, and applicable legal/IRB review. A named university privacy officer or administrator should confirm the arrangements. This starter does not invent those local policies. Limit counselor access to staff with a genuine advising purpose; avoid sending student reports in public links or unrestricted email.

## Responsible local pilot before making stronger claims

A prudent first launch is a voluntary, clearly described pilot with staff oversight. Before inviting students, career-psychology experts and academic advisors should review item coverage, plain-language meaning, accessibility, occupational profiles, value/style definitions, cultural assumptions, and the relevance of the degree-to-career bridges. Test comprehension with a small, diverse group of students and revise confusing wording without treating a quick usability exercise as validation.

After institutional ethics/privacy approval where required, collect only the responses needed to evaluate the tool. Report the tested version, population, completion/missing-response rates, and limitations. Consider internal consistency for each multi-item interest scale, test–retest stability over a suitable interval, response-process evidence, and fairness analyses across relevant student groups. Evaluate career recommendations against independent advisor/student judgments and longitudinal student-reported usefulness; a short-term engagement survey alone does not establish prediction. Ask a qualified psychometrician to select appropriate samples, methods, and thresholds before interpreting statistics. Preserve student agency, review errors with human advisors, and version any item, profile, or scoring change so results from different versions are not conflated.

Current practice is also moving toward explainable, human-supported career services rather than opaque automated verdicts. A 2026 systematic review of AI career counselling for university students identifies risks from automation bias and limited longitudinal evidence, and recommends explainability, algorithmic audits, and human-in-the-loop models [5]. NACE reports that 86% of career centers in its 2026 benchmarking poll use AI as an assistive tool when working with individual students; this is a survey result about career-center practice, not proof of assessment accuracy [6]. Pathfinder adopts the explainability and human-support direction without using generative AI to decide or embellish a student's result.

## References

[1]: https://openpsychometrics.org/tests/RIASEC/ "Holland Code RIASEC Test — Open-Source Psychometrics Project"
[2]: https://www.onetcenter.org/IP.html "O*NET Interest Profiler — O*NET Resource Center"
[3]: https://www.onetcenter.org/reports/Mini-IP.html "Development of an O*NET Mini Interest Profiler for Mobile Devices"
[4]: https://www.dol.gov/agencies/eta/onet/tools "O*NET Career Exploration Tools — U.S. Department of Labor"
[5]: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1787689/full "Implementation of AI in career counselling for university students — Frontiers in Education"
[6]: https://www.naceweb.org/career-development/trends-and-predictions/ "Trends and Predictions — National Association of Colleges and Employers"
