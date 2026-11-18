import { Label } from 'reactstrap';
import ProductBox1Rating from '../ProductBox1Rating';
import { ModifyString } from '@/utils/customFunctions/ModifyString';
import TextLimit from '@/utils/customFunctions/TextLimit';
import { useEffect, useMemo, useOptimistic, useState } from 'react';
import {
  RiHeartLine,
  RiHeartFill,
  RiShareLine,
  RiCopperCoinLine,
  RiStarFill,
  // RiFacebookFill,
  // RiTwitterFill,
  // RiWhatsappFill,
  // RiLinkedinFill,
  // RiFileCopyLine,
  // RiCoinsLine,
  // RiShoppingCartLine,
} from 'react-icons/ri';
import {
  buildProductUrl,
  getShareLinks,
  convertToRupees,
  formatReviewCount,
  // copyLinkToClipboard,
  // openShareWindow,
} from '@/utils/helpers';
import { useAddToWishlist, useIsInWishlist } from '@/utils/hooks/useWishlist';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import OtpLoginModal from '@/components/auth/login/OtpLoginModal';
import {
  POST_LOGIN_ACTIONS,
  storePendingPostLoginAction,
} from '@/utils/postLoginAction';
import { getProductEarnedSdlCoins } from '@/utils/cart/cartUtils';
import PdpColorSelector from '@/components/productsDetails/PdpColorSelector';

