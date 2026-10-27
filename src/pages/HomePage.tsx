import { ArrowDown, ArrowRight, BookOpenCheck, Compass, Eye, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SAMPLE_PROFILE, SAMPLE_RESULT } from "../lib/sample";

export function HomePage() {
  const navigate = useNavigate();
  const openSample = () => navigate("/results", { state: { sample: true, profile: SAMPLE_PROFILE, result: SAMPLE_RESULT } });

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow__dot" /> A clearer next step, built around you</div>
          <h1>Your degree is a<br /><em>starting point.</em><br />Not a box.</h1>
          <p className="hero-lede">Find career paths that connect what you enjoy, what matters at work, and what you are already studying. Then build the next skill—without starting over.</p>
          <div className="hero-actions">
            <button className="button button--dark button--large" onClick={() => navigate("/assessment")}>
              Map my next step <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button className="button button--text" onClick={openSample}>
              <Eye size={17} aria-hidden="true" /> See a sample report
            </button>
          </div>
          <div className="hero-reassurance"><ShieldCheck size={16} aria-hidden="true" /><span>About 8 minutes</span><span className="reassurance-divider" /><span>No “one right career” answer</span></div>
        </div>
        <div className="hero-visual" aria-label="Career exploration is a path, not a straight line">
          <div className="hero-orbit hero-orbit--outer" />
          <div className="hero-orbit hero-orbit--inner" />
          <div className="orbit-label orbit-label--one"><span>INTERESTS</span><i>I</i></div>
          <div className="orbit-label orbit-label--two"><span>VALUES</span><i>V</i></div>
          <div className="orbit-label orbit-label--three"><span>SKILLS</span><i>S</i></div>
          <div className="orbit-label orbit-label--four"><span>YOUR DEGREE</span><i>D</i></div>
          <div className="hero-core"><Compass size={30} strokeWidth={1.4} /><strong>Find<br />your way</strong><span>one next step at a time</span></div>
          <div className="visual-note"><span className="visual-note__line" /><span>Explore the connections<br />that already exist.</span></div>
          <div className="visual-index">A STUDENT CAREER MAP <span>01—04</span></div>
        </div>
        <a className="scroll-cue" href="#how-it-works"><span>Take a look around</span><ArrowDown size={14} aria-hidden="true" /></a>
      </section>

      <section className="intro-strip" id="how-it-works">
        <div><span className="section-index">01 / A SMALL RESET</span><h2>Not a job title.<br /><em>A useful direction.</em></h2></div>
        <div className="intro-strip__body"><p>Your interests are clues, not limits. Career fit is personal, learned, and shaped by your opportunities—not decided by a single score.</p><p>Pathfinder turns a few reflective questions into options you can test in courses, projects, conversations, and internships.</p></div>
      </section>

      <section className="steps-section">
        <div className="section-heading"><span className="section-index">02 / HOW IT WORKS</span><h2>From self-reflection<br />to a <em>next move.</em></h2><p>Each part gives you a different kind of signal. None of them tells the whole story alone.</p></div>
        <div className="step-rail">
          <article className="step-card"><div className="step-card__top"><span>01</span><Compass size={21} /></div><span className="step-card__tag">NOTICE</span><h3>What draws you in</h3><p>Rate everyday activities across six broad Holland interest themes. This captures preference—not what you are already trained to do.</p></article>
          <span className="step-connector" aria-hidden="true" />
          <article className="step-card"><div className="step-card__top"><span>02</span><HeartHandshake size={21} /></div><span className="step-card__tag">PRIORITIZE</span><h3>What matters at work</h3><p>Choose your work values and share the conditions that help you do your best work.</p></article>
          <span className="step-connector" aria-hidden="true" />
          <article className="step-card"><div className="step-card__top"><span>03</span><BookOpenCheck size={21} /></div><span className="step-card__tag">CONNECT</span><h3>Build from your degree</h3><p>See a short list of pathways, what connects, what to practice next, and a project idea you can try.</p></article>
        </div>
      </section>

      <section className="promise-section" id="method">
        <div className="promise-mark"><Sparkles size={20} aria-hidden="true" /><span>THE PATHFINDER PROMISE</span></div>
        <div className="promise-copy"><h2>Curious about another field?<br /><em>Keep the degree. Add a bridge.</em></h2><p>Your report will not tell you to give up your degree. It will surface adjacent options and a practical bridge: skill topics, a small project, experience to look for, and questions for an advisor.</p><button className="button button--light" onClick={() => navigate("/assessment")}>Start exploring <ArrowRight size={16} aria-hidden="true" /></button></div>
        <div className="promise-side"><span>GOOD GUIDANCE IS</span><p>Explainable.<br />Actionable.<br />Yours to question.</p><span className="promise-side__foot">THE PERSON MAKING THE CHOICE IS YOU.</span></div>
      </section>

      <section className="method-section">
        <div className="method-section__heading"><span className="section-index">03 / WHY THIS FEELS DIFFERENT</span><h2>No mystery score.<br /><em>Just clear reasons.</em></h2><p>We show which parts of your answers informed each suggestion, then leave room for you and your advisor to put that information in context.</p></div>
        <div className="method-list">
          <div><span className="method-number">A</span><div><h3>Interests aren't ability.</h3><p>Enjoying an activity is not the same as having the training for it—or a guarantee of job success.</p></div></div>
          <div><span className="method-number">B</span><div><h3>Your skill level can grow.</h3><p>Skill self-ratings are a starting snapshot, not a ceiling. Every pathway includes ways to keep practicing.</p></div></div>
          <div><span className="method-number">C</span><div><h3>People are part of the process.</h3><p>Results are a conversation starter. An advisor can help you connect the ideas to your university's actual courses and local opportunities.</p></div></div>
        </div>
      </section>

      <section className="start-band">
        <div><span className="section-index">04 / READY WHEN YOU ARE</span><h2>A next step doesn't<br />have to be a big leap.</h2></div>
        <button className="button button--dark button--large" onClick={() => navigate("/assessment")}>Start the assessment <ArrowRight size={17} aria-hidden="true" /></button>
      </section>
    </>
  );
}
