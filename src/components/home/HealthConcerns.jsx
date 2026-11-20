'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import WrapperComponent from '../common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { Col, Row } from 'reactstrap';
import { useHomeBrands } from '@/utils/hooks/useHome';
import styles from './HealthConcerns.module.scss';

const sliderSettings = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 400,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  pauseOnFocus: true,
  slidesToScroll: 1,
  slidesToShow: 7,
  swipeToSlide: false,
  responsive: [
    { breakpoint: 1440, settings: { slidesToShow: 7 } },
    { breakpoint: 1200, settings: { slidesToShow: 6 } },
    { breakpoint: 768, settings: { slidesToShow: 5 } },
    { breakpoint: 540, settings: { slidesToShow: 3 } },
  ],
};

// Fallback placeholder for brands without a logo
const BrandPlaceholderSVG = ({ name }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f4ff',
      borderRadius: '12px',
      padding: '8px',
    }}
  >
    <span
      style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#234BF3',
        textAlign: 'center',
        lineHeight: 1.3,
        wordBreak: 'break-word',
      }}
    >
      {name}
    </span>
  </div>
);

const ShopByHealthConcerns = () => {
  const sliderContainerRef = useRef(null);
  const { data, isLoading } = useHomeBrands();

  const brands = useMemo(() => {
    return data?.data?.brands || [];
  }, [data]);

  // Ensure enough slides to fill the slider without gaps
  const displayBrands = useMemo(() => {
    if (!brands.length) return [];
    const minCount = sliderSettings.slidesToShow + 1;
    let result = [...brands];
    while (result.length < minCount) {
      result = [...result, ...brands];
    }
    return result;
  }, [brands]);

  useEffect(() => {
    const container = sliderContainerRef.current;
    if (!container) return;

    const updateInertState = () => {
      const slides = container.querySelectorAll('.slick-slide');
      slides.forEach((slide) => {
        const isHidden = slide.getAttribute('aria-hidden') === 'true';
        if (isHidden) {
          if (!slide.hasAttribute('inert')) {
            slide.setAttribute('inert', '');
            slide.inert = true;
          }
        } else {
          if (slide.hasAttribute('inert')) {
            slide.removeAttribute('inert');
            slide.inert = false;
          }
        }
      });
    };

    updateInertState();

    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        if (
          (mutation.type === 'attributes' &&
            (mutation.attributeName === 'aria-hidden' ||
              mutation.attributeName === 'class')) ||
          mutation.type === 'childList'
        ) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) updateInertState();
    });

    observer.observe(container, {
      attributes: true,
      attributeFilter: ['aria-hidden', 'class'],
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [displayBrands]);

  // Don't render anything if no data and not loading
  if (!isLoading && !brands.length) return null;

  return (
    <WrapperComponent
      classes={{
        sectionClass: `${styles['health-concerns-section']} section-b-space`,
      }}
      noRowCol={true}
    >
      {/* ── Heading + View All ── */}
      <Row className="align-items-center mb-1">
        <Col xs={9} sm={10}>
          <CustomHeading
            customClass="mb-0"
            title="SHOP BY BRAND"
            subTitle="Explore quality products from leading and trusted brands, all in one place."
          />
        </Col>
        <Col xs={3} sm={2} className="text-end">
          <Link prefetch={false} href="/collections" className={styles['view-all-link']}>
            View All
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <div
            ref={sliderContainerRef}
            className={`hero-carousel-section ${styles['health-concerns-slider-outer']}`}
          >
            <div className={styles['health-concerns-slider-inner']}>
              {isLoading ? (
                // Skeleton shimmer while loading
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="skeleton-shimmer"
                      style={{
                        flex: '1 1 0',
                        aspectRatio: '1 / 1',
                        borderRadius: '25px',
                        minWidth: 0,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Slider {...sliderSettings}>
                  {displayBrands.map((brand, index) => {
                    const brandKey = `${brand.uid || brand.name}-${index}`;
                    const brandName = brand.name || '';
                    const brandLogo = brand.logo;
                    const brandAlt = brand.imageAlt || brandName || 'Brand Logo';
                    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
                    const href = `/collections?brand=${encodeURIComponent(brandSlug)}`;

                    return (
                      <div key={brandKey}>
                        <a
                          draggable={false}
                          href={href}
                          className={styles['health-concern-card']}
                          aria-label={`Shop ${brandName}`}
                        >
                          <div className={styles['health-concern-image-wrapper']}>
                            {brandLogo ? (
                              <img
                                src={brandLogo}
                                height={150}
                                width={150}
                                alt={brandAlt}
                                className={styles['health-concern-image']}
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.style.display = 'flex';
                                    parent.style.alignItems = 'center';
                                    parent.style.justifyContent = 'center';
                                    parent.style.backgroundColor = '#f0f4ff';
                                    parent.innerHTML = `<span style="font-size:11px;font-weight:700;color:#234BF3;text-align:center;padding:8px">${brandName}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <BrandPlaceholderSVG name={brandName} />
                            )}
                          </div>
                          {/* <h3 className={styles['health-concern-name']}>
                            {brandName}
                          </h3> */}
                        </a>
                      </div>
                    );
                  })}
                </Slider>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </WrapperComponent>
  );
};

export default ShopByHealthConcerns;
