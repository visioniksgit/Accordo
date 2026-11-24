'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Row, Col } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { useHomeClients } from '@/utils/hooks/useHome';
import styles from './TopBrandsMarquee.module.scss';

// Ensure items array is sufficiently wide to avoid gaps on wide displays
const ensureSufficientItems = (list, minCount = 10) => {
  if (!list || list.length === 0) return [];
  let result = [...list];
  while (result.length < minCount) {
    result = [...result, ...list];
  }
  return result;
};

// Fallback pill for clients without a logo
const BrandNamePill = ({ name }) => (
  <div
    style={{
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      borderRadius: '8px',
      backgroundColor: '#f0f4ff',
      border: '1px solid #dde5ff',
    }}
  >
    <span
      style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#234BF3',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </span>
  </div>
);

const TopBrandsMarquee = ({
  title = 'CLIENTS WE WORK WITH',
  subTitle = 'Trusted by leading companies and businesses',
  clients: customClients,
  brands: customBrands,
  speed = 28,
}) => {
  // ── Dynamic clients from section 3 API ──
  const { data, isLoading: isClientsLoading } = useHomeClients();

  const clients = useMemo(() => {
    if (customClients && customClients.length > 0) return customClients;
    if (customBrands && customBrands.length > 0) return customBrands;
    return data?.data?.clients || [];
  }, [customClients, customBrands, data]);

  const isLoading = !customClients && !customBrands && isClientsLoading && !clients.length;

  const displayItems = useMemo(() => ensureSufficientItems(clients, 10), [clients]);

  const renderClient = (client, keyPrefix) => {
    const clientName = client.name || '';
    const clientAlt = client.imageAlt || clientName || 'Client Logo';
    const imageSrc = client.logo || client.image;
    const href = client.link || null;

    const content = (
      <>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={clientAlt}
            width={240}
            height={110}
            className={styles.brandImage}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // On broken image, swap to name pill
              const parent = e.currentTarget.parentElement;
              if (parent) {
                e.currentTarget.style.display = 'none';
                const pill = document.createElement('div');
                pill.style.cssText =
                  'height:60px;display:flex;align-items:center;justify-content:center;padding:0 24px;border-radius:8px;background:#f0f4ff;border:1px solid #dde5ff';
                pill.innerHTML = `<span style="font-size:15px;font-weight:700;color:#234BF3;white-space:nowrap">${clientName}</span>`;
                parent.appendChild(pill);
              }
            }}
          />
        ) : (
          <BrandNamePill name={clientName} />
        )}
      </>
    );

    if (href) {
      return (
        <Link
          key={`${keyPrefix}-${client.id || client.uid || clientName}`}
          href={href}
          className={styles.brandCard}
          aria-label={clientName}
          prefetch={false}
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        key={`${keyPrefix}-${client.id || client.uid || clientName}`}
        className={styles.brandCard}
        aria-label={clientName}
      >
        {content}
      </div>
    );
  };

  // ── Skeleton while loading ──
  if (isLoading) {
    return (
      <WrapperComponent
        classes={{ sectionClass: `${styles['brands-section']} section-b-space` }}
        noRowCol={true}
      >
        <Row className="align-items-center mb-2">
          <Col xs={12}>
            <CustomHeading customClass="mb-0" title={title} subTitle={subTitle} />
          </Col>
        </Row>
        <div style={{ display: 'flex', gap: '60px', padding: '24px 0', overflow: 'hidden', alignItems: 'center' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{ width: 110, height: 110, borderRadius: 12, flexShrink: 0 }}
            />
          ))}
        </div>
      </WrapperComponent>
    );
  }

  // Don't render if no clients returned
  if (!clients.length) return null;

  return (
    <WrapperComponent
      classes={{ sectionClass: `${styles['brands-section']} section-b-space` }}
      noRowCol={true}
    >
      {/* ── Section Header ── */}
      <Row className="align-items-center mb-2">
        <Col xs={12}>
          <CustomHeading customClass="mb-0" title={title} subTitle={subTitle} />
        </Col>
      </Row>

      {/* ── Infinite Scrolling Marquee Track ── */}
      <div
        className={styles.marqueeWrapper}
        style={{ '--marquee-speed': `${speed}s` }}
        role="region"
        aria-label="Clients Marquee"
      >
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            {displayItems.map((client, index) =>
              renderClient(client, `primary-${index}`)
            )}
          </div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {displayItems.map((client, index) =>
              renderClient(client, `clone-${index}`)
            )}
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default TopBrandsMarquee;
