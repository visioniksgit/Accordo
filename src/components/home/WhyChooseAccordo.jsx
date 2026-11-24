'use client';

import React from 'react';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import styles from './WhyChooseAccordo.module.scss';

// ── Feature Icons matching design ───────────────────────────────────────────
const ZapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const HandshakeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CreditCardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
    <line x1="6" x2="10" y1="15" y2="15" />
  </svg>
);

const DEFAULT_FEATURES = [
  {
    id: 'fast-delivery',
    icon: ZapIcon,
    title: '60 MINS\nDELIVERY',
  },
  {
    id: 'ai-negotiations',
    icon: BotIcon,
    title: 'AI\nNegociations',
  },
  {
    id: 'trusted',
    icon: ShieldCheckIcon,
    title: 'TRUSTED &\nGENUINE',
  },
  {
    id: 'b2b-b2c',
    icon: UsersIcon,
    title: 'B2B & B2C AT\nSAME PLATFORM',
  },
  {
    id: 'credit-facility',
    icon: CreditCardIcon,
    title: 'NBFC\nCredit Facility',
  },
];

const WhyChooseAccordo = ({
  title = 'WHY CHOOSE ACCORDO.AI',
  subTitle = 'Find the right electrical supplies for every project.',
  features = DEFAULT_FEATURES,
  svgUrl,
}) => {
  if (!features || !features.length) return null;

  return (
    <WrapperComponent
      classes={{ sectionClass: `${styles['why-choose-section']} section-b-space` }}
      noRowCol={true}
    >
      {/* ── Section Header ── */}
      <div className={styles['heading-wrapper']}>
        <CustomHeading
          customClass="mb-0 text-center"
          title={title}
          subTitle={subTitle}
          svgUrl={svgUrl}
        />
      </div>

      {/* ── 5 Feature Bubbles Grid/Flex ── */}
      <div className={styles['features-container']}>
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={styles['feature-card']}>
              <div className={styles['icon-bubble']}>
                <Icon />
              </div>
              <h3 className={styles['label']}>
                {item.title.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h3>
            </div>
          );
        })}
      </div>
    </WrapperComponent>
  );
};

export { ZapIcon, BotIcon, HandshakeIcon, ShieldCheckIcon, UsersIcon, CreditCardIcon };
export default WhyChooseAccordo;
