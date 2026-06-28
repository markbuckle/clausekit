import checkLogo from '../../assets/check-logo-small.svg';
import ckMark from '../../assets/ck-mark-dark.svg';

export default function SpotlightApply() {
  return (
    <section className="section tight">
      <div className="wrap">
        <div className="split">
          <div className="copy">
            <span className="kicker">One-click apply</span>
            <h2 className="serif-grad">From suggestion to redline without leaving the page</h2>
            <p>
              ClauseKit proposes the exact language, shows you the redline in context, and writes it
              into the document as a tracked change. You stay in control of every word.
            </p>
            <ul className="feat">
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>See the diff first</b>
                  <span>Old and new text, side by side, before anything changes</span>
                </span>
              </li>
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>Applies as tracked changes</b>
                  <span>Every edit is reviewable and reversible in Word</span>
                </span>
              </li>
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>Edit before you accept</b>
                  <span>Tweak the wording inline</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="viz">
            <div className="minipane reveal">
              <div className="ph">
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span className="hn">ClauseKit</span>
                  <span className="hs"><span className="live" />§ 12 · Term &amp; Termination</span>
                </span>
              </div>
              <div className="pchat">
                <div className="row user">
                  <div className="bub user"><p>This auto-renews. Add a notice window.</p></div>
                </div>
                <div className="row">
                  <div className="av"><img src={ckMark} alt="ClauseKit" /></div>
                  <div style={{ flex: 1 }}>
                    <div className="action">
                      <div className="ah">
                        <span className="ab">Suggested edit</span>
                        <span className="at">Add a 60-day non-renewal notice right</span>
                      </div>
                      <div className="diff">
                        <div className="dl del">
                          <span className="t">…shall automatically renew for successive one-year terms.</span>
                        </div>
                        <div className="dl add">
                          …shall renew for successive one-year terms unless either party gives sixty (60) days&apos; written notice of non-renewal.
                        </div>
                      </div>
                      <div className="afoot">
                        <button className="pbtn primary"><span className="chk" />Apply Change</button>
                        <button className="pbtn ghost">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
