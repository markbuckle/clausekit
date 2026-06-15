import type { ReactNode } from 'react';
import shieldIcon from '../../assets/icons/shield.svg';
import lockIcon from '../../assets/icons/lock.svg';
import checkCircleIcon from '../../assets/icons/check-circle.svg';
import globeIcon from '../../assets/icons/globe.svg';
import documentIcon from '../../assets/icons/document.svg';
import userIcon from '../../assets/icons/user.svg';

interface Card {
  icon: ReactNode;
  title: string;
  desc: string;
}

const cards: Card[] = [
  {
    icon: <img src={shieldIcon} alt="" />,
    title: 'SOC 2 Type II',
    desc: 'Independently audited controls for security, availability, and confidentiality - report available under NDA.',
  },
  {
    icon: <img src={lockIcon} alt="" />,
    title: 'Encrypted end to end',
    desc: 'TLS 1.3 in transit and AES-256 at rest. Document text is processed in memory and never persisted to disk.',
  },
  {
    icon: <img src={checkCircleIcon} alt="" />,
    title: 'Never trained on your data',
    desc: 'Your contracts are excluded from model training by default. No retention beyond your active session.',
  },
  {
    icon: <img src={globeIcon} alt="" />,
    title: 'Data residency',
    desc: 'Choose where your data lives. US and EU regions available for firms with jurisdictional requirements.',
  },
  {
    icon: <img src={userIcon} alt="" />,
    title: 'SSO & access control',
    desc: 'SAML single sign-on, SCIM provisioning, and role-based permissions managed by your firm’s admins.',
  },
  {
    icon: <img src={documentIcon} alt="" />,
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
