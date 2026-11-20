"use client"

import { useEffect, useState } from 'react';
import ShowProduct from './ShowProduct';

const StickyCheckout = ({
  productState,
  setProductState,
  // --- Catch the new props ---
  isDoctorProduct,
  isVerifiedDoctor
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 992px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e) => setIsDesktop(e.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  if (!isDesktop) return null;
  if (!productState?.product?.uid && !productState?.product?.id) return null;

  return (
    <ShowProduct
      productState={productState}
      setProductState={setProductState}
      // --- Pass them down ---
      isDoctorProduct={isDoctorProduct}
      isVerifiedDoctor={isVerifiedDoctor}
    />
  );
};

export default StickyCheckout;