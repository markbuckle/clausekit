import type { ReactNode } from 'react';
import { LEASE_DOCX_URL, MANIFEST_URL } from '../config';
// Imported so Vite bundles + hashes them (files under frontend/assets/ aren't
// served by URL - only frontend/public/ is). Same pattern as Nav/Footer/Hero.
import wordstep1 from '../../assets/tutorial/wordstep1.jpg';
import wordstep2 from '../../assets/tutorial/wordstep2.jpg';
import wordstep3 from '../../assets/tutorial/wordstep3.jpg';
import wordstep5 from '../../assets/tutorial/wordstep5.jpg';
import wordstep6 from '../../assets/tutorial/wordstep6.jpg';
import wordstep7 from '../../assets/tutorial/wordstep7.jpg';
import wordstep8 from '../../assets/tutorial/wordstep8.jpg';

/**
 * "Open in Word" opens the hosted sample lease in Word for the web via the Office
 * Online viewer, which shows it with an "Edit a Copy" button - that saves an
 * editable copy to the user's OneDrive (prompting sign-in if needed). Requires
 * the lease to be publicly reachable, i.e. deployed - not on localhost.
 */
const OFFICE_VIEWER = 'https://view.officeapps.live.com/op/view.aspx?src=';

interface Step {
  title: string;
  body: ReactNode;
  img?: string;
  alt?: string;
  cta?: ReactNode;
  /** Top-align this step's content instead of centring it — for tall steps
   *  (extra button or a tall screenshot) that otherwise overflow the viewport. */
  alignTop?: boolean;
}

// Bouncing down-chevron (white -> grey gradient) shown near the bottom of the
// intro and every step to invite the next scroll. The gradient is defined once
// in <WordTutorial> and referenced here by id (#tutArrowGrad).
function ScrollArrow({ href, label = 'Scroll down' }: { href: string; label?: string }) {
  return (
    <a className="tut-scroll" href={href} aria-label={label}>
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="url(#tutArrowGrad)"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9 6.5 9-6.5" />
      </svg>
    </a>
  );
}

export default function WordTutorial() {
  // Absolute, public URL to the hosted lease (same origin as this landing page),
  // fed to the Office viewer so "Open in Word" opens the actual document.
  const leaseSrc = `${window.location.origin}${LEASE_DOCX_URL}`;
  const openInWordUrl = `${OFFICE_VIEWER}${encodeURIComponent(leaseSrc)}`;

  const steps: Step[] = [
    {
      title: 'Download the ClauseKit add-in',
      body: <>Grab the add-in: a small manifest file you&apos;ll load into Word in a moment</>,
      cta: (
        <div className="tut-step-cta">
          <a className="btn demo" href={MANIFEST_URL} download="clausekit-manifest.xml">
            Download the add-in
          </a>
        </div>
      ),
    },
    {
      alignTop: true,
      img: wordstep1,
      alt: 'The sample lease open in Word for the web with an "Edit a Copy" button',
      title: 'Open the sample lease in Word',
      body: (
        <>
          then <b>Edit a Copy</b> (top right) so you can edit it.
        </>
      ),
      cta: (
        <div className="tut-step-cta">
          <a className="btn demo" href={openInWordUrl} target="_blank" rel="noopener noreferrer">
            Open in Word
          </a>
        </div>
      ),
    },
    {
      alignTop: true,
      img: wordstep2,
      alt: 'The Add-ins button near the right end of the Home ribbon',
      title: 'On the Home tab, click "Add-ins"',
      body: <>It sits near the right end of the <b>Home</b> ribbon.</>,
    },
    {
      alignTop: true,
      img: wordstep3,
      alt: 'The "More Add-ins" button at the bottom of the Add-ins panel',
      title: 'Click "More Add-ins"',
      body: <>At the bottom of the Add-ins panel that opens.</>,
    },
    {
      img: wordstep5,
      alt: 'The "Manage My Add-ins" menu with the "Upload My Add-in" option',
      title: 'Upload the ClauseKit Add-in',
      body: (
        <>
          Open <b>Manage My Add-ins</b> (top-right of the Office Add-ins dialog),<br></br> then choose{' '}
          <b>Upload My Add-in</b>.<br></br> A &ldquo;Cannot connect to catalog&rdquo; note is harmless - ignore it.
        </>
      ),
    },
    {
      img: wordstep6,
      alt: 'The Upload Add-in dialog with a Browse button',
      title: 'Click Browse',
      body: (
        <>
          In the <b>Upload Add-in</b> dialog, click <b>Browse</b> to open the file picker.
        </>
      ),
    },
    {
      img: wordstep7,
      alt: 'The file picker with clausekit-manifest.xml selected',
      title: 'Choose the manifest you downloaded earlier',
      body: (
        <>
          Select the <code>clausekit-manifest.xml</code> file you downloaded in step 1,<br></br> then confirm to
          upload it.
        </>
      ),
    },
    {
      alignTop: true,
      img: wordstep8,
      alt: 'ClauseKit applying a redline as a native tracked change',
      title: 'Get started',
      body: (
        <>
          Ask any question or select the suggested prompts<br></br> and let ClauseKit do its magic
        </>
      ),
    },
  ];

  return (
    <section className="section" id="word-tutorial">
      <div className="wrap">
        {/* Gradient for every scroll-arrow, defined once and referenced by id. */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="tutArrowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#9aa0aa" />
            </linearGradient>
          </defs>
        </svg>

        <div className="tut-head">
          <div className="tut-head-inner">
            <h1 className="serif-grad">
              Add <span className="text-gold-grad">ClauseKit</span> to your{' '}
              <span className="text-blue-grad">Word</span> in minutes
            </h1>
            <p className="tut-intro">
              Works in Word for the web or desktop with a Microsoft&nbsp;365 account
            </p>
          </div>
          <ScrollArrow href="#step-1" label="Scroll to step 1" />
        </div>

        <ol className="tut-steps">
          {steps.map((s, i) => (
            <li className={`tut-step${s.alignTop ? ' tut-step--top' : ''}`} id={`step-${i + 1}`} key={i}>
              <div className="tut-step-inner">
                <span className="tut-num">
                  <span>{i + 1}</span>
                </span>
                <h3 className="tut-step-title serif-grad">{s.title}</h3>
                <p className="tut-step-body">{s.body}</p>
                {s.cta}
                {s.img && <img className="tut-shot" src={s.img} alt={s.alt} loading="lazy" />}
              </div>
              <ScrollArrow href={i < steps.length - 1 ? `#step-${i + 2}` : '#tut-alt'} />
            </li>
          ))}
        </ol>

        <div className="tut-alt" id="tut-alt">
          <div className="tut-alt-inner">
            <p className="tut-alt-lead">Alternatively,</p>
            <div className="tut-step-cta">
              <a className="btn demo" href={LEASE_DOCX_URL} download>
                Download the external .docx
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
