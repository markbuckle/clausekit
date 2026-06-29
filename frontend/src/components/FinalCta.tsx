import { PLAYGROUND_URL, LEASE_DOCX_URL } from '../config';

export default function FinalCta() {
  return (
    <section className="section" id="demo">
      <div className="wrap">
        <div className="cta reveal">
          <h2 className="serif-grad">See <span className="text-gold-grad">ClauseKit</span> on your next contract</h2>
          <p>
            Install the add-in, open a draft, and watch it do its magic
          </p>
          <div className="cta-btns">
            <a className="btn demo lg" href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer">
              Run in browser
            </a>
            <a className="btn demo lg blue" href={LEASE_DOCX_URL} download>
              Run in Word
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
