'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Row } from 'reactstrap';
import FooterCategory from './widgets/FooterCategory';
import FooterUseFul from './widgets/FooterUseFul';
import FooterQuickPage from './widgets/FooterQuickPage';
import SubFooter from './widgets/SubFooter';
import SubFooter2 from './widgets/SubFooter2';
import FooterContactUs from './widgets/FooterContactUs';
import FooterLogoContent from './widgets/FooterLogoContent';
import FooterHighlights from './widgets/FooterHighlights';
import KeywordsSection from '@/components/common/KeywordsSection';
import { useKeywords } from '@/utils/hooks/useHome';

const MainFooter = () => {
  const [footerMenu, setFooterMenu] = useState('');
  const pathname = usePathname();
  const { data } = useKeywords();
  const keywords = data?.data?.metaKeywords || [];

  const isProductPage = pathname?.includes('/product');
  const isShopPage = pathname?.includes('/collection') || pathname?.includes('/shop');

  return (
    <>
      <footer
        translate="no"
        className={`section-t-space ${isProductPage ? 'footer-product-page' : ''} ${isShopPage ? 'footer-shop-page' : ''}`}
      >
        <div className="container-fluid-lg">
          <div className="main-footer ">
            <Row className="g-md-4 g-3">
              <FooterLogoContent />
              <FooterCategory
                footerMenu={footerMenu}
                setFooterMenu={setFooterMenu}
              />
              <FooterQuickPage
                footerMenu={footerMenu}
                setFooterMenu={setFooterMenu}
              />
              <FooterContactUs
                footerMenu={footerMenu}
                setFooterMenu={setFooterMenu}
              />
            </Row>
          </div>
          <FooterHighlights />
          <SubFooter2 />
          <SubFooter />
        </div>
      </footer>
    </>
  );
};

export default MainFooter;
