import { CAREER_PROFILES, type CareerProfile } from "../data/careers";
import { INTEREST_ITEMS } from "../data/assessment";
import {
  INSTRUMENT_VERSION,
  RIASEC,
  RIASEC_NAMES,
  type AssessmentAnswers,
  type AssessmentResult,
  type CareerMatch,
  type DegreeField,
  type MatchComponents,
  type RiasecCode,
  type SkillKey,
  type ValueKey,
} from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value);

export function calculateProfileScores(answers: AssessmentAnswers): Record<RiasecCode, number> {
  return Object.fromEntries(RIASEC.map((code) => {
    const items = INTEREST_ITEMS.filter((item) => item.code === code);
    const mean = items.reduce((sum, item) => sum + (answers.interests[item.id] ?? 0), 0) / items.length;
    return [code, round((mean / 5) * 100)];
  })) as Record<RiasecCode, number>;
}

function pearsonSimilarity(profile: number[], target: number[]): number {
  const meanA = profile.reduce((sum, value) => sum + value, 0) / profile.length;
  const meanB = target.reduce((sum, value) => sum + value, 0) / target.length;
  const centeredA = profile.map((value) => value - meanA);
  const centeredB = target.map((value) => value - meanB);
  const numerator = centeredA.reduce((sum, value, index) => sum + value * centeredB[index], 0);
  const denominator = Math.sqrt(
    centeredA.reduce((sum, value) => sum + value * value, 0) *
    centeredB.reduce((sum, value) => sum + value * value, 0),
  );
  // A flat preference pattern carries little discriminating information, so report neutral affinity.
  if (denominator < 0.0001) return 50;
  return clamp(((numerator / denominator + 1) / 2) * 100);
}

function valueOverlap(selected: ValueKey[], target: ValueKey[]): number {
  const union = new Set([...selected, ...target]);
  const common = selected.filter((value) => target.includes(value)).length;
  return union.size ? (common / union.size) * 100 : 50;
}

function workstyleSimilarity(answers: AssessmentAnswers, career: CareerProfile): number {
  const keys = Object.keys(career.styles) as (keyof typeof career.styles)[];
  const distance = keys.reduce((sum, key) => sum + Math.abs(answers.workstyle[key] - career.styles[key]), 0) / keys.length;
  return clamp((1 - distance / 4) * 100);
}

function selfRatedSkillOverlap(answers: AssessmentAnswers, career: CareerProfile): number {
  const entries = Object.entries(career.skills) as [SkillKey, number][];
  if (!entries.length) return 50;
  let weightedFit = 0;
  let totalWeight = 0;
  for (const [key, importance] of entries) {
    const rating = answers.skills[key];
    if (typeof rating !== "number") continue;
    const closeness = 1 - Math.abs(rating - importance) / 4;
    weightedFit += clamp(closeness * 100) * importance;
    totalWeight += importance;
  }
  return totalWeight ? weightedFit / totalWeight : 50;
}

function explainMatch(answers: AssessmentAnswers, career: CareerProfile, profileScores: Record<RiasecCode, number>): string[] {
  const reasons: string[] = [];
  const alignedThemes = RIASEC
    .filter((code) => career.riasec[code] >= 0.55)
    .sort((a, b) => profileScores[b] - profileScores[a])
    .slice(0, 2);
  if (alignedThemes.length) {
    reasons.push(`Your activity-interest pattern highlights ${alignedThemes.map((code) => RIASEC_NAMES[code]).join(" and ")} interests that also appear in this pathway profile.`);
  }
  const values = answers.values.filter((value) => career.values.includes(value));
  if (values.length) reasons.push(`This role profile shares your stated work values: ${values.join(", ")}.`);
  const skillLabels: Record<SkillKey, string> = {
    data: "data & numbers", communication: "communication", design: "creative work", research: "research", planning: "planning", helping: "supporting others", technical: "technology", influence: "persuasion & leadership",
  };
  const skills = (Object.keys(career.skills) as SkillKey[])
    .filter((key) => (answers.skills[key] ?? 0) >= 3 && (career.skills[key] ?? 0) >= 3)
    .sort((a, b) => answers.skills[b] - answers.skills[a])
    .slice(0, 2);
  if (skills.length) reasons.push(`You already report some confidence in ${skills.map((skill) => skillLabels[skill]).join(" and ")}; further practice may still be useful.`);
  if (!reasons.length) reasons.push("This is an exploratory option to compare with your lived experience and course work—not a conclusion about your potential.");
  return reasons;
}

function createMatch(
  answers: AssessmentAnswers,
  degreeField: DegreeField,
  career: CareerProfile,
  profileScores: Record<RiasecCode, number>,
): CareerMatch {
  const components: MatchComponents = {
    interests: pearsonSimilarity(RIASEC.map((code) => profileScores[code]), RIASEC.map((code) => career.riasec[code] * 100)),
    selfRatedSkills: selfRatedSkillOverlap(answers, career),
    values: valueOverlap(answers.values, career.values),
    workstyle: workstyleSimilarity(answers, career),
  };
  // Provisional product-design weights (50/15/20/15), not empirically estimated parameters.
  const matchScore = round(
    components.interests * 0.5 +
    components.selfRatedSkills * 0.15 +
    components.values * 0.2 +
    components.workstyle * 0.15,
  );
  return {
    careerId: career.id,
    title: career.title,
    category: career.category,
    summary: career.summary,
    dayToDay: career.dayToDay,
    matchScore,
    components: {
      interests: round(components.interests),
      selfRatedSkills: round(components.selfRatedSkills),
      values: round(components.values),
      workstyle: round(components.workstyle),
    },
    degreeConnection: career.degreeFields.includes(degreeField) ? "direct" : "adjacent",
    degreeFields: career.degreeFields,
    profileReasons: explainMatch(answers, career, profileScores),
    skillBridges: career.skillBridges,
    tryItProject: career.tryItProject,
    advisorPrompt: career.advisorPrompt,
  };
}

export function scoreAssessment(answers: AssessmentAnswers, degreeField: DegreeField): AssessmentResult {
  const profileScores = calculateProfileScores(answers);
  const topThemes = [...RIASEC].sort((a, b) => profileScores[b] - profileScores[a]).slice(0, 3);
  const topGap = profileScores[topThemes[0]] - profileScores[topThemes[1]];
  const signalClarity: AssessmentResult["signalClarity"] = topGap >= 14 ? "clearer" : topGap >= 6 ? "emerging" : "mixed";
  const matches = CAREER_PROFILES
    .map((career) => createMatch(answers, degreeField, career, profileScores))
    .sort((a, b) => b.matchScore - a.matchScore || a.title.localeCompare(b.title))
    .slice(0, 8);
  return {
    instrumentVersion: INSTRUMENT_VERSION,
    profileScores,
    topThemes,
    signalClarity,
    values: [...answers.values],
    workstylePreferences: { ...answers.workstyle },
    selfRatedSkills: { ...answers.skills },
    matches,
    methodNote: "Exploration alignment only: 50% interest-profile similarity, 15% self-rated skill overlap, 20% selected work values, and 15% workstyle similarity. These first-version weights and occupation profiles are design hypotheses, not validated predictions. This report does not measure clinical traits, objective aptitude, qualifications, job availability, or probability of success. Degree connection is a separate broad-field cue, not a reason to change or abandon a current program.",
  };
}
