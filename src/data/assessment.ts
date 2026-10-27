import type { RiasecCode, SkillKey, ValueKey, WorkstyleKey } from "../lib/types";

export type InterestItem = { id: string; code: RiasecCode; prompt: string };

// Original activity prompts inspired by the broad RIASEC framework, not copied from a published instrument.
export const INTEREST_ITEMS: InterestItem[] = [
  { id: "r1", code: "R", prompt: "Build, repair, or set up something using tools or equipment." },
  { id: "r2", code: "R", prompt: "Work outdoors or in a practical, hands-on environment." },
  { id: "r3", code: "R", prompt: "Operate or troubleshoot a machine, device, or technical system." },
  { id: "r4", code: "R", prompt: "Turn a practical idea into a working model or prototype." },
  { id: "r5", code: "R", prompt: "Use materials or equipment to complete a physical task carefully." },
  { id: "i1", code: "I", prompt: "Investigate why a process, pattern, or result is happening." },
  { id: "i2", code: "I", prompt: "Compare evidence from different sources before reaching a conclusion." },
  { id: "i3", code: "I", prompt: "Explore a complex question that does not have an obvious answer." },
  { id: "i4", code: "I", prompt: "Analyze information to find a trend or explain a problem." },
  { id: "i5", code: "I", prompt: "Test an idea and learn from the results." },
  { id: "a1", code: "A", prompt: "Create an original visual, written, or digital concept." },
  { id: "a2", code: "A", prompt: "Find an engaging way to tell a story or explain an idea." },
  { id: "a3", code: "A", prompt: "Improve how something looks, sounds, or feels to its audience." },
  { id: "a4", code: "A", prompt: "Develop several different solutions rather than follow one fixed template." },
  { id: "a5", code: "A", prompt: "Communicate a message through design, language, or media." },
  { id: "s1", code: "S", prompt: "Help someone learn a skill or understand a difficult idea." },
  { id: "s2", code: "S", prompt: "Listen carefully and help someone work through a challenge." },
  { id: "s3", code: "S", prompt: "Contribute to a service or project that supports a community." },
  { id: "s4", code: "S", prompt: "Coordinate with a group to make sure people feel included." },
  { id: "s5", code: "S", prompt: "Guide someone toward a useful resource or next step." },
  { id: "e1", code: "E", prompt: "Present an idea and encourage others to support it." },
  { id: "e2", code: "E", prompt: "Take the lead on moving a team or project toward a goal." },
  { id: "e3", code: "E", prompt: "Build a professional relationship with a new person or group." },
  { id: "e4", code: "E", prompt: "Negotiate between different needs to reach an agreement." },
  { id: "e5", code: "E", prompt: "Notice an opportunity and organize people to act on it." },
  { id: "c1", code: "C", prompt: "Organize records or information so others can find it reliably." },
  { id: "c2", code: "C", prompt: "Check details to make sure a result or document is accurate." },
  { id: "c3", code: "C", prompt: "Maintain a clear schedule, checklist, or set of work steps." },
  { id: "c4", code: "C", prompt: "Use a consistent method to keep a service or project on track." },
  { id: "c5", code: "C", prompt: "Make a complicated set of information orderly and usable." },
];

export const INTEREST_SCALE = [
  { value: 1, label: "Not for me" },
  { value: 2, label: "Not much" },
  { value: 3, label: "Unsure" },
  { value: 4, label: "Sounds good" },
  { value: 5, label: "Very much" },
] as const;

export const VALUES: { id: ValueKey; label: string; description: string }[] = [
  { id: "achievement", label: "Achievement", description: "Making progress on meaningful, challenging goals." },
  { id: "independence", label: "Independence", description: "Having room to make decisions and shape your work." },
  { id: "relationships", label: "Relationships", description: "Working with supportive people and building trust." },
  { id: "service", label: "Service", description: "Contributing to other people or a wider community." },
  { id: "recognition", label: "Recognition", description: "Having your contribution noticed and appreciated." },
  { id: "growth", label: "Growth", description: "Learning, trying new challenges, and developing expertise." },
  { id: "security", label: "Stability", description: "Having dependable expectations and a sustainable pace." },
  { id: "variety", label: "Variety", description: "Having a mix of tasks and room to experiment." },
];

export const WORKSTYLES: { id: WorkstyleKey; label: string; prompt: string; low: string; high: string }[] = [
  { id: "collaboration", label: "Teamwork", prompt: "I enjoy developing an idea by talking it through with other people.", low: "Mostly solo", high: "Highly collaborative" },
  { id: "structure", label: "Structure", prompt: "I feel comfortable working with clear steps, standards, or procedures.", low: "Flexible approach", high: "Clear structure" },
  { id: "autonomy", label: "Autonomy", prompt: "I like having room to decide how I will complete a task.", low: "Guided tasks", high: "More independence" },
  { id: "pace", label: "Changing pace", prompt: "I enjoy when priorities shift and new questions appear during the week.", low: "Steady rhythm", high: "Frequent change" },
  { id: "peopleContact", label: "People contact", prompt: "A people-facing day gives me energy rather than draining it.", low: "More focused time", high: "Frequent interaction" },
  { id: "handsOn", label: "Hands-on work", prompt: "I like using tools, systems, or materials to make something tangible happen.", low: "Mostly conceptual", high: "Practical / hands-on" },
];

export const SKILLS: { id: SkillKey; label: string; examples: string }[] = [
  { id: "data", label: "Data & numbers", examples: "organizing information, spreadsheets, basic analysis" },
  { id: "communication", label: "Writing & communication", examples: "explaining ideas, writing clearly, presenting" },
  { id: "design", label: "Creative & visual work", examples: "visual layouts, storytelling, making concepts" },
  { id: "research", label: "Research & evidence", examples: "asking questions, comparing sources, finding patterns" },
  { id: "planning", label: "Planning & coordination", examples: "organizing tasks, timelines, details" },
  { id: "helping", label: "Supporting & teaching", examples: "listening, explaining, helping someone progress" },
  { id: "technical", label: "Technology & operations", examples: "software, equipment, troubleshooting, processes" },
  { id: "influence", label: "Persuasion & leadership", examples: "negotiating, motivating, proposing a direction" },
];

export const SKILL_SCALE = [
  { value: 1, label: "New to me" },
  { value: 2, label: "Tried it" },
  { value: 3, label: "Can do with support" },
  { value: 4, label: "Can do independently" },
  { value: 5, label: "Can teach it" },
] as const;
