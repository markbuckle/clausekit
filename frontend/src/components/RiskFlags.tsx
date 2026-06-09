type Severity = 'high' | 'med' | 'low';

interface Flag {
  sev: Severity;
  title: string;
  desc: string;
  loc: string;
}

const flags: Flag[] = [
  { sev: 'high', title: 'Indemnification is uncapped', desc: '§8 carves indemnity out of the liability cap — exposure is unlimited.', loc: '§ 8.1' },
  { sev: 'high', title: 'Liability cap below market', desc: 'Capped at 12 months’ fees; comparable MSAs sit at 2× or greater.', loc: '§ 9.1' },
  { sev: 'med', title: 'Auto-renewal with no notice window', desc: 'Renews for successive terms with no opt-out period defined.', loc: '§ 12.2' },
  { sev: 'med', title: 'Governing law favors counterparty', desc: 'Venue set to Delaware; your standard is the client’s home state.', loc: '§ 17.3' },
  { sev: 'low', title: 'Defined term used before definition', desc: '“Authorized Users” appears in §4 but is first defined in §6.', loc: '§ 4.2' },
];

export default function RiskFlags() {
  return (
    <section className="section" id="risk">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="kicker">Risk review</span>
          <h2 className="serif-grad">A second set of eyes on every page.</h2>
          <p className="sub">
            Open a draft and ClauseKit reads it end to end — ranking issues by severity so you spend
            your attention where it counts.
          </p>
        </div>
        <div className="riskwrap reveal">
          {flags.map((f) => (
            <div className="risk" key={f.loc}>
              <span className={`sev ${f.sev}`}>{f.sev === 'med' ? 'Medium' : f.sev.charAt(0).toUpperCase() + f.sev.slice(1)}</span>
              <div className="rtxt">
                <b>{f.title}</b>
                <span>{f.desc}</span>
              </div>
              <span className="rloc">{f.loc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
