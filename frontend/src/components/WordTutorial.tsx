import type { ReactNode } from 'react';
import { LEASE_DOCX_URL, MANIFEST_URL } from '../config';

/** Opens Word for the web (a new tab). Users then open the sample lease there. */
const WORD_ONLINE_URL = 'https://www.office.com/launch/word';

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
  return (
    <section className="section" id="word-tutorial">
      <div className="wrap">
        <div className="tut-head">
          <h2 className="serif-grad">
            Add ClauseKit to your Word in <span className="text-gold-grad">2 minutes</span>
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

        <div className="cta-btns tut-foot-btns">
          <a className="btn demo lg blue" href={LEASE_DOCX_URL} download>
            Download the sample lease
          </a>
          <a
            className="btn demo lg blue"
            href={WORD_ONLINE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Run in Word
          </a>
        </div>
      </div>
    </section>
  );
}
