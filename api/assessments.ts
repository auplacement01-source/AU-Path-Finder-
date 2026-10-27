import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CONSENT_VERSION, INSTRUMENT_VERSION } from "../src/lib/types.js";
import { scoreAssessment } from "../src/lib/scoring.js";
import { getAdminSupabase } from "../server/supabase.js";
import { submissionSchema } from "../server/validation.js";

function isSameSiteRequest(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  if (!origin || !host) return false;
  try {
    return Boolean(host && new URL(origin).host === host);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {

  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST to submit an assessment." });
  if (!isSameSiteRequest(req)) return res.status(403).json({ error: "This request could not be verified." });

  const parsed = submissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Some answers are missing or invalid. Review each step and try again." });
  }
  if (parsed.data.website?.trim()) {
    return res.status(202).json({ ok: true });
  }

  try {
    const submission = parsed.data;
    const result = scoreAssessment(submission.answers, submission.profile.degreeField);
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        student_name: submission.profile.name,
        registration_number: submission.profile.registration,
        program: submission.profile.program,
        semester: submission.profile.semester,
        degree_field: submission.profile.degreeField,
        instrument_version: INSTRUMENT_VERSION,
        consent_version: CONSENT_VERSION,
        consented_at: new Date().toISOString(),
        answers: submission.answers,
        result,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Assessment persistence failed", error?.code ?? "unknown database error");
      return res.status(503).json({ error: "We could not save your assessment just now. Please try again or contact your advisor." });
    }
    return res.status(201).json({ id: data.id, result });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown server error";
    const missingSetup = detail.includes("not configured");
    console.error("Assessment service unavailable", missingSetup ? "Supabase setup required" : "unexpected server error");
    return res.status(missingSetup ? 503 : 500).json({
      error: missingSetup
        ? "Assessment saving is not configured yet. Please contact your university advisor."
        : "We could not save your assessment just now. Please try again or contact your advisor.",
    });
  }
}
