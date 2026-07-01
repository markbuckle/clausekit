import { LEASE_DOCX_URL, MANIFEST_URL } from '../config';

export default function RunInWord() {
  return (
    <section className="section" id="run-in-word">
      <div className="wrap">
        <div className="cta reveal">
          <h2 className="serif-grad">
            Prefer to run it in <span className="text-gold-grad">real Word</span>?
          </h2>
          <p>
            The browser demo runs the actual task pane. To see it apply <b>native tracked changes</b>{' '}
            inside Microsoft Word, add ClauseKit to your own Word (Microsoft&nbsp;365) and open the
            sample lease.
          </p>
          <div className="cta-btns">
            <a className="btn primary lg" href={MANIFEST_URL} download="clausekit-manifest.xml">
              Download the add-in
            </a>
            <a className="btn dark lg" href={LEASE_DOCX_URL} download>
              Download sample lease (.docx)
            </a>
          </div>
          <ol className="run-steps">
            <li>Download both files above.</li>
            <li>
              In Word (desktop or the web), go to <b>Insert → Add-ins → Upload My Add-in</b> and select{' '}
              <code>clausekit-manifest.xml</code>.
            </li>
            <li>
              Open the sample lease, click the <b>ClauseKit</b> button on the Home tab, ask
              &ldquo;is the 5% escalation off-market?&rdquo;, and click <b>Apply</b> &mdash; the §5 edit
              lands as a native tracked change.
            </li>
          </ol>
          <p className="run-note">
            Requires a Microsoft&nbsp;365 account with add-in sideloading enabled. The task pane is
            hosted; it talks to the live ClauseKit backend.
          </p>
        </div>
      </div>
    </section>
  );
}
