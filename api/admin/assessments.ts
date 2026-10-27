import type { VercelRequest, VercelResponse } from "@vercel/node";
import { counselorForToken, getAdminSupabase } from "../../server/supabase.js";

function safeFilterTerm(value: string | null, maximumLength: number): string {
  if (!value) return "";
  return value.normalize("NFKC").replace(/[^\p{L}\p{N}\s@._-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, maximumLength);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET to read counselor records." });

  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Sign in with an authorized counselor account." });

  try {
    const counselor = await counselorForToken(token);
    if (!counselor) return res.status(403).json({ error: "This account is not on the counselor access list." });
    const url = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`);
    const offsetValue = Number(url.searchParams.get("offset") ?? 0);
    const requestedLimit = Number(url.searchParams.get("limit") ?? 50);
    const offset = Number.isSafeInteger(offsetValue) ? Math.max(0, Math.min(offsetValue, 100000)) : 0;
    const limit = Number.isSafeInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 100)) : 50;
    const search = safeFilterTerm(url.searchParams.get("q"), 120);
    const program = safeFilterTerm(url.searchParams.get("program"), 160);
    const semester = safeFilterTerm(url.searchParams.get("semester"), 40);

    const supabase = getAdminSupabase();
    let recordsQuery = supabase
      .from("assessments")
      .select("id,created_at,student_name,registration_number,program,semester,degree_field,instrument_version,consent_version,result", { count: "exact" });
    if (search) {
      const pattern = `%${search}%`;
      recordsQuery = recordsQuery.or(`student_name.ilike.${pattern},registration_number.ilike.${pattern},program.ilike.${pattern}`);
    }
    if (program) recordsQuery = recordsQuery.ilike("program", `%${program}%`);
    if (semester) recordsQuery = recordsQuery.ilike("semester", `%${semester}%`);
    const { data, count, error } = await recordsQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      console.error("Counselor record query failed", error.code);
      return res.status(503).json({ error: "Student records are temporarily unavailable." });
    }
    return res.status(200).json({ records: data ?? [], total: count ?? 0, offset, limit });
  } catch (error) {
    const missingSetup = error instanceof Error && error.message.includes("not configured");
    console.error("Counselor service unavailable", missingSetup ? "Supabase setup required" : "unexpected server error");
    return res.status(missingSetup ? 503 : 500).json({ error: missingSetup ? "Counselor access is not configured yet." : "Student records are temporarily unavailable." });
  }
}
