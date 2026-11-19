'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Image from 'next/image';
import { placeHolderImage } from '../../../../data/CommonPath';
import SettingContext from '@/helper/settingContext';
import Btn from '@/elements/buttons/Btn';
import CartContext from '@/helper/cartContext';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { CUSTOMER_TYPES, getProductCustomerType } from '@/utils/cart/cartUtils';

const ShowProduct = ({
  productState,
  setProductState = () => { },
  // --- Receive the new props ---
  isDoctorProduct,
  isVerifiedDoctor,
}) => {
  const { convertCurrency } = useContext(SettingContext);
  const {
    cartProducts,
    handleIncDec,
    addToCartMutation,
    removeFromCartMutation,
  } = useContext(CartContext);

  const selectedVariation = productState?.selectedVariation;
  const baseProduct = productState?.product;
  const product = productState?.product || {};

  const baseProductName = baseProduct?.name ?? selectedVariation?.name ?? '';
  const variationFromAttributes = Array.isArray(
    selectedVariation?.attribute_values
  )
    ? selectedVariation.attribute_values
      .map((item) => item?.value)
      .filter(Boolean)
      .join(' / ')
    : '';
  const variationFromName =
    selectedVariation?.name && selectedVariation?.name !== baseProductName
      ? selectedVariation.name
      : '';
  const variantName = variationFromAttributes || variationFromName;
  const productName = baseProductName || selectedVariation?.name || '';
  const productImage =
    selectedVariation?.coverImage ??
    selectedVariation?.variation_image ??
    baseProduct?.coverImage ??
    baseProduct?.product_thumbnail ??
    baseProduct?.productVariants?.[0]?.coverImage;

  const departmentName = productState?.product?.department?.name;
  const isBook = departmentName === 'Books';

  const rawSalePrice =
    selectedVariation?.disPrice ??
    selectedVariation?.sale_price ??
    baseProduct?.productVariants?.[0]?.disPrice ??
    baseProduct?.productVariants?.[0]?.sale_price ??
    baseProduct?.disPrice ??
    baseProduct?.sale_price ??
    0;
  const rawMrp =
    selectedVariation?.mrp ??
    selectedVariation?.price ??
    baseProduct?.productVariants?.[0]?.mrp ??
    baseProduct?.productVariants?.[0]?.price ??
    baseProduct?.mrp ??
    baseProduct?.price ??
    rawSalePrice;

  const salePrice = convertCurrency(rawSalePrice);
  const originalPrice = convertCurrency(rawMrp);

  const discount =
    rawMrp > rawSalePrice
      ? Math.round(((rawMrp - rawSalePrice) / rawMrp) * 100)
      : 0;
  const hasDiscount = discount > 0;

  const resolvedStockQuantity = Number(
    selectedVariation?.stockQty ??
    selectedVariation?.quantity ??
    product?.productVariants?.[0]?.stockQty ??
    product?.productVariants?.[0]?.quantity ??
    product?.quantity
  );
  const hasStockQuantity =
    Number.isFinite(resolvedStockQuantity) && resolvedStockQuantity >= 1;
  const hasInStockFlag = Boolean(
    selectedVariation?.inStockFlag ??
    product.productVariants?.[0]?.inStockFlag ??
    false
  );
  const isOutOfStock = !(hasInStockFlag || hasStockQuantity);
  const customerType = getProductCustomerType(baseProduct);
  const isRetailerProduct = customerType === CUSTOMER_TYPES.RETAILER;

  // CartContext expects product.id — provide uid as id
  const cartCompatibleProduct = useMemo(
    () =>
      baseProduct?.uid ? { ...baseProduct, id: baseProduct.uid } : baseProduct,
    [baseProduct]
  );

  const activeColorUid = useMemo(() => {
    return (
      productState?.selectedColorUid ||
      productState?.selectedColor?.uid ||
      productState?.colorUid ||
      selectedVariation?.colorUid ||
      (Array.isArray(selectedVariation?.colorUids)
        ? selectedVariation.colorUids[0]
        : typeof selectedVariation?.colorUids === 'string'
          ? selectedVariation.colorUids.split(',')[0]?.trim()
          : null) ||
      selectedVariation?.colors?.[0]?.uid ||
      null
    );
  }, [productState, selectedVariation]);

  const activeColor = useMemo(() => {
    if (productState?.selectedColor) return productState.selectedColor;
    if (Array.isArray(selectedVariation?.colors) && selectedVariation.colors.length > 0) {
      if (activeColorUid) {
        const found = selectedVariation.colors.find((c) => c?.uid === activeColorUid);
        if (found) return found;
      }
      return selectedVariation.colors[0];
    }
    if (Array.isArray(baseProduct?.colors) && baseProduct.colors.length > 0) {
      if (activeColorUid) {
        const found = baseProduct.colors.find((c) => c?.uid === activeColorUid);
        if (found) return found;
      }
      return baseProduct.colors[0];
    }
    return null;
  }, [productState?.selectedColor, selectedVariation?.colors, baseProduct?.colors, activeColorUid]);

  // Build cart-compatible state for CartContext calls
  const cartCompatibleState = useMemo(() => {
    const cartVariation = selectedVariation
      ? {
        ...selectedVariation,
        id: selectedVariation.uid ?? selectedVariation.id,
        sale_price:
          selectedVariation.disPrice ?? selectedVariation.sale_price,
        price: selectedVariation.mrp ?? selectedVariation.price,
        product_id: baseProduct?.uid ?? baseProduct?.id,
        colorUid: activeColorUid,
        selectedColorUid: activeColorUid,
      }
      : null;
    return {
      ...productState,
      product: cartCompatibleProduct,
      selectedVariation: cartVariation,
      selectedColorUid: activeColorUid,
      colorUid: activeColorUid,
    };
  }, [
    productState,
    cartCompatibleProduct,
    selectedVariation,
    baseProduct?.uid,
    baseProduct?.id,
    activeColorUid,
  ]);

  const [productQty, setProductQty] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const isCartUpdating =
    Boolean(addToCartMutation?.isPending) ||
    Boolean(removeFromCartMutation?.isPending);

  const getSelectedVariationId = (variation) =>
    variation?.uid ??
    variation?.id ??
    variation?.variation_id ??
    variation?.variationId ??
    null;

  const selectedVariationId = getSelectedVariationId(selectedVariation);

  const cartLineForProduct = useMemo(() => {
    if (!cartProducts?.length || !baseProduct?.uid) return null;

    const byProduct = (item) =>
      String(item?.product_id) === String(baseProduct.uid);

    if (selectedVariationId) {
      return (
        cartProducts.find(
          (item) =>
            byProduct(item) &&
            String(item?.variation_id) === String(selectedVariationId) &&
            (!activeColorUid || String(item?.color_id ?? item?.colorUid ?? '') === String(activeColorUid))
        ) ?? null
      );
    }

    return (
      cartProducts.find((item) => byProduct(item) && !item?.variation_id) ??
      null
    );
  }, [cartProducts, baseProduct?.uid, selectedVariationId, activeColorUid]);

  useEffect(() => {
    if (cartLineForProduct) {
      setIsOpen(true);
      setProductQty(cartLineForProduct.quantity || 1);
      setProductState((prev) => ({
        ...prev,
        productQty: cartLineForProduct.quantity || 1,
      }));
    } else {
      setIsOpen(false);
      setProductQty(1);
      setProductState((prev) => ({ ...prev, productQty: 1 }));
    }
  }, [cartLineForProduct, selectedVariationId, setProductState]);

  const handleStickyAddToCart = () => {
    if (!baseProduct || isOutOfStock) return;

    const currentCartQty = Number(cartLineForProduct?.quantity || 0);
    const nextQty = Math.max(1, currentCartQty + 1);
    handleIncDec(
      1,
      cartCompatibleProduct,
      currentCartQty,
      setProductQty,
      setIsOpen,
      cartCompatibleState,
      false
    );
  };

  const handleStickyQtyChange = (delta) => {
    if (!baseProduct || isOutOfStock) return;

    const currentCartQty = Number(
      cartLineForProduct?.quantity ?? productQty ?? 0
    );

    if (delta < 0 && currentCartQty <= 0) return;

    const nextQty = Math.max(0, currentCartQty + delta);
    handleIncDec(
      delta,
      cartCompatibleProduct,
      currentCartQty,
      setProductQty,
      setIsOpen,
      cartCompatibleState,
      false
    );
  };

  return (
    <div className="sticky-bottom-cart d-none d-lg-block">
      <div className="container-fluid-lg">
        <Row>
          <Col xs={12}>
            <div className="cart-content">
              <div className="product-image">
                <Image
                  src={productImage || placeHolderImage}
                  alt={productName || ''}
                  height={60}
                  width={60}
                  unoptimized
                />
                <div className="content">
                  <h5 className="sticky-product-name">{productName}</h5>
                  {(variantName || (activeColor && (activeColor.name || activeColor.hexcode))) && (
                    <div className="sticky-variant-name d-flex align-items-center flex-wrap gap-1">
                      {variantName && <span>{variantName}</span>}
                      {activeColor && (activeColor.name || activeColor.hexcode) && (
                        <span className="d-inline-flex align-items-center gap-1">
                          {variantName && <span style={{ color: '#bbb', margin: '0 2px' }}>•</span>}
                          {activeColor.hexcode && (
                            <span
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: activeColor.hexcode,
                                display: 'inline-block',
                                border: '1px solid rgba(0, 0, 0, 0.2)',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <span>{activeColor.name || activeColor.hexcode}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* --- Updated Pricing Logic Block --- */}
                  <div className="sticky-price-row">
                    <div className="sticky-disc-price">
                      {salePrice}
                    </div>
                    {hasDiscount && (
                      <>
                        <div className="sticky-selling-price">
                          <span
                            style={{
                              fontSize: 13,
                              color: '#535E75',
                              lineHeight: 1,
                            }}
                          >
                            M.R.P.
                          </span>{' '}
                          {originalPrice}
                        </div>
                        <div className="sticky-percent-off">
                          {discount}% Off
                        </div>
                      </>
                    )}
                  </div>
                  {/* --- End Updated Pricing Logic Block --- */}
                </div>
              </div>

              <div className="sticky-cart-button ms-auto">
                {isRetailerProduct ? (
                  <p className="mb-0 small text-content fst-italic">
                    Available to purchase in retail store only,{' '}
                    <a
                      href="/find-the-store"
                      className="theme-color text-decoration-underline"
                    >
                      click here
                    </a>{' '}
                    to find retail stores in your area.
                  </p>
                ) : isOutOfStock ? (
                  <button className="sticky-btn-out-of-stock" disabled>
                    Unavailable
                  </button>
                ) : (
                  <div className="sticky-dual-cart-buttons">
                    {isOpen && !isBook && productQty >= 1 ? (
                      <div
                        className="qty-inline-box"
                        style={{ opacity: isCartUpdating ? 0.6 : 1 }}
                      >
                        <Btn
                          type="button"
                          className="qty-btn qty-minus"
                          onClick={() => handleStickyQtyChange(-1)}
                          disabled={isCartUpdating}
                        >
                          <RiSubtractLine />
                        </Btn>
                        <span className="qty-value">{productQty}</span>
                        <Btn
                          type="button"
                          className="qty-btn qty-plus"
                          onClick={() => handleStickyQtyChange(1)}
                          disabled={isCartUpdating}
                        >
                          <RiAddLine />
                        </Btn>
                      </div>
                    ) : (
                      !isBook && (
                        <Btn
                          type="button"
                          color="primary"
                          className="btn-add-cart addcart-button shimmer"
                          onClick={handleStickyAddToCart}
                          disabled={isCartUpdating}
                        >
                          <span className="label-full">
                            {isCartUpdating ? (
                              <span className="btn-spinner" />
                            ) : (
                              'Add to Cart'
                            )}
                          </span>

                          <span className="label-short">
                            {isCartUpdating ? (
                              <span className="btn-spinner btn-spinner-sm" />
                            ) : (
                              'Add'
                            )}
                          </span>
                        </Btn>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShowProduct;
