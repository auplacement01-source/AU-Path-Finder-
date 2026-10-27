import { SKILLS, WORKSTYLES, type AssessmentResult } from "../lib/types";

type Props = { result: AssessmentResult; compact?: boolean };

export function ResponseProfile({ result, compact = false }: Props) {
  return <section className={compact ? "response-profile response-profile--compact" : "response-profile"} aria-labelledby={compact ? undefined : "response-profile-title"}>
    {!compact && <div className="response-profile__header"><span className="micro-label">BEYOND INTERESTS</span><h2 id="response-profile-title">Your response snapshot</h2><p>These are self-reported work preferences and confidence—not objective aptitude or a performance test.</p></div>}
    <div className="response-profile__grid">
      <div className="response-profile__card"><h3>How you prefer to work</h3><p>Preference ratings · 1 to 5</p><div className="response-profile__rows">{WORKSTYLES.map((item) => <RatingRow key={item.id} label={item.label} low={item.low} high={item.high} score={result.workstylePreferences[item.id]} />)}</div></div>
      <div className="response-profile__card"><h3>Skills you rated</h3><p>Current self-reported confidence · 1 to 5</p><div className="response-profile__rows">{SKILLS.map((item) => <RatingRow key={item.id} label={item.label} low="Building confidence" high="More confident" note={item.examples} score={result.selfRatedSkills[item.id]} />)}</div></div>
    </div>
  </section>;
}

function RatingRow({ label, low, high, note, score }: { label: string; low: string; high: string; note?: string; score: number }) {
  return <div className="response-profile__row"><div className="response-profile__labels"><span>{label}</span><b>{score}/5</b></div>{note && <small className="response-profile__example">Examples: {note}</small>}<div className="response-profile__track" role="meter" aria-label={`${label}: self-rating`} aria-valuemin={1} aria-valuemax={5} aria-valuenow={score} aria-valuetext={`${score} out of 5`}><i style={{ width: `${score * 20}%` }} /></div><small>{low} <span aria-hidden="true">→</span> {high}</small></div>;
}
