import { createClient } from "@supabase/supabase-js";

export function getAdminSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase server environment is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "X-Client-Info": "pathfinder-career-compass-server" } },
  });
}

export async function counselorForToken(token: string) {
  const url = process.env.SUPABASE_URL;
  const publicKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !publicKey) throw new Error("Supabase Auth is not configured on the server.");
  const authClient = createClient(url, publicKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user?.email) return null;
  const allowedEmails = (process.env.COUNSELOR_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!allowedEmails.includes(data.user.email.toLowerCase())) return null;
  return data.user;
}
