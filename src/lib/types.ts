export const RIASEC = ["R", "I", "A", "S", "E", "C"] as const;
export type RiasecCode = (typeof RIASEC)[number];
export const RIASEC_NAMES: Record<RiasecCode, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export const DEGREE_FIELDS = [
  { id: "computing", label: "Computing & IT" },
  { id: "business", label: "Business, Management & Finance" },
  { id: "engineering", label: "Engineering & Built Environment" },
  { id: "data", label: "Data, Mathematics & Statistics" },
  { id: "social", label: "Social Science & Psychology" },
  { id: "education", label: "Education & Learning" },
  { id: "health", label: "Health & Life Sciences" },
  { id: "environment", label: "Natural Sciences & Environment" },
  { id: "arts", label: "Arts, Media & Design" },
  { id: "humanities", label: "Humanities & Communication" },
  { id: "public", label: "Law, Politics & Public Service" },
  { id: "other", label: "Other / still exploring" },
] as const;
export type DegreeField = (typeof DEGREE_FIELDS)[number]["id"];

export const VALUES = [
  { id: "achievement", label: "Achievement", description: "Making progress on meaningful, challenging goals." },
  { id: "independence", label: "Independence", description: "Having room to make decisions and shape your work." },
  { id: "relationships", label: "Relationships", description: "Working with supportive people and building trust." },
  { id: "service", label: "Service", description: "Contributing to other people or a wider community." },
  { id: "recognition", label: "Recognition", description: "Having your contribution noticed and appreciated." },
  { id: "growth", label: "Growth", description: "Learning, trying new challenges, and developing expertise." },
  { id: "security", label: "Stability", description: "Having dependable expectations and a sustainable pace." },
  { id: "variety", label: "Variety", description: "Having a mix of tasks and room to experiment." },
] as const;
export type ValueKey = (typeof VALUES)[number]["id"];

export const WORKSTYLES = [
  { id: "collaboration", label: "Teamwork", prompt: "I enjoy developing an idea by talking it through with other people.", low: "Mostly solo", high: "Highly collaborative" },
  { id: "structure", label: "Structure", prompt: "I feel comfortable working with clear steps, standards, or procedures.", low: "Flexible approach", high: "Clear structure" },
  { id: "autonomy", label: "Autonomy", prompt: "I like having room to decide how I will complete a task.", low: "Guided tasks", high: "More independence" },
  { id: "pace", label: "Changing pace", prompt: "I enjoy when priorities shift and new questions appear during the week.", low: "Steady rhythm", high: "Frequent change" },
  { id: "peopleContact", label: "People contact", prompt: "A people-facing day gives me energy rather than draining it.", low: "More focused time", high: "Frequent interaction" },
  { id: "handsOn", label: "Hands-on work", prompt: "I like using tools, systems, or materials to make something tangible happen.", low: "Mostly conceptual", high: "Practical / hands-on" },
] as const;
export type WorkstyleKey = (typeof WORKSTYLES)[number]["id"];

export const SKILLS = [
  { id: "data", label: "Data & numbers", examples: "organizing information, spreadsheets, basic analysis" },
  { id: "communication", label: "Writing & communication", examples: "explaining ideas, writing clearly, presenting" },
  { id: "design", label: "Creative & visual work", examples: "visual layouts, storytelling, making concepts" },
  { id: "research", label: "Research & evidence", examples: "asking questions, comparing sources, finding patterns" },
  { id: "planning", label: "Planning & coordination", examples: "organizing tasks, timelines, details" },
  { id: "helping", label: "Supporting & teaching", examples: "listening, explaining, helping someone progress" },
  { id: "technical", label: "Technology & operations", examples: "software, equipment, troubleshooting, processes" },
  { id: "influence", label: "Persuasion & leadership", examples: "negotiating, motivating, proposing a direction" },
] as const;
export type SkillKey = (typeof SKILLS)[number]["id"];

export type AssessmentAnswers = {
  interests: Record<string, number>;
  values: ValueKey[];
  workstyle: Record<WorkstyleKey, number>;
  skills: Record<SkillKey, number>;
};

export type StudentProfile = {
  name: string;
  registration: string;
  program: string;
  semester: string;
  degreeField: DegreeField;
};

export type AssessmentSubmission = {
  profile: StudentProfile;
  answers: AssessmentAnswers;
  consent: boolean;
  instrumentVersion: string;
};

export type MatchComponents = {
  interests: number;
  selfRatedSkills: number;
  values: number;
  workstyle: number;
};

export type CareerMatch = {
  careerId: string;
  title: string;
  category: string;
  summary: string;
  dayToDay: string[];
  matchScore: number;
  components: MatchComponents;
  degreeConnection: "direct" | "adjacent";
  degreeFields: DegreeField[];
  profileReasons: string[];
  skillBridges: string[];
  tryItProject: string;
  advisorPrompt: string;
};

export type AssessmentResult = {
  instrumentVersion: string;
  profileScores: Record<RiasecCode, number>;
  topThemes: RiasecCode[];
  signalClarity: "mixed" | "emerging" | "clearer";
  values: ValueKey[];
  workstylePreferences: Record<WorkstyleKey, number>;
  selfRatedSkills: Record<SkillKey, number>;
  matches: CareerMatch[];
  methodNote: string;
};

export type CounselorRecord = {
  id: string;
  created_at: string;
  student_name: string;
  registration_number: string;
  program: string;
  semester: string;
  degree_field: DegreeField;
  instrument_version: string;
  consent_version: string;
  result: AssessmentResult;
};

export const INSTRUMENT_VERSION = "pathfinder-exploration-v1.0";
export const CONSENT_VERSION = "privacy-consent-v1.0";
