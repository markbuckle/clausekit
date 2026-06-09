export default function Pillars() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="kicker">Review · Draft · Ask</span>
          <h2 className="serif-grad">A sharper first read on every contract.</h2>
          <p className="sub">
            ClauseKit works the way lawyers already do - in the document, clause by clause - and does
            the slow parts in seconds.
          </p>
        </div>
        <div className="pillars">

          <div className="pcard reveal">
            <div className="pico"><span className="shield" /></div>
            <div className="pnum">01 - Review</div>
            <h3>Catch what a tired read misses.</h3>
            <p>
              Surface risk the moment you open a draft - uncapped indemnities, off-market terms, and
              the protections that simply aren&apos;t there.
            </p>
            <ul className="plist">
              <li><span className="d" />Flags risky and missing clauses</li>
              <li><span className="d" />Benchmarks terms against market</li>
              <li><span className="d" />Severity-rated, never alarmist</li>
            </ul>
          </div>

          <div className="pcard reveal">
            <div className="pico">
              <svg className="g" viewBox="0 0 16 16" fill="none">
                <path d="M2 11.5 11 2.5l2.5 2.5-9 9H2v-2.5Z" stroke="#FCD34D" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="pnum">02 - Draft</div>
            <h3>Redline to your standards.</h3>
            <p>
              ClauseKit proposes precise edits in your firm&apos;s voice and playbook. Review the
              redline, then apply it straight into the document.
            </p>
            <ul className="plist">
              <li><span className="d" />Edits written in your house style</li>
              <li><span className="d" />Tracked changes, one click to apply</li>
              <li><span className="d" />Fallback positions on request</li>
            </ul>
          </div>

          <div className="pcard reveal">
            <div className="pico">
              <svg className="g" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#FCD34D" strokeWidth="1.4" />
                <path d="m11 11 3 3" stroke="#FCD34D" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="pnum">03 - Ask</div>
            <h3>Ask the document anything.</h3>
            <p>
              Plain-language answers about what you&apos;re signing - grounded in the contract and cited
              to the exact clause, every time.
            </p>
            <ul className="plist">
              <li><span className="d" />Answers from the full document</li>
              <li><span className="d" />Cites the clause it came from</li>
              <li><span className="d" />No selection needed</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
