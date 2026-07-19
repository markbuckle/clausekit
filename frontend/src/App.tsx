import { useEffect, useLayoutEffect } from 'react';
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
import WordTutorial from './components/WordTutorial';
import FinalCta from './components/FinalCta';
import FooterWordmark from './components/FooterWordmark';
import Footer from './components/Footer';
import EntranceReveal from './components/EntranceReveal';
import { HERO_REVEAL_MS } from './intro';


// scroll-animation layer
function useScrollAnimations() {
  useLayoutEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    // Intro timing comes from intro.ts; everything below the fold reveals on scroll.
    const HERO_REVEAL_DELAY = HERO_REVEAL_MS;

    const observers: IntersectionObserver[] = [];
    const cleanups: Array<() => void> = [];
    const armed: HTMLElement[] = [];

    const q = (sel: string, root: ParentNode = document) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel));

    // Hidden start state is set from JS only, so non-JS users never see opacity:0.
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

    // Section headings fade up once they reach the centre band of the viewport.
    const animateHeading = (section: Element | null) => {
      if (!section) return;
      const row = section.querySelector('.eyebrow-row') ?? section;
      const head = q('.eyebrow-row > *', section);
      head.forEach((el, i) => arm(el, ['ck-up', 'ck-slow'], i * 120));
      onEnter(row, () => head.forEach(enter), { threshold: 0, rootMargin: '-40% 0px -40% 0px' });
    };

    // Hero: translateY + scale only, since translateX on the nowrap h1 can cause a horizontal scrollbar.
    const heroSection = q('.hero').find((s) => !s.querySelector('.shot'));
    if (heroSection) {
      // .pill-img included so the logo stays hidden during the intro too.
      const items = q('.reveal, .pill-img', heroSection);
      // No stagger: the whole hero fades in together via .ck-hero.
      items.forEach((el) =>
        arm(el, [el.tagName === 'H1' ? 'ck-heroh1' : 'ck-up', 'ck-hero']),
      );
      // Above the fold, so reveal on a timer rather than on scroll.
      const heroTimer = window.setTimeout(() => items.forEach(enter), HERO_REVEAL_DELAY);
      cleanups.push(() => window.clearTimeout(heroTimer));
    }

    // Run-in-Word page: intro reveals on load, steps reveal on scroll; arrows fade in last so they read as the cue to move on.
    const armArrow = (el: HTMLElement | null) => el && el.classList.add('ck-arrow-armed');
    const revealArrow = (el: HTMLElement | null, delay: number) => {
      if (!el) return;
      const t = window.setTimeout(() => el.classList.remove('ck-arrow-armed'), delay);
      cleanups.push(() => window.clearTimeout(t));
    };

    const introInner = document.querySelector<HTMLElement>('.tut-head-inner');
    if (introInner) {
      const introArrow = document.querySelector<HTMLElement>('.tut-head .tut-scroll');
      arm(introInner, ['ck-up', 'ck-hero']);
      armArrow(introArrow);
      const tutTimer = window.setTimeout(() => {
        enter(introInner);
        revealArrow(introArrow, 1400);
      }, HERO_REVEAL_DELAY);
      cleanups.push(() => window.clearTimeout(tutTimer));

      q('.tut-step-inner, .tut-alt-inner').forEach((inner) => {
        const section = inner.closest('.tut-step, .tut-alt') ?? inner;
        const arrow = section.querySelector<HTMLElement>('.tut-scroll');
        // Stagger the step's children instead of revealing the block in one piece.
        const kids = Array.from(inner.children) as HTMLElement[];
        kids.forEach((kid, i) => arm(kid, ['ck-up', 'ck-slow'], i * 110));
        armArrow(arrow);
        onEnter(section, () => { kids.forEach(enter); revealArrow(arrow, 1200); },
          { threshold: 0, rootMargin: '-30% 0px -30% 0px' });
      });
    }

    // Pillars heading (only the eyebrow-row renders)
    animateHeading(document.querySelector('#features'));

    // Spotlights: copy slides in from one side, the visual from the other.
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

    // RiskFlags heading
    animateHeading(document.querySelector('#risk'));

    // RiskFlags rows slide in from the left and the severity pill pops.
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

    // ProductShot: head fades up, mock rises in, plus a gentle scroll parallax on the host.
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
          // p runs -1 (below viewport) to 1 (above); drift up ~0.2x.
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

    // Security cards fade + scale in a springy cascade.
    const security = document.querySelector('#security');
    if (security) {
      animateHeading(security);

      const cards = q('.seccard', security);
      cards.forEach((c, i) => arm(c, ['ck-seccard'], i * 100));
      onEnter(security, () => cards.forEach(enter));
    }

    // FinalCta: glow pulse on the radial ::before, heading and buttons stagger in.
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

    // Ambient amber wash whenever a section enters the viewport.
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

    // Safety net: snap anything armed but unrevealed that's already in view, so nothing gets stuck hidden.
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
  // Lightweight two page routing: /run-in-word is the tutorial, everything else is the landing (vercel.json rewrites it to index.html).
  const path = window.location.pathname.replace(/\/+$/, '');
  const isTutorial = path === '/run-in-word';

  // Scroll-snap class per route: tut-snap centres the tutorial steps, ck-snap snaps landing sections under the nav.
  useEffect(() => {
    const el = document.documentElement;
    const cls = isTutorial ? 'tut-snap' : 'ck-snap';
    el.classList.add(cls);
    return () => el.classList.remove(cls);
  }, [isTutorial]);

  return (
    <>
      <EntranceReveal />
      <Nav homeHref={isTutorial ? '/' : '#top'} showDemoCta={!isTutorial} />
      {isTutorial ? (
        <main id="top">
          <WordTutorial />
        </main>
      ) : (
        <main id="top">
          <Hero />
          <Pillars />
          <SpotlightApply />
          <SpotlightGrounded />
          <RiskFlags />
          <ProductShot />
          <Security />
          <FinalCta />
        </main>
      )}
      <FooterWordmark />
      <Footer />
    </>
  );
}
