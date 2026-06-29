import { useLayoutEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ProductShot from './components/ProductShot';
import TrustedBy from './components/TrustedBy';
import Pillars from './components/Pillars';
import SpotlightApply from './components/SpotlightApply';
import SpotlightGrounded from './components/SpotlightGrounded';
import RiskFlags from './components/RiskFlags';
import Security from './components/Security';
import Stats from './components/Stats';
import Testimonial from './components/Testimonial';
import RunInWord from './components/RunInWord';
import FinalCta from './components/FinalCta';
import FooterWordmark from './components/FooterWordmark';
import Footer from './components/Footer';

/**
 * Premium scroll-animation layer. Pure IntersectionObserver + a single
 * passive scroll listener (no libraries). Every visual effect is driven by
 * `.ck-*` classes that only do anything inside the
 * `@media (prefers-reduced-motion: no-preference)` block in landing.css, so:
 *   - reduced-motion users get a no-op (we also bail out of all JS below),
 *   - if the JS never runs, nothing is left at opacity:0.
 * A timed snap-in safety net guarantees nothing on-screen can get stuck hidden.
 */
function useScrollAnimations() {
  useLayoutEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    // Intro timeline (ms from load): the nav drops in (~1200ms, see Nav.tsx),
    // then the hero fades up. Everything else reveals on scroll.
    const HERO_REVEAL_DELAY = 1900;

    const observers: IntersectionObserver[] = [];
    const cleanups: Array<() => void> = [];
    const armed: HTMLElement[] = [];

    const q = (sel: string, root: ParentNode = document) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel));

    // Set an element's hidden start state. Done from JS only, so non-JS and
    // reduced-motion users never see opacity:0.
    const arm = (el: HTMLElement | null, classes: string[], delay = 0) => {
      if (!el) return;
      el.classList.add('ck-armed', ...classes);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      armed.push(el);
    };

    const enter = (el: HTMLElement | null) => el && el.classList.add('ck-in');

    // Run `fn` once, the first time `trigger` scrolls into view.
    const onEnter = (
      trigger: Element | null | undefined,
      fn: () => void,
      init: IntersectionObserverInit = { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    ) => {
      if (!trigger) return;
      const io = new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (en.isIntersecting) { fn(); io.disconnect(); break; }
        }
      }, init);
      io.observe(trigger);
      observers.push(io);
    };

    // Section heading (.eyebrow-row): kicker -> h2 -> sub fade up, slowly, and
    // only once the heading reaches the centre band of the viewport (so it
    // never reveals while still off-screen — important for tall sections).
    const animateHeading = (section: Element | null) => {
      if (!section) return;
      const row = section.querySelector('.eyebrow-row') ?? section;
      const head = q('.eyebrow-row > *', section);
      head.forEach((el, i) => arm(el, ['ck-up', 'ck-slow'], i * 120));
      onEnter(row, () => head.forEach(enter), { threshold: 0, rootMargin: '-40% 0px -40% 0px' });
    };

    // ---- Hero: stagger the reveal children, h1 also scales 0.97 -> 1 ----
    // (translateY + scale only — never translateX — so the nowrap h1 can't
    //  trigger a horizontal scrollbar.)
    const heroSection = q('.hero').find((s) => !s.querySelector('.shot'));
    if (heroSection) {
      // Include .pill-img so the whole hero (logo included) stays hidden during
      // the intro — the initial screen should be just the black background.
      const items = q('.reveal, .pill-img', heroSection);
      // No stagger: the whole hero fades in together (slowly), via .ck-hero.
      items.forEach((el) =>
        arm(el, [el.tagName === 'H1' ? 'ck-heroh1' : 'ck-up', 'ck-hero']),
      );
      // Hero waits for the intro (nav drops first), then fades up. It's above
      // the fold, so we reveal it on a timer rather than on scroll.
      const heroTimer = window.setTimeout(() => items.forEach(enter), HERO_REVEAL_DELAY);
      cleanups.push(() => window.clearTimeout(heroTimer));
    }

    // ---- Pillars heading (only the eyebrow-row renders) ----
    animateHeading(document.querySelector('#features'));

    // ---- Spotlights: copy slides from the left, the visual from the right;
    //      flipped when the split is reversed (.split.rev) ----
    const setupSplit = (split: HTMLElement | null) => {
      if (!split) return;
      const rev = split.classList.contains('rev');
      const copy = split.querySelector<HTMLElement>('.copy');
      const viz = split.querySelector<HTMLElement>('.viz');
      arm(copy, ['ck-split-side', rev ? 'ck-right' : 'ck-left'], 0);
      arm(viz, ['ck-split-side', rev ? 'ck-left' : 'ck-right'], 150);
      onEnter(split, () => { enter(copy); enter(viz); });
    };
    setupSplit(document.querySelector<HTMLElement>('.split:not(.rev)'));
    setupSplit(document.querySelector<HTMLElement>('.split.rev'));

    // ---- RiskFlags heading ----
    animateHeading(document.querySelector('#risk'));

    // ---- RiskFlags: rows slide in from the left + the severity pill pops ----
    const riskwrap = document.querySelector('.riskwrap');
    if (riskwrap) {
      const rows = q('.risk', riskwrap);
      rows.forEach((row, i) => {
        const d = i * 90;
        arm(row, ['ck-risk-row'], d);
        const sev = row.querySelector<HTMLElement>('.sev');
        if (sev) sev.style.animationDelay = `${d}ms`;
      });
      onEnter(riskwrap, () => rows.forEach(enter));
    }

    // ---- ProductShot: head fades up, then the mock rises + scales in,
    //      plus a gentle upward scroll parallax on the inner host ----
    const shot = document.querySelector<HTMLElement>('.shot');
    const productSection = shot?.closest('section');
    if (shot && productSection) {
      const head = productSection.querySelector<HTMLElement>('.shot-head');
      arm(head, ['ck-up'], 0);
      arm(shot, ['ck-shot'], 220);
      onEnter(productSection, () => { enter(head); enter(shot); });

      const host = shot.querySelector<HTMLElement>('.host');
      if (host) {
        let ticking = false;
        const update = () => {
          ticking = false;
          const rect = shot.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          // -1 (below viewport) .. 0 (centered) .. 1 (above): drift up ~0.2x.
          const p = (vh / 2 - (rect.top + rect.height / 2)) / vh;
          const py = Math.max(-50, Math.min(50, -p * 50));
          host.style.transform = `translateY(${py.toFixed(2)}px)`;
        };
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(update);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));
        update();
      }
    }

    // ---- Security: cards fade + scale(0.94 -> 1) in a springy cascade ----
    const security = document.querySelector('#security');
    if (security) {
      animateHeading(security);

      const cards = q('.seccard', security);
      cards.forEach((c, i) => arm(c, ['ck-seccard'], i * 100));
      onEnter(security, () => cards.forEach(enter));
    }

    // ---- FinalCta: ambient glow pulse on the radial ::before, heading and
    //      buttons stagger in beneath it ----
    const cta = document.querySelector<HTMLElement>('.cta');
    const ctaSection = document.querySelector('#demo');
    if (cta && ctaSection) {
      const h2 = cta.querySelector<HTMLElement>('h2');
      const p = cta.querySelector<HTMLElement>('p');
      const btns = cta.querySelector<HTMLElement>('.cta-btns');
      arm(h2, ['ck-up'], 100);
      arm(p, ['ck-up'], 200);
      arm(btns, ['ck-up'], 300);
      onEnter(ctaSection, () => {
        cta.classList.add('ck-cta-glow');
        [h2, p, btns].forEach(enter);
      });
    }

    // ---- Ambient amber wash whenever a live .section enters the viewport ----
    q('.section').forEach((section) => {
      onEnter(
        section,
        () => {
          section.classList.add('ck-section-lit');
          const t = window.setTimeout(() => section.classList.remove('ck-section-lit'), 1300);
          cleanups.push(() => window.clearTimeout(t));
        },
        { threshold: 0.05, rootMargin: '0px 0px -5% 0px' },
      );
    });

    // ---- Safety net: anything armed but not yet revealed that's already in
    //      (or above) the viewport gets snapped visible so it can't get stuck.
    //      Below-the-fold elements stay armed and animate on scroll. ----
    const snap = (el: HTMLElement) => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    };
    const snapTimer = window.setTimeout(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      armed.forEach((el) => {
        if (el.classList.contains('ck-in')) return;
        if (el.getBoundingClientRect().top < vh * 0.98) snap(el);
      });
    }, HERO_REVEAL_DELAY + 1800);

    return () => {
      observers.forEach((o) => o.disconnect());
      cleanups.forEach((c) => c());
      window.clearTimeout(snapTimer);
    };
  }, []);
}

export default function App() {
  useScrollAnimations();
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        {/* <TrustedBy /> */}
        <Pillars />
        <SpotlightApply />
        <SpotlightGrounded />
        <RiskFlags />
        <ProductShot />
        <Security />
        {/* TODO: when re-enabled, wire these into useScrollAnimations()
            (e.g. Stats count-up cascade, Testimonial fade, RunInWord steps). */}
        {/* <Stats /> */}
        {/* <Testimonial /> */}
        <FinalCta />
        {/* RunInWord section retired: the "Run in Word" CTA in FinalCta now
            downloads the sample lease (.docx) directly instead of scrolling here. */}
        {/* <RunInWord /> */}
      </main>
      <FooterWordmark />
      <Footer />
    </>
  );
}
