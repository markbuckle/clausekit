const items = [
  { value: '70%', label: 'faster first-pass review' },
  { value: '4,500+', label: 'legal teams onboard' },
  { value: '11M+', label: 'clauses analyzed' },
  { value: '4.7★', label: 'average rating on G2' },
];

export default function Stats() {
  return (
    <section className="section tight">
      <div className="wrap">
        <div className="stats reveal">
          {items.map((s) => (
            <div className="stat" key={s.label}>
              <div className="n serif-grad">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
