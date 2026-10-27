import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, CheckCircle2, Compass, Lightbulb, Printer, Sparkles, Target } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DEGREE_FIELDS, RIASEC, RIASEC_NAMES, VALUES, type AssessmentResult, type CareerMatch, type DegreeField, type RiasecCode, type StudentProfile } from "../lib/types";
import { ResponseProfile } from "../components/ResponseProfile";

type ResultState = { sample?: boolean; id?: string; profile: StudentProfile; result: AssessmentResult };
const componentLabels = [
  { key: "interests", label: "Activity interests", description: "How your rated activities align with this pathway profile." },
  { key: "selfRatedSkills", label: "Self-rated skills", description: "Your current confidence and the role's common skill areas." },
  { key: "values", label: "Work values", description: "How your selected priorities overlap with this role profile." },
  { key: "workstyle", label: "Workstyle", description: "How your work preferences compare with this role profile." },
] as const;

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const state = location.state as ResultState | null;
  if (!state?.result || !state.profile) return <div className="empty-route"><div className="empty-route__icon"><Compass size={25} /></div><h1>Your report is ready when you are.</h1><p>Complete the assessment to get your own result, or view an example report to see how the career map works.</p><Link className="button button--dark" to="/assessment">Start assessment <ArrowRight size={16} /></Link></div>;

  const { profile, result, sample } = state;
  const lead = result.matches[0];
  const degreeLabel = DEGREE_FIELDS.find((field) => field.id === profile.degreeField)?.label ?? "your study area";

  return (
    <div className="results-page page-wrap">
      {sample && <div className="sample-banner"><Sparkles size={16} /><span><strong>Sample report</strong> — example only. No fictional student data was saved.</span><button className="sample-banner__link" onClick={() => navigate("/assessment")}>Take yours <ArrowRight size={14} /></button></div>}
      <div className="results-intro"><div><span className="section-index">YOUR CAREER EXPLORATION MAP</span><h1>A few patterns.<br /><em>Several possibilities.</em></h1><p>{sample ? "Here's a fictional sample to show how a report could connect interests to a next step." : `Your reflection is ready, ${profile.name.split(" ")[0]}. Take these ideas as a starting place and keep the options that feel true to you.`}</p></div><div className="results-badge"><Compass size={19} /><span>PATHFINDER<br /><b>REPORT</b></span></div></div>

      <div className="profile-summary">
        <section className="profile-summary__themes"><div className="subsection-heading"><div><span className="micro-label">YOUR INTEREST PROFILE</span><h2>What stood out</h2></div><span className={`signal-pill signal-pill--${result.signalClarity}`}>{clarityLabel(result.signalClarity)} signal</span></div><p className="profile-summary__hint">An activity-interest pattern—not an aptitude score or a description of everything you are.</p><div className="theme-bars">{RIASEC.map((code) => <ThemeBar key={code} code={code} score={result.profileScores[code]} isTop={result.topThemes.includes(code)} />)}</div><div className="top-themes"><span>Top themes</span>{result.topThemes.map((code) => <span className="theme-pill" key={code}>{code} · {RIASEC_NAMES[code]}</span>)}</div></section>
        <section className="profile-summary__context"><span className="micro-label">WHAT YOU WANT AT WORK</span><h2>Your stated values</h2><div className="value-tags">{result.values.map((value) => <span key={value}>{VALUES.find((item) => item.id === value)?.label ?? formatTitle(value)}</span>)}</div><div className="degree-note"><div className="degree-note__icon"><BookOpen size={17} /></div><p><strong>Keep your current degree in the picture.</strong><br />Your program, {profile.program}, is part of your path. {degreeLabel} only helps us suggest possible bridges; it does not decide your score.</p></div><div className="next-conversation"><span>Bring this question to an advisor</span><p>“Which course or project could help me test one of these ideas?”</p></div></section>
      </div>
      <ResponseProfile result={result} />

      {lead && <section className="lead-match"><div className="lead-match__top"><span className="lead-match__eyebrow"><Sparkles size={14} /> YOUR STANDOUT EXPLORATION PATH</span><span className="lead-match__rank">01 / {String(result.matches.length).padStart(2, "0")}</span></div><div className="lead-match__body"><div><span className="career-category">{lead.category}</span><h2>{lead.title}</h2><p>{lead.summary}</p><div className="lead-match__signals">{lead.profileReasons.slice(0, 2).map((reason, index) => <span key={index}><CheckCircle2 size={15} />{reason}</span>)}</div></div><div className="lead-score"><span>EXPLORATION<br />ALIGNMENT</span><strong>{lead.matchScore}<small>/100</small></strong><span className="lead-score__note">Not a probability<br />or aptitude score</span></div></div><div className="lead-match__bottom"><span><BookOpen size={15} /> {lead.degreeConnection === "direct" ? "Related study area" : "Adjacent route with a skill bridge"}</span><button className="text-action" onClick={() => document.getElementById(`career-${lead.careerId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}>Explore your bridge <ArrowDown size={15} /></button></div></section>}

      <section className="pathways-section"><div className="pathways-heading"><div><span className="section-index">YOUR PATHWAYS / {result.matches.length} OPTIONS</span><h2>Different routes.<br /><em>Shared strengths.</em></h2></div><p>Each match shows the signals behind the suggestion. Compare them with what you know about yourself, then choose what to explore.</p></div><div className="pathway-list">{result.matches.map((match, index) => <PathwayCard key={match.careerId} match={match} index={index} isOpen={expanded === match.careerId} onToggle={() => setExpanded(expanded === match.careerId ? null : match.careerId)} />)}</div></section>

      <section className="results-method-note"><div className="results-method-note__icon"><Target size={19} /></div><div><span className="micro-label">HOW TO READ THIS REPORT</span><p>{result.methodNote}</p><p>Job descriptions and next-step ideas are examples for further exploration. Training, licenses, hiring needs, and job outlook vary by location. A counselor can map ideas to your university's real courses and local opportunities.</p><a href="https://www.onetonline.org/" target="_blank" rel="noreferrer">Explore U.S. occupational information through O*NET <ArrowUpRight size={13} /></a></div></section>

      <div className="results-footer-actions"><Link className="button button--light" to="/">Back to Pathfinder</Link><button className="button button--text" onClick={() => window.print()}><Printer size={16} /> Print report</button></div>
      <p className="results-privacy"><CheckCircle2 size={14} /> {sample ? "Sample only — not stored." : "Your submitted report is saved for authorized university career staff."} Keep a copy only on a device you trust.</p>
    </div>
  );
}

function ThemeBar({ code, score, isTop }: { code: RiasecCode; score: number; isTop: boolean }) {
  return <div className="theme-bar"><div className="theme-bar__label"><span className={isTop ? "theme-bar__code is-top" : "theme-bar__code"}>{code}</span><span>{RIASEC_NAMES[code]}</span></div><div className="theme-bar__track"><span style={{ width: `${score}%` }} className={isTop ? "theme-bar__fill is-top" : "theme-bar__fill"} /></div><span className="theme-bar__score">{score}</span></div>;
}

function PathwayCard({ match, index, isOpen, onToggle }: { match: CareerMatch; index: number; isOpen: boolean; onToggle: () => void }) {
  return <article className={index === 0 ? "pathway-card is-featured" : "pathway-card"} id={`career-${match.careerId}`}>
    <button className="pathway-card__summary" aria-expanded={isOpen} onClick={onToggle}>
      <span className="pathway-card__rank">{String(index + 1).padStart(2, "0")}</span>
      <span className="pathway-card__main"><span className="career-category">{match.category}</span><strong>{match.title}</strong><small>{match.summary}</small></span>
      <span className="pathway-card__match"><b>{match.matchScore}</b><small>alignment</small></span>
      <span className="pathway-card__degree">{match.degreeConnection === "direct" ? "Related study area" : "Adjacent route"}</span>
      <span className="pathway-card__toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
    </button>
    {isOpen && <div className="pathway-card__detail">
      <div className="pathway-detail-grid"><section><span className="micro-label">WHY IT APPEARS</span><ul className="reason-list">{match.profileReasons.map((reason, index) => <li key={index}><CheckCircle2 size={15} />{reason}</li>)}</ul><div className="component-breakdown">{componentLabels.map((component) => <div className="component-row" key={component.key}><div><span>{component.label}</span><small>{component.description}</small></div><b>{match.components[component.key]}</b><span className="component-track"><i style={{ width: `${match.components[component.key]}%` }} /></span></div>)}</div></section>
        <section className="day-to-day"><span className="micro-label">A DAY MIGHT INCLUDE</span><ul>{match.dayToDay.map((task) => <li key={task}>{task}</li>)}</ul><div className="degree-bridge"><div className="degree-bridge__heading"><Lightbulb size={17} /><strong>{match.degreeConnection === "direct" ? "Extend what you are studying" : "Build a bridge from your degree"}</strong></div><p>{match.degreeConnection === "direct" ? "Your broad study area overlaps with this path. Add focused practice to connect what you learn to the role." : "This is an adjacent route. You can keep your current degree and add a small set of complementary skills—no need to start your degree again."}</p><span className="micro-label">SHORT-COURSE / ELECTIVE TOPICS TO EXPLORE</span><ul className="bridge-list">{match.skillBridges.map((skill) => <li key={skill}>{skill}</li>)}</ul><div className="try-it-box"><span><BriefcaseBusiness size={14} /> A project to try</span><p>{match.tryItProject}</p></div><div className="try-it-box"><span><BriefcaseBusiness size={14} /> SUPERVISED EXPERIENCE TO EXPLORE</span><p>Ask about local internships, faculty projects, supervised research, practical placements, student organizations, or volunteer experience related to this work.</p></div><div className="advisor-box"><span>COURSES & CREDENTIALS</span><p>Ask an advisor which electives, short courses, or credentials are relevant and recognized in your location. Requirements vary; this exploratory report is not a reason to buy a certification.</p></div><div className="advisor-box"><span>ASK AN ADVISOR</span><p>“{match.advisorPrompt}”</p></div></div></section></div>
      <a className="occupation-link" href={`https://www.onetonline.org/find/quick?s=${encodeURIComponent(match.title)}`} target="_blank" rel="noreferrer">Explore this title in U.S. O*NET occupational information <ArrowUpRight size={14} /></a>
    </div>}
  </article>;
}

function clarityLabel(value: AssessmentResult["signalClarity"]) {
  if (value === "clearer") return "More differentiated";
  if (value === "emerging") return "Some separation";
  return "Broad / mixed";
}
function formatTitle(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
