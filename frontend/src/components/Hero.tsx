import { PLAYGROUND_URL } from '../config';

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="serif-grad reveal">
          Your contract partner
        </h1>
        <p className="lede reveal">
          Review and redline contracts then simulate the negotiation
        </p>
        <a className="pill" href="#playbook">
          <span className="tag">New</span>
          {' '}ClauseKit now has a negotiation simulator{' '}
          <span className="arr">›</span>
        </a>
        <div className="hero-cta reveal">
          <a className="btn demo lg" href="#demo">
            Try the demo
          </a>
          {/* <a className="btn dark lg" href="#run-in-word">
            Run it in Word <span className="arr">→</span>
          </a> */}
        </div>
        <div className="proof reveal">
          {/* <span><b>Trusted by 4,500+ legal teams</b></span>
          <span className="sep" />
          <span className="stars">★★★★★</span>
          <span>4.7 on G2</span> */}
        </div>
      </div>
    </section>
  );
}
