'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { Col, Row } from 'reactstrap';
import { useHomeCategories } from '@/utils/hooks/useHome';
import styles from './ShopByCategory.module.scss';

// Rotating pastel background colors matching the design
const PASTEL_COLORS = [
  '#EDF2FF',
  '#E3F6FC',
  '#FFEEDF',
  '#F2FCD6',
];

const ShopByCategorySkeleton = ({
  title = 'SHOP BY CATEGORY',
  subTitle = 'Find the right electrical supplies for every project.',
  viewAllHref = '/collections',
  viewAllText = 'View All',
}) => (
  <WrapperComponent
    classes={{ sectionClass: `${styles['category-section']} section-b-space` }}
    noRowCol={true}
  >
    <Row className="align-items-center mb-1">
      <Col xs={9} sm={10}>
        <CustomHeading
          customClass="mb-0"
          title={title}
          subTitle={subTitle}
        />
      </Col>
      <Col xs={3} sm={2} className="text-end">
        <Link prefetch={false} href={viewAllHref} className={styles['view-all-link']}>
          {viewAllText}
        </Link>
      </Col>
    </Row>

    <div className={styles['category-grid']}>
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className={styles['category-card']}>
          <div
            className={`${styles['category-bubble']} skeleton-shimmer`}
            style={{ backgroundColor: '#f0f0f0' }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: '70px', height: '12px', borderRadius: '4px', marginTop: '4px' }}
          />
        </div>
      ))}
    </div>
  </WrapperComponent>
);

const ShopByCategory = ({
  categories: propCategories,
  title = 'SHOP BY CATEGORY',
  subTitle = 'Find the right electrical supplies for every project.',
  viewAllHref = '/collections',
  viewAllText = 'View All',
  maxItems = 8,
}) => {
  const { data, isLoading } = useHomeCategories({
    enabled: !propCategories,
  });

  const categories = useMemo(() => {
    const list = propCategories || data?.data?.categories || data?.categories || [];
    if (!Array.isArray(list)) return [];
    return list.slice(0, maxItems);
  }, [propCategories, data, maxItems]);

  if (isLoading && !categories.length) {
    return (
      <ShopByCategorySkeleton
        title={title}
        subTitle={subTitle}
        viewAllHref={viewAllHref}
        viewAllText={viewAllText}
      />
    );
  }

  if (!categories.length) return null;

  return (
    <WrapperComponent
      classes={{ sectionClass: `${styles['category-section']} section-b-space` }}
      noRowCol={true}
    >
      {/* ── Heading + Clean Text Link View All (matches design) ── */}
      <Row className="align-items-center mb-1">
        <Col xs={9} sm={10}>
          <CustomHeading
            customClass="mb-0"
            title={title}
            subTitle={subTitle}
          />
        </Col>
        <Col xs={3} sm={2} className="text-end">
          <Link prefetch={false} href={viewAllHref} className={styles['view-all-link']}>
            {viewAllText}
          </Link>
        </Col>
      </Row>

      {/* ── Dynamic Categories Grid ── */}
      <div className={styles['category-grid']}>
        {categories.map((category, index) => {
          const categoryUid = category.uid || category.id || category.slug || index;
          const categoryName = category.name || category.title || '';
          const categorySlug = category.slug || '';
          const categoryImage = category.image || '/assets/images/placeholder.png';
          const categoryImageAlt = category.imageAlt || categoryName || 'Category';
          const categoryBgColor = category.bgColor || PASTEL_COLORS[index % PASTEL_COLORS.length];
          const href = categorySlug
            ? `/collections?categories=${categorySlug}`
            : (category.href || '/collections');

          return (
            <Link
              key={categoryUid}
              href={href}
              className={styles['category-card']}
              aria-label={`Shop ${categoryName}`}
            >
              {/* Circular bubble with pastel background and product image */}
              <div
                className={styles['category-bubble']}
                style={{ backgroundColor: categoryBgColor }}
              >
                <img
                  src={categoryImage}
                  alt={categoryImageAlt}
                  className={styles['category-image']}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/placeholder.png';
                  }}
                />
              </div>

              {/* Category title */}
              <span className={styles['category-name']}>{categoryName}</span>
            </Link>
          );
        })}
      </div>
    </WrapperComponent>
  );
};

export default ShopByCategory;
