import { useEffect, useRef, useState } from 'react';
import gavelBooks from '../../assets/gavel-books.svg';
import { PLAYGROUND_URL } from '../config';

export default function Nav() {
  const [hidden, setHidden] = useState(false);
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

  return (
    <header className={`nav${hidden ? ' nav-hidden' : ''}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top">
          <span className="mark logo"><img src={gavelBooks} alt="ClauseKit" /></span>
          <span className="wordmark">Clause<b>Kit</b></span>
        </a>
        <nav className="nav-links">
          <a href="#product">Product <span className="car" /></a>
          {/* <a href="#customers">Customers</a> */}
          {/* <a href="#security">Security</a> */}
          {/* <a href="#pricing">Pricing</a> */}
          {/* <a href="#resources">Resources <span className="car" /></a> */}
        </nav>
        <div className="nav-cta">
          <a className="login" href="#run-in-word">Run in Word</a>
          <a className="btn primary" href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer">
            Try the demo
          </a>
        </div>
      </div>
    </header>
  );
}
