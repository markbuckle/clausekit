import type { ReactNode } from 'react';
import shieldIcon from '../../assets/iconsv2/shield-logo.svg';
import lockIcon from '../../assets/iconsv2/lock-logo.svg';
import checkCircleIcon from '../../assets/iconsv2/no-data-logo.svg';
import globeIcon from '../../assets/iconsv2/globe-logo.svg';
import documentIcon from '../../assets/iconsv2/document-logo.svg';
import userIcon from '../../assets/iconsv2/user-logo.svg';

interface Card {
  icon: ReactNode;
  title: string;
  desc: string;
  logo?: boolean;
}

const cards: Card[] = [
  {
    icon: <img src={shieldIcon} alt="" />,
    logo: true,
    title: 'SOC 2 Type II',
    desc: 'Independently audited controls for security, availability, and confidentiality - report available under NDA.',
  },
  {
    icon: <img src={lockIcon} alt="" />,
    logo: true,
    title: 'Encrypted end to end',
    desc: 'TLS 1.3 in transit and AES-256 at rest. Document text is processed in memory and never persisted to disk.',
  },
  {
    icon: <img src={checkCircleIcon} alt="" />,
    logo: true,
    title: 'Never trained on your data',
    desc: 'Your contracts are excluded from model training by default. No retention beyond your active session.',
  },
  {
    icon: <img src={globeIcon} alt="" />,
    logo: true,
    title: 'Data residency',
    desc: 'Choose where your data lives. US and EU regions available for firms with jurisdictional requirements.',
  },
  {
    icon: <img src={userIcon} alt="" />,
    logo: true,
    title: 'SSO & access control',
    desc: 'SAML single sign-on, SCIM provisioning, and role-based permissions managed by your firm’s admins.',
  },
  {
    icon: <img src={documentIcon} alt="" />,
    logo: true,
    title: 'Full audit trail',
    desc: 'Every suggestion, edit, and apply is logged - so you can show exactly how a clause came to be.',
  },
];

export default function Security() {
  return (
    <section className="section" id="security">
      <div className="wrap">
        <div className="eyebrow-row">
          <span className="kicker"></span>
          <h2 className="serif-grad">Your clients privacy,<br></br>our priority</h2>
          <p className="sub">
            ClauseKit is designed for documents under privilege<br></br>Your contracts stay yours
          </p>
        </div>
        <div className="seccards">
          {cards.map((c) => (
            <div className="seccard reveal" key={c.title}>
              <div className={`si${c.logo ? ' logo' : ''}`}>{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
