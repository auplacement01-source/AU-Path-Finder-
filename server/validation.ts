import { z } from "zod";
import { INTEREST_ITEMS } from "../src/data/assessment.js";
import type { SkillKey, WorkstyleKey } from "../src/lib/types";

const rating = z.number().int().min(1).max(5);
const interestShape = Object.fromEntries(INTEREST_ITEMS.map((item) => [item.id, rating]));
const valueKeys = ["achievement", "independence", "relationships", "service", "recognition", "growth", "security", "variety"] as const;
const skillShape = Object.fromEntries(["data", "communication", "design", "research", "planning", "helping", "technical", "influence"].map((key) => [key, rating])) as Record<SkillKey, typeof rating>;
const styleShape = Object.fromEntries(["collaboration", "structure", "autonomy", "pace", "peopleContact", "handsOn"].map((key) => [key, rating])) as Record<WorkstyleKey, typeof rating>;
const degreeFields = ["computing", "business", "engineering", "data", "social", "education", "health", "environment", "arts", "humanities", "public", "other"] as const;

export const submissionSchema = z.object({
  profile: z.object({
    name: z.string().trim().min(2).max(120),
    registration: z.string().trim().min(1).max(80),
    program: z.string().trim().min(2).max(160),
    semester: z.string().trim().min(1).max(40),
    degreeField: z.enum(degreeFields),
  }).strict(),
  answers: z.object({
    interests: z.object(interestShape).strict(),
    values: z.array(z.enum(valueKeys)).length(3).refine((items) => new Set(items).size === 3, "Choose three different work values."),
    workstyle: z.object(styleShape).strict(),
    skills: z.object(skillShape).strict(),
  }).strict(),
  consent: z.literal(true),
  instrumentVersion: z.literal("pathfinder-exploration-v1.0"),
  website: z.string().max(200).optional(),
}).strict();

export type ValidSubmission = z.infer<typeof submissionSchema>;
