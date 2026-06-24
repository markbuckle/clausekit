import { useEffect } from 'react';
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

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!els.length) return;
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    function snap(e: HTMLElement) {
      e.style.transition = 'none';
      e.style.opacity = '1';
      e.style.transform = 'none';
    }

    function arm() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

      els.forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.top >= vh * 0.96) { e.classList.add('armed'); io.observe(e); }
      });

      setTimeout(() => {
        els.forEach((e) => { if (!e.classList.contains('in')) snap(e); });
      }, 1600);
    }

    requestAnimationFrame(() => requestAnimationFrame(arm));
  }, []);
}

export default function App() {
  useReveal();
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
        {/* <Stats /> */}
        {/* <Testimonial /> */}
        {/* <RunInWord /> */}
        <FinalCta />
      </main>
      <FooterWordmark />
      <Footer />
    </>
  );
}
