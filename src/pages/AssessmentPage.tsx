import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { INTEREST_ITEMS, INTEREST_SCALE, SKILLS, SKILL_SCALE, VALUES, WORKSTYLES } from "../data/assessment";
import { DEGREE_FIELDS, INSTRUMENT_VERSION, RIASEC, RIASEC_NAMES, type AssessmentAnswers, type DegreeField, type RiasecCode, type SkillKey, type StudentProfile, type ValueKey, type WorkstyleKey } from "../lib/types";

type Step = 0 | 1 | 2 | 3;

const initialAnswers = (): AssessmentAnswers => ({
  interests: {},
  values: [],
  workstyle: Object.fromEntries(WORKSTYLES.map((item) => [item.id, 0])) as Record<WorkstyleKey, number>,
  skills: Object.fromEntries(SKILLS.map((item) => [item.id, 0])) as Record<SkillKey, number>,
});

const steps = ["Your details", "Activities", "Work preferences", "Skills & review"];

function RatingButtons({ label, value, onChange, scale }: { label: string; value: number; onChange: (value: number) => void; scale: readonly { value: number; label: string }[] }) {
  return (
    <div className="rating-buttons" role="group" aria-label={label}>
      {scale.map((option) => (
        <button key={option.value} type="button" className={value === option.value ? "rating-button is-selected" : "rating-button"} aria-pressed={value === option.value} aria-label={`${label}: ${option.value}, ${option.label}`} onClick={() => onChange(option.value)}>
          <span>{option.value}</span><small>{option.label}</small>
        </button>
      ))}
    </div>
  );
}

function RatingLegend({ scale }: { scale: readonly { value: number; label: string }[] }) {
  return <div className="rating-legend" aria-label="Response scale">{scale.map((option) => <span key={option.value}><b>{option.value}</b> {option.label}</span>)}</div>;
}

