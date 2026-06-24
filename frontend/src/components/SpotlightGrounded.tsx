import checkLogo from '../../assets/check-logo-small.svg';

export default function SpotlightGrounded() {
  return (
    <section className="section tight">
      <div className="wrap">
        <div className="split rev">
          <div className="copy">
            <span className="kicker">Accurate answers</span>
            <h2 className="serif-grad">Grounded in the clause</h2>
            <p>
              Ask anything - what triggers indemnity, where the governing law sits, whether the cap
              survives termination. ClauseKit answers from the document in front of you and links you
              to the exact language.
            </p>
            <ul className="feat">
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>Reads the whole agreement</b>
                  <span>Context from every page - not just the paragraph you selected</span>
                </span>
              </li>
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>Cites its sources</b>
                  <span>Every claim points back to a numbered clause you can open</span>
                </span>
              </li>
              <li>
                <img className="ic" src={checkLogo} alt="" />
                <span className="ft">
                  <b>Says when it&apos;s unsure</b>
                  <span>If the contract is silent ClauseKit will tell you - instead of inventing</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="viz">
            <div className="minipane reveal">
              <div className="ph">
                <span className="hm"><span>CK</span></span>
                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span className="hn">ClauseKit</span>
                  <span className="hs"><span className="live" />Whole-document context</span>
                </span>
              </div>
              <div className="pchat">
                <div className="row user">
                  <div className="bub user">
                    <p>Does the confidentiality obligation survive termination?</p>
                  </div>
                </div>
                <div className="row">
                  <div className="av"><span>CK</span></div>
                  <div className="bub ai">
                    <p>Yes - for <strong>three years</strong> after termination, and indefinitely for trade secrets.</p>
                    <div className="quote">
                      <div className="qm">§ 10.4 · Confidentiality</div>
                      <div className="qt">
                        Obligations… shall <mark>survive for three (3) years</mark> following expiration or termination.
                      </div>
                    </div>
                    <p>
                      Note: §10 doesn&apos;t define a return-or-destroy duty for Confidential Information
                      on termination - worth adding.
                    </p>
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
