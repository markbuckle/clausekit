import ckMark from '../../assets/ck-mark-dark.svg';

export default function ProductShot() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="shot-head reveal">
          <span className="kicker">In good company</span>
          <h2 className="serif-grad">The silver standard behind Spellbook in AI contract review</h2>
        </div>
        <div className="shot reveal" id="product">
          <div className="host">
            {/* Title bar */}
            <div className="host-bar">
              <span className="title">
                MimbleCorp_MSA_v4.docx <span className="saved">- Saved to this PC</span>
              </span>
              <span className="dots"><i /><i /><i /></span>
            </div>
            {/* Toolbar */}
            <div className="host-tb">
              <span className="tb-pill">Calibri <span className="car" /></span>
              <span className="tb-pill">11 <span className="car" /></span>
              <span className="sep" />
              <span className="tb b">B</span>
              <span className="tb i">I</span>
              <span className="tb u">U</span>
            </div>
            {/* Body */}
            <div className="host-body">
              {/* Document */}
              <div className="host-doc">
                <div className="doc-page">
                  <h4>MASTER SERVICES AGREEMENT</h4>
                  <div className="dsub">
                    MimbleCorp, Inc.{' '}•{' '}Northwind Systems LLC{' '}•{' '}Execution Copy
                  </div>
                  <h5>8. Indemnification</h5>
                  <p>
                    Each party (the &ldquo;Indemnifying Party&rdquo;) shall defend, indemnify, and hold harmless
                    the other party from and against any third-party claims, damages, and reasonable
                    attorneys&apos; fees arising out of the Indemnifying Party&apos;s breach of this Agreement,
                    gross negligence, or willful misconduct.
                  </p>
                  <h5>9. Limitation of Liability</h5>
                  <p>
                    <span className="doc-hl">
                      9.1{' '} Except as set forth herein, in no event shall either party&apos;s aggregate
                      liability arising out of or related to this Agreement exceed the total fees paid by
                      Customer in the twelve (12) months preceding the event giving rise to the claim.
                    </span>
                  </p>
                  <p>
                    9.2{' '} Neither party shall be liable for any indirect, incidental, consequential,
                    special, or punitive damages, including lost profits, whether in contract, tort, or
                    otherwise, even if advised of the possibility of such damages.
                  </p>
                </div>
              </div>
              {/* Docked pane */}
              <div className="pane">
                <div className="ph">
                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span className="hn">ClauseKit</span>
                    <span className="hs"><span className="live" />Reviewing MSA · 14 pages</span>
                  </span>
                </div>
                <div className="pchat">
                  <div className="row user">
                    <div className="bub user">
                      <p>Is this liability cap standard for an MSA this size?</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="av"><img src={ckMark} alt="ClauseKit" /></div>
                    <div className="bub ai">
                      <p>
                        The cap ties total liability to <strong>12 months of fees</strong> - below
                        market for a deal of this value.
                      </p>
                      <div className="quote">
                        <div className="qm">§ 9.1 · Limitation of Liability</div>
                        <div className="qt">
                          …shall not exceed the total fees paid by Customer in the{' '}
                          <mark>twelve (12) months</mark> preceding the claim.
                        </div>
                      </div>
                      <p>
                        Most MSAs at this contract value cap at{' '}
                        <strong>the greater of 12 months&apos; fees or 2×</strong>. I can revise it.
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="av"><img src={ckMark} alt="ClauseKit" /></div>
                    <div style={{ flex: 1 }}>
                      <div className="action">
                        <div className="ah">
                          <span className="ab">Suggested edit</span>
                          <span className="at">Raise the liability cap to a market-standard floor</span>
                        </div>
                        <div className="diff">
                          <div className="dl del">
                            <span className="t">
                              …exceed the total fees paid by Customer in the twelve (12) months…
                            </span>
                          </div>
                          <div className="dl add">
                            …exceed the greater of (a) the total fees paid in the twelve (12) months,
                            or (b) two times (2×) such fees…
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
                <div className="pinput">
                  <div className="box">
                    <span className="ph2">Ask about this contract…</span>
                    <span className="send">
                      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                        <path
                          d="M12 19V5M12 5l-6 6M12 5l6 6"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
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
