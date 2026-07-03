import shieldIcon from '../../assets/iconsv2/shield-logo.svg';
import penIcon from '../../assets/icons/pen.svg';
import searchIcon from '../../assets/icons/search.svg';

export default function Pillars() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="kicker">Review · Draft · Ask · Negotiate</span>
          <h2 className="serif-grad">A sharper first read<br></br></h2>
          <p className="sub">
ClauseKit takes the tedious work off your plate<br></br>so your time goes to the <br className="br-sm" />judgment calls that matter          </p>
        </div>
        {/* <div className="pillars">

          <div className="pcard reveal">
            <div className="phead">
              <div className="pico"><img src={shieldIcon} alt="" /></div>
              <div className="pnum">Review</div>
            </div>
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
            <div className="phead">
              <div className="pico"><img src={penIcon} alt="" /></div>
              <div className="pnum">Draft</div>
            </div>
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
            <div className="phead">
              <div className="pico"><img src={searchIcon} alt="" /></div>
              <div className="pnum">Ask</div>
            </div>
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

        </div> */}
      </div>
    </section>
  );
}
