'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Col, Row } from 'reactstrap';
import { useHomeCategories } from '@/utils/hooks/useHome';

const FooterCategory = ({ footerMenu, setFooterMenu }) => {
  const { data } = useHomeCategories();

  // Support both data.data.categories and data.categories if response shape varies
  const apiCategories = useMemo(() => {
    return data?.data?.categories || data?.categories || [];
  }, [data]);

  const items = useMemo(() => {
    if (Array.isArray(apiCategories) && apiCategories.length > 0) {
      return apiCategories.map((cat) => ({
        uid: cat.uid || cat.id || cat.slug,
        title: cat.name || cat.title || '',
        href: cat.slug ? `/collections?categories=${cat.slug}` : (cat.href || '/collections'),
      }));
    }
    return [];
  }, [apiCategories]);

  // Fill first column first (up to 5 items), then second column (up to 5 items)
  const column1Items = items.slice(0, 5);
  const column2Items = items.slice(5, 10);

  return (
    <Col xl={4} lg={4} md={6} sm={12}>
      <div
        className={`footer-title ${footerMenu == 'category' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu((prev) => (prev !== 'category' ? 'category' : ''))
        }
      >
        <h4>Shop Online</h4>
      </div>

      <div className="footer-contain">
        <Row className="g-2">
          <Col xs={6}>
            <ul>
              {column1Items.map((item, idx) => (
                <li key={item.uid || idx} style={{ marginBottom: '10px' }}>
                  <Link href={item.href} className="text-content-color">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={6}>
            <ul>
              {column2Items.map((item, idx) => (
                <li key={item.uid || idx} style={{ marginBottom: '10px' }}>
                  <Link href={item.href} className="text-content-color">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default FooterCategory;
