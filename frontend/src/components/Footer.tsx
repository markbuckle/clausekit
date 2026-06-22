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
            {/* <p>The AI legal assistant that reviews contracts beside the lawyer - inside Microsoft Word.</p> */}
          </div>
          <div className="fcol">
            <h5>Product</h5>
            <a href="#features">Review</a>
            <a href="#features">Draft</a>
            <a href="#features">Ask</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="fcol">
            <h5>Resources</h5>
            <a href="#docs">Documentation</a>
            <a href="#playbook">Playbooks</a>
            <a href="#changelog">Changelog</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="fcol">
            <h5>Company</h5>
            <a href="#about">About</a>
            <a href="#customers">Customers</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="fcol">
            <h5>Legal</h5>
            <a href="#security">Security</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#dpa">DPA</a>
          </div>
        </div>
        <div className="foot-base">
          <span>&copy; 2026 ClauseKit, Inc. All rights reserved.</span>
          <span className="soc"><img src={soc2} alt="SOC 2 Type II" /></span>
        </div>
      </div>
    </footer>
  );
}