export function AssessmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<StudentProfile>({ name: "", registration: "", program: "", semester: "", degreeField: "other" });
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState("");

  const interestCount = Object.keys(answers.interests).length;
  const interestGroups = useMemo(() => RIASEC.map((code) => ({ code, items: INTEREST_ITEMS.filter((item) => item.code === code) })), []);

  function setProfileField<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }
  function setInterest(id: string, value: number) {
    setAnswers((current) => ({ ...current, interests: { ...current.interests, [id]: value } }));
  }
  function setWorkstyle(key: WorkstyleKey, value: number) {
    setAnswers((current) => ({ ...current, workstyle: { ...current.workstyle, [key]: value } }));
  }
  function setSkill(key: SkillKey, value: number) {
    setAnswers((current) => ({ ...current, skills: { ...current.skills, [key]: value } }));
  }
  function toggleValue(key: ValueKey) {
    setAnswers((current) => {
      const selected = current.values.includes(key);
      if (selected) return { ...current, values: current.values.filter((item) => item !== key) };
      if (current.values.length >= 3) return current;
      return { ...current, values: [...current.values, key] };
    });
  }

  function validateCurrentStep(): string | null {
    if (step === 0) {
      if (profile.name.trim().length < 2) return "Please enter your name.";
      if (!profile.registration.trim()) return "Please enter your registration number.";
      if (profile.program.trim().length < 2) return "Please enter your program or degree.";
      if (!profile.semester.trim()) return "Please enter your current semester.";
      if (!consent) return "Please review and agree to the privacy and assessment notice to continue.";
    }
    if (step === 1 && interestCount !== INTEREST_ITEMS.length) return `Please rate every activity. ${INTEREST_ITEMS.length - interestCount} still need a response.`;
    if (step === 2) {
      if (answers.values.length !== 3) return "Choose exactly three work values to continue.";
      if (Object.values(answers.workstyle).some((value) => value < 1)) return "Please answer all six work preference statements.";
    }
    if (step === 3 && Object.values(answers.skills).some((value) => value < 1)) return "Please rate all eight skill areas before viewing your report.";
    return null;
  }

  function nextStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = validateCurrentStep();
    if (issue) { setError(issue); return; }
    setError("");
    if (step < 3) setStep((current) => (current + 1) as Step);
  }

  async function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issue = validateCurrentStep();
    if (issue) { setError(issue); return; }
    setError("");
    setSubmitting(true);
    setSubmittedNotice("");
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, answers, consent, instrumentVersion: INSTRUMENT_VERSION, website }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.result || !payload.id) {
        throw new Error(payload.error || "Your assessment could not be saved. Please try again.");
      }
      setSubmittedNotice("Saved successfully. Preparing your report…");
      navigate("/results", { state: { sample: false, id: payload.id, profile, result: payload.result } });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Your assessment could not be saved. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="assessment-page page-wrap">
      <div className="assessment-head">
        <div><span className="section-index">A REFLECTION, NOT A TEST YOU CAN FAIL</span><h1>Make space to <em>notice.</em></h1><p>Choose the answers that fit you now. There is no perfect profile, and your responses can change as you learn.</p></div>
        <div className="time-note"><Clock3 size={16} /><span>About 8 minutes</span><span className="time-note__divider" /><span>4 short steps</span></div>
      </div>

      <div className="assessment-progress" aria-label={`Step ${step + 1} of 4`}>
        {steps.map((label, index) => <div className={index === step ? "progress-step is-current" : index < step ? "progress-step is-complete" : "progress-step"} key={label}><span className="progress-step__number">{index < step ? <Check size={14} /> : `0${index + 1}`}</span><span>{label}</span></div>)}
      </div>

      <form className="assessment-card" onSubmit={step === 3 ? submitAssessment : nextStep} noValidate>
        {step === 0 && <>
          <div className="form-step-heading"><span className="step-kicker">STEP 01 / A LITTLE CONTEXT</span><h2>Where are you <em>right now?</em></h2><p>This helps your advisor connect the ideas to the program you are already building.</p></div>
          <div className="form-grid">
            <label className="field"><span>Name <b aria-hidden="true">*</b></span><input autoComplete="name" maxLength={120} value={profile.name} onChange={(event) => setProfileField("name", event.target.value)} placeholder="Your full name" required /></label>
            <label className="field"><span>Registration number <b aria-hidden="true">*</b></span><input autoComplete="off" maxLength={80} value={profile.registration} onChange={(event) => setProfileField("registration", event.target.value)} placeholder="Your university ID" required /></label>
            <label className="field"><span>Program / degree <b aria-hidden="true">*</b></span><input autoComplete="organization-title" maxLength={160} value={profile.program} onChange={(event) => setProfileField("program", event.target.value)} placeholder="e.g., BSc Computer Science" required /></label>
            <label className="field"><span>Current semester <b aria-hidden="true">*</b></span><input maxLength={40} value={profile.semester} onChange={(event) => setProfileField("semester", event.target.value)} placeholder="e.g., Semester 4" required /></label>
            <label className="field field--wide"><span>Which broad area is closest to your program?</span><select value={profile.degreeField} onChange={(event) => setProfileField("degreeField", event.target.value as DegreeField)}>{DEGREE_FIELDS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><small>This helps frame a degree-to-career bridge. It does not affect your interest score.</small></label>
          </div>
          <div className="privacy-notice"><ShieldCheck size={18} aria-hidden="true" /><div><strong>How your information is used</strong><p>Your profile, answers, and report will be saved so an authorized university career advisor can support you. This assessment is for educational exploration, not psychological diagnosis, hiring, or a decision about your degree. Ask your advisor about the university's data-retention policy.</p><label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I have read this notice and agree to share my assessment with authorized university career staff. <b>*</b></span></label></div></div>
          <label className="honeypot" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
        </>}

        {step === 1 && <>
          <div className="form-step-heading"><span className="step-kicker">STEP 02 / WORK ACTIVITIES</span><h2>Which activities <em>draw you in?</em></h2><p>Rate how appealing each activity sounds today. This is about interest—not how skilled you already are.</p><div className="completion-count">{interestCount} of {INTEREST_ITEMS.length} answered</div></div>
          <RatingLegend scale={INTEREST_SCALE} />
          <div className="interest-groups">{interestGroups.map(({ code, items }) => <section className="interest-group" key={code} aria-labelledby={`group-${code}`}><div className="interest-group__heading"><span className="theme-chip">{code}</span><div><h3 id={`group-${code}`}>{RIASEC_NAMES[code]}</h3><p>{groupDescriptor(code)}</p></div></div>{items.map((item) => <div className="interest-item" key={item.id}><p>{item.prompt}</p><RatingButtons label={item.prompt} value={answers.interests[item.id] ?? 0} onChange={(value) => setInterest(item.id, value)} scale={INTEREST_SCALE} /></div>)}</section>)}</div>
        </>}

        {step === 2 && <>
          <div className="form-step-heading"><span className="step-kicker">STEP 03 / WORK VALUES & STYLE</span><h2>What helps you <em>feel good at work?</em></h2><p>Choose three values that matter most. Then rate a few day-to-day preferences.</p></div>
          <div className="value-section"><div className="subsection-heading"><div><span className="micro-label">YOUR TOP THREE</span><h3>What matters to you?</h3></div><span className="selection-count">{answers.values.length} / 3 selected</span></div><div className="value-grid">{VALUES.map((item) => {const selected = answers.values.includes(item.id);return <button type="button" key={item.id} className={selected ? "value-option is-selected" : "value-option"} aria-pressed={selected} onClick={() => toggleValue(item.id)} disabled={!selected && answers.values.length >= 3}><span className="value-option__check">{selected ? <Check size={14} /> : ""}</span><strong>{item.label}</strong><small>{item.description}</small></button>;})}</div></div>
          <div className="workstyle-section"><div className="subsection-heading"><div><span className="micro-label">YOUR WORK RHYTHM</span><h3>How do you like to work?</h3></div><span className="soft-note">Neither end is better.</span></div><div className="workstyle-list">{WORKSTYLES.map((item) => <div className="workstyle-card" key={item.id}><div className="workstyle-card__copy"><strong>{item.label}</strong><p>{item.prompt}</p></div><div className="workstyle-card__rating"><div className="rating-endpoints"><span>{item.low}</span><span>{item.high}</span></div><RatingButtons label={item.prompt} value={answers.workstyle[item.id]} onChange={(value) => setWorkstyle(item.id, value)} scale={INTEREST_SCALE} /></div></div>)}</div></div>
        </>}

        {step === 3 && <>
          <div className="form-step-heading"><span className="step-kicker">STEP 04 / SKILLS & REVIEW</span><h2>What have you <em>practiced so far?</em></h2><p>Rate your current confidence—not your potential. Skills can be built, and a low starting rating is not a reason to rule out a path.</p></div>
          <RatingLegend scale={SKILL_SCALE} />
          <div className="skill-list">{SKILLS.map((skill) => <div className="skill-card" key={skill.id}><div className="skill-card__copy"><strong>{skill.label}</strong><span>{skill.examples}</span></div><RatingButtons label={`${skill.label} self-rating`} value={answers.skills[skill.id]} onChange={(value) => setSkill(skill.id, value)} scale={SKILL_SCALE} /></div>)}</div>
          <div className="review-box"><div className="review-box__icon"><LockKeyhole size={17} /></div><div><strong>A quick note before your report</strong><p>Your answers will be scored on the server and saved to Supabase. Results are personalized exploration suggestions, not a clinical assessment or a measured chance of success. You can change a response by going back.</p></div></div>
        </>}

        {error && <div className="form-error" role="alert">{error}</div>}
        {submittedNotice && <p className="sr-only" role="status">{submittedNotice}</p>}
        <div className="assessment-actions">
          {step > 0 ? <button className="button button--text" type="button" onClick={() => { setError(""); setStep((current) => (current - 1) as Step); }}><ArrowLeft size={16} /> Previous</button> : <span />}
          {step < 3 ? <button className="button button--dark" type="submit">Continue <ArrowRight size={16} /></button> : <button className="button button--dark" type="submit" disabled={submitting}>{submitting ? "Saving securely…" : "See my pathways"}<ArrowRight size={16} /></button>}
        </div>
      </form>
      <p className="assessment-footnote"><ShieldCheck size={15} /> Your assessment is only complete when saving is confirmed. No results are stored in this browser.</p>
    </div>
  );
}

function groupDescriptor(code: RiasecCode) {
  const descriptions: Record<RiasecCode, string> = {
    R: "Practical work, tools, systems, and making things happen.",
    I: "Questions, evidence, patterns, and figuring things out.",
    A: "Creating, communicating, and trying different ideas.",
    S: "Helping, learning, and working with people.",
    E: "Persuading, organizing, and moving ideas toward action.",
    C: "Structure, accuracy, and keeping information organized.",
  };
  return descriptions[code];
}
