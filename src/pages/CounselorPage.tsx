import { useEffect, useState, type FormEvent } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { ArrowDownToLine, ArrowLeft, ArrowRight, BarChart3, CheckCircle2, LockKeyhole, LogOut, RefreshCw, Search, ShieldCheck, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { DEGREE_FIELDS, RIASEC_NAMES, VALUES, type CounselorRecord, type RiasecCode } from "../lib/types";
import { ResponseProfile } from "../components/ResponseProfile";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const authClient = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
const PAGE_SIZE = 50;
const MAX_EXPORT_RECORDS = 25_000;

type RecordsResponse = { records: CounselorRecord[]; total: number };

export function CounselorPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [records, setRecords] = useState<CounselorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [selected, setSelected] = useState<CounselorRecord | null>(null);
  const hasFilters = Boolean(query.trim() || programFilter.trim() || semesterFilter.trim());

  useEffect(() => {
    if (!authClient) {
      setAuthReady(true);
      return;
    }
    let alive = true;
    void authClient.auth.getSession()
      .then(({ data }) => {
        if (alive) { setSession(data.session); setAuthReady(true); }
      })
      .catch(() => {
        if (alive) {
          setError("Could not contact Supabase Auth. Check the connection and try signing in again.");
          setAuthReady(true);
        }
      });
    const { data: listener } = authClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError("");
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!session) { setRecords([]); setTotal(0); return; }
    let alive = true;
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ offset: String(offset), limit: String(PAGE_SIZE) });
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (programFilter.trim()) params.set("program", programFilter.trim());
    if (semesterFilter.trim()) params.set("semester", semesterFilter.trim());

    fetch(`/api/admin/assessments?${params.toString()}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
      cache: "no-store",
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Student records are not available.");
        return body as RecordsResponse;
      })
      .then((body) => { if (alive) { setRecords(body.records); setTotal(body.total); } })
      .catch((loadError: unknown) => {
        if (alive) setError(loadError instanceof Error ? loadError.message : "Student records are not available.");
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [session, offset, debouncedQuery, programFilter, semesterFilter, refreshVersion]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authClient) return;
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } = await authClient.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      setSession(data.session);
    } catch {
      setError("Sign-in failed or Supabase could not be reached. Check your credentials and ask the administrator to confirm counselor access.");
    } finally {
      setPassword("");
      setLoading(false);
    }
  }

  async function signOut() {
    if (authClient) {
      try {
        const { error: signOutError } = await authClient.auth.signOut();
        if (signOutError) throw signOutError;
        setSession(null);
        setSelected(null);
        setError("");
      } catch {
        setError("Could not confirm sign-out. Check your connection, then try again before leaving this device.");
      }
    }
  }

  async function exportAllRecords() {
    if (!session) return;
    setExporting(true);
    setError("");
    try {
      // The initial count request deliberately omits active page filters: “Export all” means
      // all authorized submissions, not merely the current search or pagination page.
      const countResponse = await fetch(`/api/admin/assessments?offset=0&limit=1`, {
        headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store",
      });
      const countBody = await countResponse.json().catch(() => ({}));
      if (!countResponse.ok) throw new Error(countBody.error || "CSV export could not retrieve the record count.");
      const exportTotal = (countBody as RecordsResponse).total;
      if (exportTotal > MAX_EXPORT_RECORDS) {
        throw new Error(`This export contains more than ${MAX_EXPORT_RECORDS.toLocaleString()} records. Ask your administrator for a secure, segmented export.`);
      }
      const all: CounselorRecord[] = [];
      for (let start = 0; start < exportTotal; start += 100) {
        const response = await fetch(`/api/admin/assessments?offset=${start}&limit=100`, {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store",
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "CSV export could not retrieve every page.");
        all.push(...(body as RecordsResponse).records);
      }
      downloadCsv(all);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "CSV export could not be completed.");
    } finally {
      setExporting(false);
    }
  }

  if (!authReady) return <div className="admin-page page-wrap"><div className="loading-state"><RefreshCw className="spin" size={19} /> Loading secure sign-in…</div></div>;

  return <div className="admin-page page-wrap">
    <div className="admin-heading">
      <div><span className="section-index">AUTHORIZED UNIVERSITY STAFF</span><h1>Counselor <em>workspace.</em></h1><p>Review submissions and support the student behind each report.</p></div>
      {session && <button className="button button--text" onClick={signOut}><LogOut size={16} /> Sign out</button>}
    </div>
    {!authClient ? <div className="setup-message"><LockKeyhole size={23} /><div><h2>Secure sign-in is not configured</h2><p>Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the Vercel project, then redeploy. The counselor workspace is unavailable until Supabase Auth and the server-side counselor allowlist are configured.</p><Link to="/">Return to the student portal <ArrowRight size={14} /></Link></div></div> : !session ? <section className="login-card">
      <div className="login-icon"><LockKeyhole size={20} /></div>
      <span className="micro-label">COUNSELOR SIGN-IN</span><h2>Sign in to support<br /><em>the next step.</em></h2>
      <p>Only authorized accounts can open student submissions. Your account must be created in Supabase and added to the server-side counselor email allowlist.</p>
      <form onSubmit={signIn} className="login-form">
        <label className="field"><span>University email</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="field"><span>Password</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--dark button--large" disabled={loading}>{loading ? "Signing in…" : "Sign in securely"}<ArrowRight size={16} /></button>
      </form>
      <div className="login-security"><ShieldCheck size={14} /> Student records are not publicly queryable.</div>
    </section> : <>
      <div className="admin-welcome"><div><div className="counselor-avatar">{session.user.email?.slice(0, 1).toUpperCase()}</div><div><span className="micro-label">SIGNED IN AS</span><strong>{session.user.email}</strong></div></div><span className="admin-auth-badge"><CheckCircle2 size={14} /> Authorized counselor</span></div>
      {error && <div className="form-error admin-alert" role="alert">{error}</div>}
      <div className="admin-stats">
        <article><span className="admin-stat-icon"><Users size={18} /></span><span className="micro-label">MATCHING SUBMISSIONS</span><strong>{total}</strong><small>Across all matching pages</small></article>
        <article><span className="admin-stat-icon"><BarChart3 size={18} /></span><span className="micro-label">ON THIS PAGE</span><strong>{records.length}</strong><small>{loading ? "Refreshing records" : `${PAGE_SIZE} per page`}</small></article>
        <article><span className="admin-stat-icon"><ShieldCheck size={18} /></span><span className="micro-label">ACCESS STATUS</span><strong className="admin-stat-status">Private</strong><small>Server-verified access</small></article>
      </div>
      <section className="records-panel">
        <div className="records-panel__head">
          <div><span className="section-index">STUDENT SUBMISSIONS</span><h2>Ready for a <em>conversation.</em></h2><p>Search and filters apply across all authorized submissions, with 50 results per page.</p></div>
          <div className="records-actions"><button className="button button--light" onClick={() => setRefreshVersion((value) => value + 1)} disabled={loading}><RefreshCw size={15} /> Refresh</button><button className="button button--dark" onClick={exportAllRecords} disabled={exporting}>{exporting ? <RefreshCw className="spin" size={15} /> : <ArrowDownToLine size={15} />}{exporting ? "Preparing CSV…" : "Export all CSV"}</button></div>
        </div>
        <div className="records-filters">
          <label className="search-field"><Search size={16} /><input aria-label="Search all records" placeholder="Search all names, registrations, or programs" value={query} onChange={(event) => { setQuery(event.target.value); setOffset(0); }} /></label>
          <label className="filter-select"><span className="sr-only">Filter by program</span><input maxLength={160} placeholder="Any program" value={programFilter} onChange={(event) => { setProgramFilter(event.target.value); setOffset(0); }} /></label>
          <label className="filter-select"><span className="sr-only">Filter by semester</span><input maxLength={40} placeholder="Any semester" value={semesterFilter} onChange={(event) => { setSemesterFilter(event.target.value); setOffset(0); }} /></label>
        </div>
        {loading ? <div className="loading-state"><RefreshCw className="spin" size={18} /> Loading student records…</div> : records.length ? <div className="record-table-wrap"><table className="record-table"><thead><tr><th>STUDENT</th><th>PROGRAM</th><th>SEMESTER</th><th>TOP THEMES</th><th>LEAD PATHWAY</th><th>SUBMITTED</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td><strong>{record.student_name}</strong><small>{record.registration_number}</small></td><td>{record.program}</td><td>{record.semester}</td><td>{record.result.topThemes.map((code) => code).join(" · ")}</td><td><strong>{record.result.matches[0]?.title ?? "—"}</strong><small>{record.result.matches[0]?.matchScore ?? 0} alignment</small></td><td>{formatDate(record.created_at)}</td><td><button className="table-view-button" onClick={() => setSelected(record)}>Open report <ArrowRight size={14} /></button></td></tr>)}</tbody></table></div> : <div className="empty-records"><Users size={25} /><h3>{hasFilters ? "No matching student records." : "No submissions yet."}</h3><p>{hasFilters ? "Try changing the search or filters." : "When a student completes the portal, their report will appear here."}</p></div>}
        <div className="records-panel__foot"><span>Showing {records.length ? offset + 1 : 0}–{offset + records.length} of {total} matching submissions · {PAGE_SIZE} per page</span><div><button className="button button--light button--small" onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))} disabled={offset === 0 || loading}><ArrowLeft size={14} /> Newer</button><button className="button button--light button--small" onClick={() => setOffset(offset + PAGE_SIZE)} disabled={offset + records.length >= total || loading}>Older <ArrowRight size={14} /></button></div></div>
      </section>
      <p className="admin-privacy-note"><ShieldCheck size={14} /> Student details and result profiles are private educational records. Follow your institution's data-retention and access policies.</p>
      {selected && <RecordDialog record={selected} onClose={() => setSelected(null)} />}
    </>}
  </div>;
}

function RecordDialog({ record, onClose }: { record: CounselorRecord; onClose: () => void }) {
  const degreeLabel = DEGREE_FIELDS.find((field) => field.id === record.degree_field)?.label ?? record.degree_field;
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="record-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="record-dialog__head"><div><span className="section-index">STUDENT ASSESSMENT</span><h2 id="dialog-title">{record.student_name}</h2><p>{record.program} · {record.semester} · {degreeLabel}</p></div><button className="icon-button" onClick={onClose} aria-label="Close report"><X size={19} /></button></div><div className="record-dialog__identity"><span>Registration <strong>{record.registration_number}</strong></span><span>Submitted <strong>{formatDate(record.created_at)}</strong></span></div><div className="record-dialog__themes"><span className="micro-label">TOP INTEREST THEMES</span><div>{record.result.topThemes.map((code) => <span className="theme-pill" key={code}>{code} · {RIASEC_NAMES[code as RiasecCode]}</span>)}</div></div><div className="record-dialog__bars">{Object.entries(record.result.profileScores).map(([code, score]) => <div key={code}><span>{code} · {RIASEC_NAMES[code as RiasecCode]}</span><span className="dialog-bar"><i style={{ width: `${score}%` }} /></span><b>{score}</b></div>)}</div><div className="record-dialog__themes"><span className="micro-label">SELECTED WORK VALUES</span><div>{record.result.values.map((value) => <span className="theme-pill" key={value}>{VALUES.find((item) => item.id === value)?.label ?? value}</span>)}</div></div><ResponseProfile result={record.result} compact /><div className="record-dialog__matches"><span className="micro-label">OCCUPATION PATHWAYS</span>{record.result.matches.map((match, index) => <article key={match.careerId}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{match.title}</strong><small>{match.degreeConnection === "direct" ? "Related study area" : "Adjacent route"} · {match.matchScore} alignment</small></div></article>)}</div><div className="record-dialog__note"><strong>Method & interpretation</strong><p>{record.result.methodNote}</p></div><button className="button button--dark record-dialog__close" onClick={onClose}>Close report</button></section></div>;
}

function csvCell(value: string | number) {
  let text = String(value ?? "");
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
function downloadCsv(records: CounselorRecord[]) {
  const rows: (string | number)[][] = [["Name", "Registration number", "Program", "Semester", "Degree area", "Submitted at", "Top RIASEC themes", "Lead occupation", "Lead alignment", "Other occupations", "Instrument version"]];
  for (const record of records) rows.push([
    record.student_name, record.registration_number, record.program, record.semester,
    DEGREE_FIELDS.find((field) => field.id === record.degree_field)?.label ?? record.degree_field,
    new Date(record.created_at).toISOString(), record.result.topThemes.join("-"),
    record.result.matches[0]?.title ?? "", record.result.matches[0]?.matchScore ?? 0,
    record.result.matches.map((match) => `${match.title} (${match.matchScore})`).join("; "), record.instrument_version,
  ]);
  const blob = new Blob(["\uFEFF", rows.map((row) => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pathfinder-assessments-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function formatDate(value: string) { return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
