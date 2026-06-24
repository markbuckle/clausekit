import ckMark from '../../assets/ck-mark.svg';
import soc2 from '../../assets/soc2-horizontal.svg';

export default function Footer() {
  return (
    <footer className="foot" id="resources">
      <div className="wrap">
        <div className="foot-grid">
          <div className="fbrand">
            <a className="brand" href="#top">
              <span className="mark logo"><img src={ckMark} alt="ClauseKit" /></span>
              <span className="wordmark"><b>ClauseKit</b></span>
            </a>
          </div>
        </div>
        <div className="foot-base">
          <span>&copy; 2026 ClauseKit, Inc.</span>
          <span className="soc"><img src={soc2} alt="SOC 2 Type II" /></span>
        </div>
      </div>
    </footer>
  );
}
