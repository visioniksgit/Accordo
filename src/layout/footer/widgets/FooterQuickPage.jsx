import React, { useContext } from 'react';
import { Col } from 'reactstrap';

const FooterQuickPage = ({ footerMenu, setFooterMenu }) => {
  return (
    <Col xl={2} lg={2} md={6} sm={6}>
      <div
        className={`footer-title ${footerMenu == 'pages' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu((prev) => (prev !== 'pages' ? 'pages' : ''))
        }
      >
        <h4>Other Pages</h4>
      </div>
      <div className="footer-contain">
        <ul>
          <li style={{ marginBottom: '10px' }}>
            <a href={`/account/my-profile`} className="text-content-color">
              My Profile
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href={`/wishlist`} className="text-content-color">
              Wishlist
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href={`/`} className="text-content-color">
              AI Negotiations
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href={`/contact-us`} className="text-content-color">
              Contact Us
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href={`/account/orders`} className="text-content-color">
              My Orders
            </a>
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default FooterQuickPage;