const RightVariationModal = ({
  cloneVariation,
  setCloneVariation,
  shouldShowPricing,
  displayPrices,
  isDoctorProduct,
  isVerifiedDoctor,
}) => {
  // const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const variations =
    Array.isArray(cloneVariation?.product?.productVariants) && cloneVariation.product.productVariants.length > 0
      ? cloneVariation.product.productVariants
      : Array.isArray(cloneVariation?.product?.variations) && cloneVariation.product.variations.length > 0
        ? cloneVariation.product.variations
        : [];

  const getVariationId = (v) =>
    v?.uid ?? v?.id ?? v?.variation_id ?? v?.variationId ?? v?._id;

  const selectedVariationId = getVariationId(cloneVariation?.selectedVariation);

  const checkVariantInStock = (v) => {
    if (!v) return false;
    if (typeof v.inStockFlag === 'boolean') return v.inStockFlag;
    if (v.stock_status) return v.stock_status === 'in_stock';
    const qty = Number(v.stockQty ?? v.quantity);
    return Number.isFinite(qty) && qty > 0;
  };

  const currentVariant = useMemo(() => {
    const sel = cloneVariation?.selectedVariation;
    const selId = getVariationId(sel);
    const enriched = selId
      ? variations.find((v) => getVariationId(v) === selId)
      : null;

    return (
      (enriched?.colors ? enriched : null) ||
      (sel?.colors ? sel : null) ||
      enriched ||
      sel ||
      variations.find((v) => checkVariantInStock(v)) ||
      variations[0] ||
      null
    );
  }, [cloneVariation?.selectedVariation, variations]);

  // Get current stock status
  const isInStock = cloneVariation?.selectedVariation
    ? checkVariantInStock(cloneVariation.selectedVariation)
    : checkVariantInStock(cloneVariation?.product);
  const stockStatus = isInStock ? 'in_stock' : 'out_of_stock';

  // Match product details SKU handling so variant changes are reflected here too.
  const representativeVariant =
    cloneVariation?.product?.productVariants?.find(
      (variant) => variant?.inStockFlag
    ) ?? cloneVariation?.product?.productVariants?.[0];
  const sku =
    cloneVariation?.selectedVariation?.sku ??
    cloneVariation?.selectedVariation?.skuCode ??
    cloneVariation?.product?.sku ??
    representativeVariant?.skuCode ??
    representativeVariant?.sku;

  // Get product name (title should always show product name, not variant name)
  const productName = cloneVariation?.product?.name;
  const productUid = cloneVariation?.product?.uid;
  const isWishlisted = useIsInWishlist(productUid);
  const [optimisticIsWishlisted, setOptimisticIsWishlisted] = useOptimistic(
    isWishlisted,
    (_, nextValue) => nextValue
  );
  const addToWishlistMutation = useAddToWishlist();

  // Get keywords/tags from categories or product tags
  const categories = cloneVariation?.product?.categories || [];
  const tags = cloneVariation?.product?.tags || [];
  const keywords = [
    ...categories.map((c) => c?.name),
    ...tags.map((t) => t?.name),
  ].filter(Boolean);

  const superCoins = getProductEarnedSdlCoins({
    selectedVariation: cloneVariation?.selectedVariation,
    product: cloneVariation?.product,
  });

  // Get weight and unit 
  const weight =
    cloneVariation?.selectedVariation?.weight ??
    cloneVariation?.product?.weight;
  const unit =
    cloneVariation?.selectedVariation?.unit ?? cloneVariation?.product?.unit;

  // Get rating data
  const rating = cloneVariation?.product?.rating ?? 0;
  const reviewCount = cloneVariation?.product?.rating_count ?? 0;

  // Get price and discount
  const displaySalePrice =
    cloneVariation?.selectedVariation?.sale_price ??
    cloneVariation?.product?.sale_price;
  const displayPrice =
    cloneVariation?.selectedVariation?.price ?? cloneVariation?.product?.price;
  const displayDiscount =
    cloneVariation?.selectedVariation?.discount ??
    cloneVariation?.product?.discount;

  // Selected quantity snapshot for the badge
  const selectedQuantity =
    cloneVariation?.selectedVariation?.quantity ??
    cloneVariation?.product?.quantity ??
    0;

  const selectedVariantLabel = (() => {
    const v = cloneVariation?.selectedVariation;
    if (!v) return '';
    const attr = (v?.attribute_values || [])
      .map((val) => val?.value)
      .filter(Boolean)
      .join(' / ');
    return v?.name || attr || '';
  })();

  const handleVariantSelect = (variation) => {
    if (!setCloneVariation || !variation) return;

    const attributeIds = (variation?.attribute_values || [])
      .map((val) => val?.id)
      .filter(Boolean);

    const nextVariationId = getVariationId(variation);
    const defaultColor =
      Array.isArray(variation?.colors) && variation.colors.length > 0
        ? variation.colors[0]
        : null;

    setCloneVariation((prev) => ({
      ...prev,
      attributeValues: attributeIds,
      variantIds: attributeIds,
      selectedVariation: variation,
      variation: variation,
      variation_id: nextVariationId,
      selectedColorUid: defaultColor?.uid || null,
      selectedColor: defaultColor || null,
    }));
  };

  // Auto-select the first available variation to avoid empty state and duplicate selections elsewhwere
  useEffect(() => {
    if (selectedVariationId || !variations.length) return;
    const firstAvailable =
      variations.find((v) => checkVariantInStock(v)) || variations[0];
    handleVariantSelect(firstAvailable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariationId, variations]);

  // Wishlist handler
  const handleWishlist = async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');

      if (!token) {
        if (productUid) {
          storePendingPostLoginAction({
            type: POST_LOGIN_ACTIONS.WISHLIST_PRODUCT,
            productId: productUid,
          });
        }

        setLoginModalOpen(true);
        return;
      }
    }

    if (!productUid) return;

    const nextState = !optimisticIsWishlisted;
    setOptimisticIsWishlisted(nextState);

    try {
      await addToWishlistMutation.mutateAsync({
        productUid,
        add: nextState,
      });
      ToastNotification(
        'success',
        nextState
          ? 'Product added to wishlist.'
          : 'Product removed from wishlist.'
      );
    } catch (error) {
      setOptimisticIsWishlisted(!nextState);
      ToastNotification(
        'error',
        error?.message || 'Unable to update wishlist. Please try again.'
      );
    }
  };

  // Share handlers
  const productSlug = cloneVariation?.product?.slug || '';
  const productUrl = buildProductUrl(productSlug);
  const shareLinks = getShareLinks(productUrl, productName);

  const handleShare = async () => {
    const sharePayload = {
      title: productName,
      text: productName,
      url: productUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(sharePayload);
        return;
      } catch (error) {
        console.error('Share dialog dismissed or failed:', error);
        // setShowShareDropdown((prev) => !prev);
      }
    }
  };

  // console.log('RightSideModal', {
  //   cloneVariation,
  //   selectedVariationId,
  //   stockStatus,
  //   isInStock,
  //   sku,
  //   productName,
  //   keywords,
  //   rating,
  //   reviewCount,
  //   displaySalePrice,
  //   displayPrice,
  //   displayDiscount,
  //   selectedQuantity,
  //   selectedVariantLabel,
  // });

  return (
    <>
      {/* 1. SKU - Stock Status - Wishlist & Share */}
      <div className="variation-top-info">
        <div className="variation-sku-stock">
          <span>
            <strong>SKU:</strong> {sku || 'N/A'}
          </span>
          {isInStock && (
            <span className="variation-stock-badge in_stock-color">
              In Stock
            </span>
          )}
        </div>
        <div className="variation-action-buttons">
          <button
            className={`variation-icon-btn ${optimisticIsWishlisted ? 'wishlist-active' : ''}`}
            onClick={handleWishlist}
            disabled={addToWishlistMutation.isPending}
            title="Add to Wishlist"
          >
            {optimisticIsWishlisted ? (
              <RiHeartFill size={18} />
            ) : (
              <RiHeartLine size={18} />
            )}
          </button>
          <div className="variation-share-wrapper">
            <button
              className="variation-icon-btn"
              onClick={handleShare}
              title="Share"
            >
              <RiShareLine size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full Name of the Product */}
      <h4 className="title-name">{productName}</h4>

      {/* 3. Meta info - Weight/Unit and Stock Status with Rating */}
      <div className="meta-1">
        {/* <div className="">
          <h6 className="unit">
            {weight}{unit}
          </h6>
          <span
            className={`${!isInStock ? 'out_of_stock-color' : 'in_stock-color'}`}
          >
            {ModifyString(stockStatus, false, '_')}
          </span>
        </div> */}
        {keywords.length > 0 && (
          <div className="variation-keywords">
            {keywords.slice(0, 5).map((keyword, index) => (
              <span key={index} className="variation-keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        )}
        {rating > 0 && (
          <div className="">
            <div className="rating-section">
              <span className="stars">
                <RiStarFill size={14} />
              </span>
              <span className="review-count">
                <span className="count">{rating.toFixed(1)}</span>(
                {`${formatReviewCount(reviewCount)}`})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Price Row */}
      <div className="price-row">
        {isDoctorProduct ? (
          // CASE 1: Doctor Product
          isVerifiedDoctor ? (
            // Logged-in doctor -> Show both prices + GST + discount
            <>
              <div className="disc-price">
                {convertToRupees(displaySalePrice)}
                <div className="inclusive-taxes">(Inclusive of GST)</div>
              </div>
              <div className="selling-price">
                <span
                  style={{
                    fontSize: 13,
                    color: '#535E75',
                    lineHeight: 1,
                  }}
                >
                  M.R.P.
                </span>{' '}
                {convertToRupees(displayPrice)}
              </div>
              {displayDiscount && (
                <div className="percent-off">{displayDiscount}% Off</div>
              )}
            </>
          ) : (
            // Not a logged-in doctor -> Show ONLY MRP inside disc-price + GST
            <div className="disc-price">
              <span
                style={{
                  fontSize: 13,
                  color: '#535E75',
                  lineHeight: 1,
                }}
              >
                M.R.P.
              </span>{' '}
              {convertToRupees(displayPrice)}
              <div className="inclusive-taxes">(Inclusive of GST)</div>
            </div>
          )
        ) : (
          // CASE 2: Regular Product -> Always show both prices + GST + discount
          <>
            <div className="disc-price">
              {convertToRupees(displaySalePrice)}
              <div className="inclusive-taxes">(Inclusive of GST)</div>
            </div>

            {Number(displaySalePrice) !== Number(displayPrice) && (
              <>
                <div className="selling-price">
                  <span
                    style={{
                      fontSize: 13,
                      color: '#535E75',
                      lineHeight: 1,
                    }}
                  >
                    M.R.P.
                  </span>{' '}
                  {convertToRupees(displayPrice)}
                </div>

                {displayDiscount > 0 && (
                  <div className="percent-off">{displayDiscount}% Off</div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* 5. Keywords Related to Product/Category */}
      {/* {keywords.length > 0 && (
        <div className="variation-keywords">
          {keywords.slice(0, 5).map((keyword, index) => (
            <span key={index} className="variation-keyword-tag">
              {keyword}
            </span>
          ))}
        </div>
      )} */}

      {/* 6. Short Description */}
      <div className="product-detail">
        <TextLimit
          value={cloneVariation?.product?.short_description}
          maxLength={200}
          tag={'p'}
        />
      </div>

      {/* 7. Availability / Variants Section */}
      <div className="pickup-box">
        <div className="product-info">
          {/* Colors Selection */}
          <PdpColorSelector
            key={selectedVariationId || currentVariant?.uid || currentVariant?.id || 'default'}
            selectedVariant={currentVariant?.colors ? currentVariant : (cloneVariation?.product?.colors ? { ...currentVariant, colors: cloneVariation.product.colors } : currentVariant)}
            selectedColorUid={cloneVariation?.selectedColorUid}
            onSelectColor={(color) => {
              setCloneVariation((prev) => ({
                ...prev,
                selectedColorUid: color?.uid || null,
                selectedColor: color || null,
              }));
            }}
          />

          {variations.length > 0 && (
            <div className="">
              <span className="variation-availability-label property-title">
                <h4>Availability: Net Quantity</h4>
              </span>
            </div>
          )}

          {variations.length > 0 && (
            <div className="variation-radio-list commom-scrollbar hide-scrollbar">
              {variations.map((variation) => {
                const attrValues = variation?.attribute_values || [];
                const valueLabel = attrValues
                  .map((val) => val?.value)
                  .filter(Boolean)
                  .join(' / ');
                const label = variation?.name;

                // Pulling the specific keys you requested
                const mrp = variation?.mrp ?? variation?.price ?? 0;
                const disPrice = variation?.disPrice ?? variation?.sale_price ?? mrp;
                const discount =
                  variation?.discountPercent ??
                  variation?.discount ??
                  (mrp > 0 && disPrice < mrp ? Math.round(((mrp - disPrice) / mrp) * 100) : 0);

                const inStock = checkVariantInStock(variation);
                const variationId = getVariationId(variation);
                const isSelected =
                  String(selectedVariationId) === String(variationId);

                return (
                  <button
                    type="button"
                    key={variationId ?? valueLabel}
                    className={`variation-radio-card ${isSelected ? 'active' : ''} ${!inStock ? 'disabled' : ''}`}
                    onClick={() => inStock && handleVariantSelect(variation)}
                    disabled={!inStock}
                    aria-pressed={isSelected}
                  >
                    <div className="variation-radio-content">
                      <div className="variation-radio-pricing">
                        <span className="variation-price-strong" title={label}>
                          {label}
                        </span>
                        {inStock && (
                          <span className="variation-radio-stock in-stock">
                            In stock
                          </span>
                        )}
                      </div>

                      <div className="variation-radio-bottom price-row d-flex align-items-center gap-2 mt-1">
                        {isDoctorProduct ? (
                          // CASE 1: Doctor Product
                          isVerifiedDoctor ? (
                            <>
                              <>
                                <div className="disc-price">
                                  {convertToRupees(disPrice)}
                                </div>

                                {Number(mrp) !== Number(disPrice) && (
                                  <>
                                    <div className="selling-price">
                                      <span
                                        style={{
                                          fontSize: 13,
                                          color: '#535E75',
                                          lineHeight: 1,
                                        }}
                                      >
                                        M.R.P.
                                      </span>{' '}
                                      {convertToRupees(mrp)}
                                    </div>

                                    {discount > 0 && (
                                      <div className="percent-off">
                                        {discount}% Off
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            </>
                          ) : (
                            // Not a logged-in doctor -> Show ONLY MRP inside disc-price
                            <div className="disc-price">
                              <span
                                style={{
                                  fontSize: 13,
                                  color: '#535E75',
                                  lineHeight: 1,
                                }}
                              >
                                M.R.P.
                              </span>{' '}
                              {convertToRupees(mrp)}
                            </div>
                          )
                        ) : (
                          // CASE 2: Regular Product -> Always show both prices + discount
                          <>
                            <div className="disc-price">
                              {convertToRupees(disPrice)}
                            </div>

                            {Number(mrp) !== Number(disPrice) && (
                              <>
                                <div className="selling-price">
                                  <span
                                    style={{
                                      fontSize: 13,
                                      color: '#535E75',
                                      lineHeight: 1,
                                    }}
                                  >
                                    M.R.P.
                                  </span>{' '}
                                  {convertToRupees(mrp)}
                                </div>

                                {discount > 0 && (
                                  <div className="percent-off">
                                    {discount}% Off
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {superCoins > 0 && (
        <div className="variation-coin-inline">
          <span className="variation-coin-inline__text">
            Earn <RiCopperCoinLine className="variation-coin-inline__icon" />{' '}
            {superCoins} SDL Points
          </span>
        </div>
      )}

      {/* 8. Full product page link for more details */}
      <div className="variation-more-details">
        <a
          href={
            selectedVariantLabel
              ? `/products/${productSlug}?productVariant=${encodeURIComponent(selectedVariantLabel.replace(/\s+/g, '-'))}`
              : `/products/${productSlug}`
          }
          // target="_blank"
          rel="noopener noreferrer"
          className="variation-more-details-link"
        >
          View full product details
        </a>
      </div>
      <OtpLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setOpen={setLoginModalOpen}
      // redirectUrl="/wishlist"
      />
    </>
  );
};

export default RightVariationModal;
