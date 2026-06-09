import type { ReactNode } from 'react';

interface Card {
  icon: ReactNode;
  title: string;
  desc: string;
}

const cards: Card[] = [
  {
    icon: <span className="shield" />,
    title: 'SOC 2 Type II',
    desc: 'Independently audited controls for security, availability, and confidentiality - report available under NDA.',
  },
  {
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="7" width="10" height="6.5" rx="1.5" stroke="#FCD34D" strokeWidth="1.4" />
        <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#FCD34D" strokeWidth="1.4" />
      </svg>
    ),
    title: 'Encrypted end to end',
    desc: 'TLS 1.3 in transit and AES-256 at rest. Document text is processed in memory and never persisted to disk.',
  },
  {
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M8 2 3 4v3.5c0 3 2.2 5.3 5 6.5 2.8-1.2 5-3.5 5-6.5V4L8 2Z" stroke="#FCD34D" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="m6 8 1.4 1.4L10.5 6.3" stroke="#FCD34D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Never trained on your data',
    desc: 'Your contracts are excluded from model training by default. No retention beyond your active session.',
  },
  {
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#FCD34D" strokeWidth="1.4" />
        <path d="M2 8h12M8 2c1.8 1.6 1.8 10.4 0 12M8 2C6.2 3.6 6.2 12.4 8 14" stroke="#FCD34D" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Data residency',
    desc: 'Choose where your data lives. US and EU regions available for firms with jurisdictional requirements.',
  },
  {
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <path d="M8 2 3 4.5v3C3 11 5.2 13 8 14c2.8-1 5-3 5-6.5v-3L8 2Z" stroke="#FCD34D" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    title: 'SSO & access control',
    desc: 'SAML single sign-on, SCIM provisioning, and role-based permissions managed by your firm’s admins.',
  },
  {
    icon: (
      <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="#FCD34D" strokeWidth="1.4" />
        <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Full audit trail',
    desc: 'Every suggestion, edit, and apply is logged - so you can show exactly how a clause came to be.',
  },
];

export default function Security() {
  return (
    <section className="section" id="security">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="kicker">Built for privileged work</span>
          <h2 className="serif-grad">Security your clients would approve.</h2>
          <p className="sub">
            ClauseKit is designed for documents under privilege. Your contracts stay yours - they&apos;re
            never used to train anyone&apos;s model.
          </p>
        </div>
        <div className="seccards">
          {cards.map((c) => (
            <div className="seccard reveal" key={c.title}>
              <div className="si">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
