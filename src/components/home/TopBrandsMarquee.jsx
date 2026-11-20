'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Row, Col } from 'reactstrap';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { useSection3Brands } from '@/utils/hooks/useHome';
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

// Fallback pill for brands without a logo
const BrandNamePill = ({ name }) => (
  <div
    style={{
      height: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      borderRadius: '10px',
      backgroundColor: '#f0f4ff',
      border: '1px solid #dde5ff',
    }}
  >
    <span
      style={{
        fontSize: '15px',
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
  title = 'TOP BRANDS WE WORK WITH',
  subTitle = 'Quality products from most trusted names',
  viewAllText = 'View All',
  viewAllLink = '/collections',
  speed = 28,
}) => {
  const { data, isLoading } = useSection3Brands();

  const brands = useMemo(() => {
    return data?.data?.brands || [];
  }, [data]);

  const displayItems = useMemo(() => ensureSufficientItems(brands, 10), [brands]);

  const renderBrand = (brand, keyPrefix) => {
    const brandName = brand.name || '';
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
    const brandAlt = brand.imageAlt || brandName || 'Brand Logo';
    const href = `/collections?brand=${encodeURIComponent(brandSlug)}`;

    return (
      <div
        key={`${keyPrefix}-${brand.uid}`}
        href={href}
        className={styles.brandCard}
        aria-label={`Shop ${brandName}`}
        prefetch={false}
      >
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brandAlt}
            width={240}
            height={120}
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
                  'height:48px;display:flex;align-items:center;justify-content:center;padding:0 16px;border-radius:8px;background:#f0f4ff;border:1px solid #dde5ff';
                pill.innerHTML = `<span style="font-size:13px;font-weight:700;color:#234BF3;white-space:nowrap">${brandName}</span>`;
                parent.appendChild(pill);
              }
            }}
          />
        ) : (
          <BrandNamePill name={brandName} />
        )}
      </div>
    );
  };

  // Skeleton while loading
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
        <div style={{ display: 'flex', gap: '48px', padding: '16px 0', overflow: 'hidden' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer"
              style={{ width: 160, height: 90, borderRadius: 8, flexShrink: 0 }}
            />
          ))}
        </div>
      </WrapperComponent>
    );
  }

  // Don't render if no brands returned
  if (!brands.length) return null;

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
        {/* <Col xs={4} sm={3} md={2} className="text-end">
          <Link
            prefetch={false}
            href={viewAllLink}
            className={styles['view-all-link']}
          >
            {viewAllText}
          </Link>
        </Col> */}
      </Row>

      {/* ── Infinite Scrolling Marquee Track ── */}
      <div
        className={styles.marqueeWrapper}
        style={{ '--marquee-speed': `${speed}s` }}
        role="region"
        aria-label="Top Brands Marquee"
      >
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            {displayItems.map((brand, index) =>
              renderBrand(brand, `primary-${index}`)
            )}
          </div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {displayItems.map((brand, index) =>
              renderBrand(brand, `clone-${index}`)
            )}
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
};

export default TopBrandsMarquee;
