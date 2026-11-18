import { Col, Row } from 'reactstrap';
import { useTranslation } from '@/utils/translations';
import {
  RiBuildingLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiSmartphoneLine,
} from 'react-icons/ri';

const ContactLeftSideBox = () => {
  const { t } = useTranslation('common');
  return (
    <Col lg={12}>
      <div className="left-sidebar-box">
        <Row>
          <Col xl={12}>
            <div className="contact-title">
              <h3>{t('GetInTouch')}</h3>
            </div>

            <div className="contact-detail mb-4">
              <Row className="g-4">
                <h3>Registered office :</h3>
                <Col xxl={4} lg={4} sm={6}>
                  <a href='tel:9898989898' className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiPhoneLine />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Phone</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>+91-9898989898</p>
                    </div>
                  </a>
                </Col>

                <Col xxl={4} lg={4} sm={6}>
                  <a href='mailto:test@gmail.com' className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiMailLine />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Email</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>test@gmail.com</p>
                    </div>
                  </a>
                </Col>

                <Col xxl={4} lg={4} sm={6}>
                  <div className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiMapPin2Line />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Address</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>701, Haware Infotech Park, Sector 30A, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703
                      </p>
                    </div>
                  </div>
                </Col>

                {/* <Col xxl={6} lg={12} sm={6}>
                  <div className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiBuildingLine />
                    </div>
                    <div className="contact-detail-title">
                      <h4>{themeOption?.contact_us?.detail_4?.label}</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>{themeOption?.contact_us?.detail_4?.text}</p>
                    </div>
                  </div>
                </Col> */}
              </Row>
            </div>
            {/* <div className="contact-detail">
              <Row className="g-4">
                <h3>Administrative office :</h3>
                <Col xxl={4} lg={4} sm={6}>
                  <a href='tel:9898989898' className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiPhoneLine />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Phone</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>+91-9898989898</p>
                    </div>
                  </a>
                </Col>

                <Col xxl={4} lg={4} sm={6}>
                  <a href='mailto:test@gmail.com' className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiMailLine />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Email</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>test@gmail.com</p>
                    </div>
                  </a>
                </Col>

                <Col xxl={4} lg={4} sm={6}>
                  <div className="contact-detail-box h-100">
                    <div className="contact-icon">
                      <RiMapPin2Line />
                    </div>
                    <div className="contact-detail-title">
                      <h4>Address</h4>
                    </div>

                    <div className="contact-detail-contain">
                      <p>701, Haware Infotech Park, Sector 30A, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703
                      </p>
                    </div>
                  </div>
                </Col>

                
              </Row>
            </div> */}
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ContactLeftSideBox;
