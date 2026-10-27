import { scoreAssessment } from "./scoring";
import type { AssessmentAnswers, StudentProfile } from "./types";

const sampleAnswers: AssessmentAnswers = {
  interests: Object.fromEntries([
    ["r1", 2], ["r2", 2], ["r3", 2], ["r4", 3], ["r5", 2],
    ["i1", 5], ["i2", 5], ["i3", 4], ["i4", 5], ["i5", 4],
    ["a1", 4], ["a2", 5], ["a3", 4], ["a4", 4], ["a5", 5],
    ["s1", 5], ["s2", 4], ["s3", 4], ["s4", 4], ["s5", 5],
    ["e1", 3], ["e2", 3], ["e3", 4], ["e4", 3], ["e5", 3],
    ["c1", 4], ["c2", 4], ["c3", 4], ["c4", 3], ["c5", 4],
  ]),
  values: ["service", "growth", "relationships"],
  workstyle: { collaboration: 4, structure: 3, autonomy: 4, pace: 3, peopleContact: 4, handsOn: 2 },
  skills: { data: 3, communication: 4, design: 3, research: 4, planning: 3, helping: 4, technical: 2, influence: 3 },
};

export const SAMPLE_PROFILE: StudentProfile = {
  name: "Sample student",
  registration: "Not collected",
  program: "Public Health",
  semester: "Example",
  degreeField: "health",
};

export const SAMPLE_RESULT = scoreAssessment(sampleAnswers, SAMPLE_PROFILE.degreeField);
