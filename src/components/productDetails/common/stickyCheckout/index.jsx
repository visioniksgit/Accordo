"use client"

import ShowProduct from './ShowProduct';

const StickyCheckout = ({
  productState,
  setProductState,
  // --- Catch the new props ---
  isDoctorProduct,
  isVerifiedDoctor
}) => {
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