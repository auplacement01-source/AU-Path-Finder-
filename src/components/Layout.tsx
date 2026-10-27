import { ArrowUpRight, Compass } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand-lockup" to="/" aria-label="Pathfinder Career Compass home">
            <img className="brand-lockup__logo" src="/Logo-DSA.png" alt="DSA logo" />
            <span className="brand-lockup__copy">
              <strong>Pathfinder</strong>
              <span>Career Compass</span>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/" end>Explore</NavLink>
            <a href="/#method">Our approach</a>
            <NavLink className="site-nav__advisor" to="/counselor"><span>Advisor access</span><ArrowUpRight size={15} aria-hidden="true" /></NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-brand">
            <img src="/Logo-DSA.png" alt="" aria-hidden="true" />
            <div><strong>Pathfinder</strong><span>Career Compass</span></div>
          </div>
          <p>A starting point for thoughtful career exploration—not a verdict about your future.</p>
          <div className="footer-links"><a href="/#method">How it works</a><Link to="/counselor">Advisor access</Link></div>
          <small>Student information is shown only to authorized university career staff.</small>
        </div>
      </footer>
    </div>
  );
}

export function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><Compass size={18} strokeWidth={1.8} /></span>;
}
