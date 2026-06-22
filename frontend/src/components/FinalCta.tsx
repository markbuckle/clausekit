import { PLAYGROUND_URL } from '../config';

export default function FinalCta() {
  return (
    <section className="section" id="demo">
      <div className="wrap">
        <div className="cta reveal">
          <h2 className="serif-grad">See <span className="text-gold-grad">ClauseKit</span> on your next contract.</h2>
          <p>
            Install the add-in, open a draft, and watch it review the document beside you - in
            the panel where your work already happens.
          </p>
          <div className="cta-btns">
            <a className="btn primary lg" href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer">
              Run in browser
            </a>
            <a className="btn dark lg" href="#run-in-word">
              Run in Word <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
