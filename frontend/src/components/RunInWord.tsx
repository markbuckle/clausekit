import { LEASE_DOCX_URL } from '../config';

const REPO_README_URL = 'https://github.com/markbuckle/clausekit#readme';

export default function RunInWord() {
  return (
    <section className="section" id="run-in-word">
      <div className="wrap">
        <div className="cta reveal">
          <h2 className="serif-grad">
            Prefer to see it in <span className="text-gold-grad">real Word</span>?
          </h2>
          <p>
            The demo runs the actual task pane in your browser. To confirm it&apos;s real, sideload
            the add-in into Microsoft Word and apply a redline as a native tracked change.
          </p>
          <div className="cta-btns">
            <a className="btn primary lg" href={LEASE_DOCX_URL} download>
              Download sample lease (.docx)
            </a>
            <a className="btn dark lg" href={REPO_README_URL} target="_blank" rel="noopener noreferrer">
              Sideload instructions <span className="arr">→</span>
            </a>
          </div>
          <ol className="run-steps">
            <li>Start the add-in dev server and the backend (see the repo README).</li>
            <li>
              Sideload into Word: <code>npm start -- --document demo/lease.docx</code>
            </li>
            <li>
              Open the <b>ClauseKit</b> pane, ask &ldquo;is the 5% escalation off-market?&rdquo;, and
              click <b>Apply</b> &mdash; the §5 edit lands as a native tracked change.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
