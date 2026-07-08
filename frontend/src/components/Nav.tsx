import { useEffect, useRef, useState } from 'react';
import ckMark from '../../assets/ck-mark.svg';
import { NAV_DROP_MS } from '../intro';

interface NavProps {
  /** Where the brand click goes. '#top' on the landing, '/' on a sub-page. */
  homeHref?: string;
  /** Hide the "Try the demo" button (e.g. on the Run-in-Word page). */
  showDemoCta?: boolean;
}

export default function Nav({ homeHref = '#top', showDemoCta = true }: NavProps) {
  const [hidden, setHidden] = useState(false);
  // Intro: the nav starts off-screen and drops in on the shared timeline
  // (behind the lifting entrance cover on first load, near-instantly after).
  // Reduced-motion users skip the intro and see it in place immediately.
  const [intro, setIntro] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => setIntro(false), NAV_DROP_MS);
    return () => window.clearTimeout(t);
  }, [intro]);

  return (
    <header className={`nav${intro || hidden ? ' nav-hidden' : ''}`}>
      <div className="wrap nav-inner">
        <a className="brand" href={homeHref}>
          <span className="mark logo"><img src={ckMark} alt="ClauseKit" /></span>
          <span className="wordmark">Clause<b>Kit</b></span>
        </a>
        <nav className="nav-links">
          {/* <a href="#customers">Customers</a> */}
          {/* <a href="#security">Security</a> */}
          {/* <a href="#pricing">Pricing</a> */}
          {/* <a href="#resources">Resources <span className="car" /></a> */}
        </nav>
        <div className="nav-cta">
          {showDemoCta && (
            <a className="btn demo" href="#demo">
              Demo
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
