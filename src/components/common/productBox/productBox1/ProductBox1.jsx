'use client';

import React, { useState, useEffect, useMemo, useContext, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartContext from '@/helper/cartContext';
import { RiStarFill, RiInformationLine } from 'react-icons/ri';
import { UncontrolledTooltip } from 'reactstrap';
import ProductBox1Cart from './ProductBox1Cart';
import ProductBadge from './ProductBagde';
import { ModifyString } from '@/utils/customFunctions/ModifyString';
import AddToWishlistNew from '../AddToWishlistNew';
import {
  convertToRupees,
  formatReviewCount,
  getProductImageUrl,
  getOptimizedCdnImageUrl,
} from '@/utils/helpers';
import useImagePreload from '@/utils/hooks/useImagePreload';
import { brandLogo } from '../../../../data/CommonPath';
import { useUser } from '@/utils/hooks/useUser';


const ProductBox1 = ({
  imgUrl,
  productDetail,
  isClose,
  addAction = true,
  showBuyNow = true,
  classObj,
  onRemoveClick,
}) => {
  const reviewTooltipId = useId().replace(/:/g, '');
  const { isAuthenticated, userData } = useUser();
  const { cart } = useContext(CartContext) || {};
  const currentTheme = cart?.theme || productDetail?.theme;

  // console.log("product box 1 ", productDetail);
  // console.log("UserData ", userData);

  // Variants and color selection
  const productVariants = useMemo(() => {
    return Array.isArray(productDetail?.productVariants)
      ? productDetail.productVariants
      : Array.isArray(productDetail?.variations)
        ? productDetail.variations
        : [];
  }, [productDetail]);

  const colors = useMemo(() => {
    if (Array.isArray(productDetail?.colors) && productDetail.colors.length > 0) {
      return productDetail.colors;
    }
    if (Array.isArray(productVariants[0]?.colors) && productVariants[0].colors.length > 0) {
      return productVariants[0].colors;
    }
    const allColors = [];
    const seenUids = new Set();
    productVariants.forEach((v) => {
      if (Array.isArray(v?.colors)) {
        v.colors.forEach((c) => {
          if (c?.uid && !seenUids.has(c.uid)) {
            seenUids.add(c.uid);
            allColors.push(c);
          }
        });
      }
    });
    return allColors;
  }, [productDetail?.colors, productVariants]);

  const [selectedColorUid, setSelectedColorUid] = useState(() => {
    return colors[0]?.uid || null;
  });

  const selectedColor = useMemo(() => {
    return colors.find((c) => c.uid === selectedColorUid) || colors[0] || null;
  }, [colors, selectedColorUid]);

  useEffect(() => {
    if (colors.length > 0) {
      if (!selectedColorUid || !colors.some((c) => c.uid === selectedColorUid)) {
        setSelectedColorUid(colors[0]?.uid || null);
      }
    } else {
      setSelectedColorUid(null);
    }
  }, [colors, selectedColorUid]);

  const handleColorSelect = (color) => {
    if (!color?.uid) return;
    setSelectedColorUid(color.uid);
  };

  const selectedVariant = useMemo(() => {
    if (!productVariants.length) return null;
    if (selectedColorUid) {
      const match = productVariants.find(
        (v) =>
          v?.colors?.some((c) => c?.uid === selectedColorUid) ||
          v?.colorUid === selectedColorUid ||
          (Array.isArray(v?.colorUids) && v.colorUids.includes(selectedColorUid))
      );
      if (match) return match;
    }
    return productVariants[0];
  }, [productVariants, selectedColorUid]);

  const displayPrices = useMemo(() => {
    const variations = productDetail?.variations;
    if (
      productDetail?.type === 'classified' &&
      Array.isArray(variations) &&
      variations.length > 0
    ) {
      const inStock = variations.filter((v) => v.stock_status === 'in_stock');
      const pool = inStock.length > 0 ? inStock : variations;
      const cheapest = pool.reduce((min, v) => {
        const p = v.sale_price ?? v.price ?? Infinity;
        const mp = min.sale_price ?? min.price ?? Infinity;
        return p < mp ? v : min;
      }, pool[0]);
      return {
        salePrice: cheapest.sale_price ?? cheapest.price,
        price: cheapest.price,
        discount: cheapest.discount ?? productDetail?.discount,
      };
    }

    if (
      productDetail?.disPrice !== undefined ||
      productDetail?.mrp !== undefined ||
      productDetail?.sale_price !== undefined ||
      productDetail?.price !== undefined
    ) {
      const mrp = Number(productDetail?.mrp ?? productDetail?.price ?? 0);
      const sale = Number(productDetail?.disPrice ?? productDetail?.sale_price ?? mrp);
      const discount =
        productDetail?.discountPercent ??
        productDetail?.discount ??
        (mrp > sale && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0);
      return {
        salePrice: sale,
        price: mrp,
        discount,
      };
    }

    const firstVariant = productVariants[0];
    if (firstVariant) {
      const mrp = Number(firstVariant.mrp ?? firstVariant.price ?? 0);
      const sale = Number(firstVariant.disPrice ?? firstVariant.sale_price ?? mrp);
      const discount =
        firstVariant.discountPercent ??
        firstVariant.discount ??
        (mrp > sale && mrp > 0 ? Math.round(((mrp - sale) / mrp) * 100) : 0);
      return {
        salePrice: sale,
        price: mrp,
        discount,
      };
    }

    return {
      salePrice: 0,
      price: 0,
      discount: 0,
    };
  }, [productDetail, productVariants]);

  const productCustomerType = productDetail?.customerType;

  const isDoctorProduct = productCustomerType === 'doctor';
  const isVerifiedDoctor = isAuthenticated && userData?.isDoctor === true;

  // Pricing access condition helper
  const shouldShowPricing = useMemo(() => {
    // Non-doctor products: always show pricing
    if (!isDoctorProduct) return true;

    // Doctor products: only show pricing if logged in AND is a doctor
    return isAuthenticated && userData?.isDoctor === true;
  }, [isDoctorProduct, isAuthenticated, userData?.isDoctor]);

  // Get rating and review count from product data
  const ratingData = useMemo(() => {
    return {
      rating: Number(productDetail?.rating ?? 0),
      reviewCount: Number(
        productDetail?.reviewCount ??
        productDetail?.rating_count ??
        productDetail?.reviews_count ??
        0
      ),
    };
  }, [productDetail]);

  const productHref = useMemo(() => {
    const slug = productDetail?.slug;
    const variantSlug = selectedVariant?.slug || productVariants[0]?.slug || '';
    const colorSlug =
      selectedColor?.slug ||
      (selectedColor?.name ? selectedColor.name.toLowerCase().replace(/\s+/g, '-') : '');
    if (!slug) return '/collections';
    const params = new URLSearchParams();
    if (variantSlug) params.set('productVariant', variantSlug);
    if (colorSlug) params.set('color', colorSlug);
    const queryString = params.toString();
    return `/products/${slug}${queryString ? `?${queryString}` : ''}`;
  }, [productDetail?.slug, selectedVariant, productVariants, selectedColor]);

  const companyName = useMemo(() => {
    return (
      productDetail?.brand?.name ||
      productDetail?.companyName ||
      productDetail?.company_name ||
      productDetail?.brand_name ||
      productDetail?.brandName ||
      (typeof productDetail?.brand === 'string' ? productDetail?.brand : null) ||
      productDetail?.manufacturedBy?.companyName ||
      productDetail?.manufacturer?.companyName ||
      productDetail?.marketedBy?.companyName ||
      null
    );
  }, [productDetail]);

  const variantName = useMemo(() => {
    const rawVariantName =
      selectedVariant?.name ||
      selectedVariant?.variation_name ||
      '';

    if (rawVariantName && rawVariantName.trim() !== productDetail?.name?.trim()) {
      return rawVariantName.trim();
    }

    if (Array.isArray(selectedVariant?.attribute_values) && selectedVariant.attribute_values.length > 0) {
      const attrString = selectedVariant.attribute_values
        .map((item) => item?.value)
        .filter(Boolean)
        .join(' / ');
      if (attrString && attrString.trim() !== productDetail?.name?.trim()) {
        return attrString.trim();
      }
    }

    if (selectedVariant?.weight || selectedVariant?.unit) {
      const weightStr = `${selectedVariant.weight || ''}${selectedVariant.unit ? ` ${selectedVariant.unit}` : ''}`.trim();
      if (weightStr && weightStr !== productDetail?.name?.trim()) {
        return weightStr;
      }
    }

    return '';
  }, [selectedVariant, productDetail?.name]);

  const imageSource = useMemo(() => {
    const rawUrl =
      productDetail?.coverImage ||
      productVariants[0]?.coverImage ||
      getProductImageUrl(imgUrl) ||
      getProductImageUrl(productDetail?.product_thumbnail);
    return getOptimizedCdnImageUrl(rawUrl, 400, 400, 95);
  }, [imgUrl, productDetail?.coverImage, productDetail?.product_thumbnail, productVariants]);

  const {
    resolvedSrc,
    isLoaded: isImageLoaded,
    isError: isImageError,
  } = useImagePreload(imageSource, {
    fallbackSrc: '',
  });

  return (
    <div
      className={`product-box d-flex flex-column h-100 ${classObj?.productBoxClass} p-0`}
    >
      <ProductBadge productDetail={productDetail} />
      <div className="product-image">
        <a
          className="d-block h-100 w-100 product-image-link"
          href={productHref}
        >
          {/* console.log(currentTheme?.type) &&  */}
          {(currentTheme?.type === "Website") && currentTheme?.image && (
            <Image src={currentTheme.image} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              zIndex: '3',
              left: '0',
              top: '0',
            }} alt={currentTheme?.imageAlt || "event theme"} width={500} height={500} />
          )}
          <span
            className={`product-image-shell ${isImageLoaded ? 'is-loaded' : 'is-loading'} ${isImageError ? 'is-error' : ''}`}
            aria-busy={!isImageLoaded}
          >
            {!isImageLoaded && !isImageError ? (
              <span className="product-image-skeleton" aria-hidden="true" />
            ) : null}

            {isImageLoaded ? (
              <img
                src={resolvedSrc}
                alt={
                  variantName
                    ? `${productDetail?.name || ''} - ${variantName}`
                    : productDetail?.name || 'Product image'
                }
                className="img-fluid h-100 product-image-preloaded"
                draggable={false}
                height={188}
                width={249}
                loading="lazy"
                decoding="async"
              />
            ) : null}

            {isImageError ? (
              <span className="product-image-fallback-text">
                Image unavailable
              </span>
            ) : null}
          </span>
        </a>
        <AddToWishlistNew
          productObj={productDetail}
          isActive={isClose}
          onRemoveClick={onRemoveClick}
        />
      </div>
      <div className="product-detail">
        <div className="product-detail--wrapper">
          {companyName && (
            <span className="product-company-name">
              {companyName}
            </span>
          )}
          <h3 style={{ fontSize: 'inherit' }} className={variantName ? 'has-variant' : ''}>
            <Link title={productDetail?.name} href={productHref} prefetch={false} className="name">
              {productDetail?.name}
            </Link>
          </h3>
          {variantName && (
            <div className="product-variant-name" title={variantName}>
              <Link href={productHref} prefetch={false} className="variant-link">
                {variantName}
              </Link>
            </div>
          )}
          <div className="product-detail-bottom">
            <div className="meta-1">
              <div className="">
                {productDetail?.unit && productDetail?.weight ? (
                  <h6 className="unit">
                    {productDetail?.weight}
                    {productDetail?.unit}
                  </h6>
                ) : null}
                {productDetail?.stock_status === 'in_stock' && (
                  <span className="in_stock-color">
                    {ModifyString(productDetail.stock_status, false, '_')}
                  </span>
                )}
              </div>
              {ratingData.rating > 0 && (
                <div className="">
                  <div className="rating-section">
                    <span className="stars">
                      <RiStarFill size={14} />
                    </span>
                    <span className="review-count">
                      <span className="count">
                        {ratingData.rating.toFixed(1)}
                      </span>{' '}
                      ({formatReviewCount(ratingData.reviewCount)})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Colors Selection Row */}
            {colors.length > 0 && (
              <div className="product-card-colors mb-2">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {colors.map((color, idx) => {
                    const isSelected = selectedColorUid
                      ? color.uid === selectedColorUid
                      : idx === 0;
                    const hex = color.hexcode || color.hex || '#ccc';
                    return (
                      <button
                        key={color.uid || `${color.name}-${idx}`}
                        type="button"
                        className={`product-color-circle ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleColorSelect(color);
                        }}
                        title={color.name || 'Color'}
                        aria-label={`Select color ${color.name || ''}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: hex,
                          border: hex,
                          boxShadow: isSelected
                            ? '0 0 0 1px #fff, 0 0 0 3px var(--theme-color, #0da487)'
                            : 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'inline-block',
                          flexShrink: 0,
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="price-row">
              {displayPrices.salePrice === displayPrices.price ? (
                // Sale price and MRP are the same -> Only show one price
                <div className="disc-price">
                  <span
                    style={{
                      fontSize: 14,
                      color: '#535E75',
                      lineHeight: 1,
                    }}
                  >
                    M.R.P.
                  </span>{' '}
                  {convertToRupees(displayPrices.salePrice)}
                </div>
              ) : (
                // Sale price is different from MRP -> Show both + conditional discount
                <>
                  <div className="price-group d-flex align-items-center gap-2">
                    <div className="disc-price">
                      {convertToRupees(displayPrices.salePrice)}
                    </div>

                    <div className="selling-price">
                      {convertToRupees(displayPrices.price)}
                    </div>
                  </div>

                  {displayPrices.discount > 0 && (
                    <div className="percent-off">
                      {displayPrices.discount}% Off
                    </div>
                  )}
                </>
              )}
            </div>

            {addAction && (
              <ProductBox1Cart
                productObj={productDetail}
                selectedVariant={selectedVariant}
                selectedColorUid={selectedColorUid}
                selectedColor={selectedColor}
                showBuyNow={showBuyNow}
                shouldShowPricing={shouldShowPricing}
                displayPrices={displayPrices}
                isDoctorProduct={isDoctorProduct}
                isVerifiedDoctor={isVerifiedDoctor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBox1;
