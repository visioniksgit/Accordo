'use client';

import React, { useRef } from 'react';
import { Col, Row } from 'reactstrap';
import TopbarMarquee from './TopbarMarquee';
import { usePathname } from 'next/navigation';

const HeaderTopBar = ({ isHidden }) => {
  const addClass = useRef(null);
  const pathName = usePathname();

  return (
    <div
      className={`header-top header-top-bar ${pathName === '/checkout' ? 'd-none' : ''} ${isHidden ? 'is-hidden' : ''}`}
      ref={addClass}
      aria-hidden={isHidden ? 'true' : 'false'}
    >
      <div className="header-top-bar__inner">
        <Row className="align-items-center">
          <Col xs={12}>
            <TopbarMarquee />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeaderTopBar;
