'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AboutDirectors.module.scss';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import WrapperComponent from '@/components/common/WrapperComponent';

const directors = [
  {
    id: 1,
    title: 'Director Name',
    designation: 'Managing Director',
    description: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat.
      </p>
    ),
    image: '/assets/images/accordo-test-image/wire.png',
  },
  {
    id: 2,
    title: 'Director Name',
    designation: 'Director',
    description: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure
        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident.
      </p>
    ),
    image: '/assets/images/accordo-test-image/wire.png',
  },
  {
    id: 3,
    title: 'Director Name',
    designation: 'Director',
    description: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat
        neque at tincidunt vulputate, justo erat malesuada augue, vitae posuere
        sapien magna at erat. Vestibulum ante ipsum primis in faucibus orci.
      </p>
    ),
    image: '/assets/images/accordo-test-image/wire.png',
  },
  {
    id: 4,
    title: 'Director Name',
    designation: 'Director',
    description: (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore.
      </p>
    ),
    image: '/assets/images/accordo-test-image/wire.png',
  },
];

const AboutDirectors = () => {
  const [flippedId, setFlippedId] = useState(null);

  const showFront = () => setFlippedId(null);
  const showBack = (id) => setFlippedId(id);

  return (
    <>
      {/* <WrapperComponent
        classes={{ sectionClass: 'blog-section section-b-space' }}
        customCol={true}
      >
        <div className="hero-carousel-section" aria-label="Leadership">
          <div className="text-center">
            <h1 className="events-title">Leadership</h1>
            <p className="events-subtitle">
              Guided by purpose and driven by excellence, our leaders continue
              to strengthen our legacy of trusted healthcare.
            </p>
          </div>
        </div>
      </WrapperComponent> */}
      <section className={`${styles.section} section-b-space section-t-space`}>
        <div className="container-fluid-lg">
          <CustomHeading
            customClass="mb-0"
            title="The People Behind Accordo"
            subTitle="Meet the passionate minds driving smarter procurement, better connections, and seamless business experiences."
            svgUrl={<LeafSVG className="icon-width" />}
          />

          <div className="row g-3 g-md-4">
            {directors.map((item) => {
              const isFlipped = flippedId === item.id;

              return (
                <div key={item.id} className="col-lg-3 col-md-6 col-sm-12">
                  <div
                    className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
                  >
                    <div className={styles.inner}>
                      {/* FRONT */}
                      <div className={`${styles.face} ${styles.front}`}>
                        <div className={styles.cardImageWrapper}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.cardImage}
                          />
                        </div>

                        <div className={styles.cardBody}>
                          <div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardDesignation}>
                              {item.designation}
                            </p>
                          </div>
                          <button
                            type="button"
                            className={styles.viewProfileBtn}
                            onClick={() => showBack(item.id)}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className={`${styles.face} ${styles.back}`}>
                        <div className={styles.backHeader}>
                          <h3 className={styles.cardTitle}>{item.title}</h3>
                          <p className={styles.cardDesignation}>
                            {item.designation}
                          </p>
                        </div>

                        <div className={styles.descriptionWrap}>
                          <div className={styles.cardDescription}>
                            {item.description}
                          </div>
                        </div>

                        <div className={styles.backFooter}>
                          <button
                            className={styles.backBtn}
                            onClick={showFront}
                          >
                            ← Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutDirectors;
