import type { ReactNode } from 'react';
import { LEASE_DOCX_URL, MANIFEST_URL } from '../config';

/**
 * "Run in Word" opens the hosted sample lease in Word for the web via the Office
 * Online viewer, which shows it with an "Edit a Copy" button (tutorial step 1) —
 * that saves an editable copy to the user's OneDrive (prompting sign-in if needed).
 * Requires the lease to be publicly reachable, i.e. deployed — not on localhost.
 */
const OFFICE_VIEWER = 'https://view.officeapps.live.com/op/view.aspx?src=';

interface Step {
  img: string;
  alt: string;
  title: string;
  body: ReactNode;
}

const STEPS: Step[] = [
  {
    img: '/tutorial/1-edit-a-copy.png',
    alt: 'Word for the web showing the "Edit a Copy" button',
    title: 'Open the sample lease, then click "Edit a Copy"',
    body: (
      <>
        A downloaded doc opens read-only in Word for the web — click <b>Edit a Copy</b> (top right) so
        you can edit it.
      </>
    ),
  },
  {
    img: '/tutorial/2-add-ins.png',
    alt: 'The Add-ins button near the right end of the Home ribbon',
    title: 'On the Home tab, click "Add-ins"',
    body: <>It sits near the right end of the <b>Home</b> ribbon.</>,
  },
  {
    img: '/tutorial/3-more-add-ins.png',
    alt: 'The "More Add-ins" button at the bottom of the Add-ins panel',
    title: 'Click "More Add-ins"',
    body: <>At the bottom of the Add-ins panel that opens.</>,
  },
  {
    img: '/tutorial/4-manage-my-add-ins.png',
    alt: 'The "Manage My Add-ins" dropdown in the Office Add-ins dialog',
    title: 'Open "Manage My Add-ins"',
    body: (
      <>
        Top-right of the Office Add-ins dialog. A &ldquo;Cannot connect to catalog&rdquo; note is
        harmless — ignore it.
      </>
    ),
  },
  {
    img: '/tutorial/5-upload-my-add-in.png',
    alt: 'The "Upload My Add-in" option',
    title: 'Choose "Upload My Add-in" and pick the manifest',
    body: (
      <>
        Browse to the <code>clausekit-manifest.xml</code> you downloaded and upload it.
      </>
    ),
  },
];

export default function WordTutorial() {
  // Absolute, public URL to the hosted lease (same origin as this landing page),
  // fed to the Office viewer so "Run in Word" opens the actual document.
  const leaseSrc = `${window.location.origin}${LEASE_DOCX_URL}`;
  const runInWordUrl = `${OFFICE_VIEWER}${encodeURIComponent(leaseSrc)}`;

  return (
    <section className="section" id="word-tutorial">
      <div className="wrap">
        <div className="tut-head">
          <h2 className="serif-grad">
            Add <span className="text-gold-grad">ClauseKit</span> to your <span className="text-blue-grad">Word</span> in minutes
          </h2>
          <p className="tut-intro">
            Works in Word for the web or desktop with a Microsoft&nbsp;365 account. Download the
            add-in, then follow the steps.
          </p>
          <div className="cta-btns">
            <a className="btn demo lg" href={MANIFEST_URL} download="clausekit-manifest.xml">
              Download the add-in
            </a>
          </div>
        </div>

        <ol className="tut-steps">
          {STEPS.map((s, i) => (
            <li className="tut-step" key={i}>
              <div className="tut-step-text">
                <span className="tut-num">{i + 1}</span>
                <div>
                  <h3 className="tut-step-title">{s.title}</h3>
                  <p className="tut-step-body">{s.body}</p>
                </div>
              </div>
              <img className="tut-shot" src={s.img} alt={s.alt} loading="lazy" />
            </li>
          ))}
          <li className="tut-step">
            <div className="tut-step-text">
              <span className="tut-num">6</span>
              <div>
                <h3 className="tut-step-title">Run it</h3>
                <p className="tut-step-body">
                  The <b>ClauseKit</b> button appears on the Home tab. Click it, ask &ldquo;is the 5%
                  escalation off-market?&rdquo;, and hit <b>Apply</b> — the §5 edit lands as a native
                  tracked change.
                </p>
              </div>
            </div>
          </li>
        </ol>

        <div className="tut-foot">
          <p className="tut-foot-lead">You can</p>
          <div className="cta-btns">
            <a className="btn demo lg blue" href={LEASE_DOCX_URL} download>
              Download the sample lease
            </a>
            <span className="tut-or">or</span>
            <a
              className="btn demo lg blue"
              href={runInWordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Run in Word
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
