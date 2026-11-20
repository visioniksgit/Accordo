'use client';
import React from 'react';
import { Row, Col } from 'reactstrap';
import WrapperComponent from '../common/WrapperComponent';
import styles from './ProfileSection.module.scss';
import CustomHeading from '../common/CustomHeading';
import { LeafSVG } from '../common/CommonSVG';

const ProfileSection = () => {
  return (
    <>
      <WrapperComponent
        classes={{
          sectionClass: `${styles['profile-section']} section-b-space`,
        }}
        noRowCol={true}
      >
        <Row>
          <Col>
            <CustomHeading
              customClass="mb-0"
              title="Who We Are ?"
              subTitle="Discover our legacy, values, and commitment to authentic Ayurvedic healthcare."
              svgUrl={<LeafSVG className="icon-width" />}
            />
          </Col>
        </Row>

        <Row className="gy-3">
          <Col lg={6} xs={12}>
            {/* <div className={styles['profile-text-wrapper']}> */}
            <p className={styles['profile-text']}>
              <strong>Shree Dhootapapeshwar Limited</strong> was{' '}
              <strong>established in 1872 </strong> by{' '}
              <strong>Vaidyaraj Krushnashastri Puranik </strong>a physician
              whose singular aim was the proper manufacture of Ayurvedic
              medicines. Over 150 years later, the company remains in the hands
              of the same family, guided by the same purpose. The name has
              grown, science has advanced, but the founding principle, serving
              Ayurved, has not been revised.
            </p>
            <br />
            <p className={styles['profile-text']}>
              This is what the Puranik family calls{' '}
              <strong>Saiddhantik Ayurved</strong>, the practice of Ayurved
              exactly as its principles demand, with no approximation in
              measure, discipline, or balance. Not a tagline, but the discipline
              that has guided every medicine SDL has made for over 150 years
            </p>
            <br />
            <p className={styles['profile-text']}>
              The company today is led by{' '}
              <strong>Shri Ranjit Anand Puranik</strong>, the seventh member of
              the Puranik family to carry the enterprise forward. Run entirely
              by professionals and domain experts, SDL has more Ayurvedic
              physicians on its board than any comparable company in the field.
              Every medicine it makes is shaped by that authority.
            </p>
          </Col>
          <Col lg={6} xs={12} className="d-flex">
            <div className={styles['profile-video-wrapper']}>
              <div className={styles['profile-video']}>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/assets/images/aboutus/siddhantik.jpg"
                >
                  <source src="/assets/english_low_res.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </Col>
          <Col xs={12}>
            <div className={styles['profile-text-wrapper']}>
              <p className={styles['profile-bold-text']}>
                <strong>
                  “We see Ayurved as a medical system being accepted world over.
                  This is an opportunity for us and we foresee being one of the
                  first Classical Ayurved Multinationals.”
                </strong>
              </p>
            </div>
          </Col>
        </Row>
      </WrapperComponent>
    </>
  );
};

export default ProfileSection;
