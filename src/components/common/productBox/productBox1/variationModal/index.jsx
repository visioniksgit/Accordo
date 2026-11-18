import { useContext, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import ResponsiveModal from '@/components/common/ResponsiveModal';
import LeftSideModal from './LeftSideModal';
import RightVariationModal from './RightSideModal';
import VariationBuyNow from './VariationBuyNow';
import ProductAttribute from '@/components/productDetails/common/productAttribute/ProductAttribute';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import {
  useAddToCart,
  useCartQuery,
  useRemoveFromCart,
} from '@/utils/hooks/useCart';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import { trackMetaEvent } from '@/utils/metaPixel';
import { useProductModal } from '@/utils/hooks/useProduct';

const getSelectedVariationId = (variation) =>
  variation?.uid ??
  variation?.id ??
  variation?.variation_id ??
  variation?.variationId ??
  null;

const getProductId = (product) =>
  product?.uid ?? product?.id ?? product?.product_id ?? null;

const isInStock = (item) => {
  const parsedQuantity = Number(item?.stockQty ?? item?.quantity);
  const hasStockQuantity =
    Number.isFinite(parsedQuantity) && parsedQuantity >= 1;

  return (
    item?.stock_status === 'in_stock' ||
    item?.inStockFlag === true ||
    hasStockQuantity
  );
};

const getAvailableQuantity = (...items) => {
  for (const item of items) {
    const rawQuantity =
      item?.variation?.quantity ??
      item?.selectedVariation?.quantity ??
      item?.product?.quantity ??
      item?.quantity;
    const parsedQuantity = Number(rawQuantity);

    if (Number.isFinite(parsedQuantity)) {
      return Math.max(0, parsedQuantity);
    }
  }

  return null;
};

const showStockLimitToast = (availableQuantity) => {
  if (availableQuantity === 0) {
    ToastNotification('error', 'This item is out of stock.');
    return;
  }

  ToastNotification(
    'error',
    `Only ${availableQuantity} item${availableQuantity === 1 ? '' : 's'} available.`
  );
};

const VariationModal = ({
  productObj,
  variationModal,
  setVariationModal,
  shouldShowPricing,
  displayPrices,
  isDoctorProduct,
  isVerifiedDoctor,
}) => {
  const { setCartCanvas } = useContext(ThemeOptionContext);
  const { data: cartData, isFetching: isCartFetching } = useCartQuery();
  const cartProducts = cartData?.items ?? [];
  const [pendingAction, setPendingAction] = useState(null);
  const [cloneVariation, setCloneVariation] = useState({
    product: productObj,
    attributeValues: [],
    productQty: 1,
    selectedVariation: '',
    variantIds: [],
  });

  useEffect(() => {
    setCloneVariation((prev) => ({
      ...prev,
      product: productObj,
    }));
  }, [productObj]);

  // useEffect(() => {
  //   console.log(cloneVariation);
  // }, [productObj])

  const productUid = getProductId(cloneVariation?.product ?? productObj);
  const isModalOpen = Boolean(
    productObj?.uid && (productObj?.uid === variationModal || productObj?.id === variationModal)
  );
  const { data: modalData } = useProductModal(isModalOpen ? productUid : null);

  useEffect(() => {
    const modalProduct = modalData?.data?.product;
    if (!modalProduct) return;

    setCloneVariation((prev) => {
      const enrichedVariants =
        Array.isArray(modalProduct.productVariants) && modalProduct.productVariants.length > 0
          ? modalProduct.productVariants
          : Array.isArray(modalProduct.variations) && modalProduct.variations.length > 0
          ? modalProduct.variations
          : [];

      const currentSelectedId = getSelectedVariationId(prev.selectedVariation);

      const matchedVariant = currentSelectedId
        ? enrichedVariants.find(
            (v) => (v.uid ?? v.id ?? v.variation_id) === currentSelectedId
          )
        : null;

      const nextSelected =
        matchedVariant ||
        (enrichedVariants.length > 0
          ? enrichedVariants.find((v) => v.inStockFlag || v.stock_status === 'in_stock') ||
            enrichedVariants[0]
          : prev.selectedVariation);

      const defaultColor =
        Array.isArray(nextSelected?.colors) && nextSelected.colors.length > 0
          ? nextSelected.colors[0]
          : null;

      return {
        ...prev,
        product: {
          ...prev.product,
          ...modalProduct,
          productVariants: modalProduct.productVariants ?? prev.product?.productVariants,
        },
        selectedVariation: nextSelected,
        selectedColorUid: prev.selectedColorUid || defaultColor?.uid || null,
        selectedColor: prev.selectedColor || defaultColor || null,
      };
    });
  }, [modalData]);

  const selectedVariationId = getSelectedVariationId(
    cloneVariation?.selectedVariation
  );
  const departmentName = productObj?.department?.name;
  const isBook = departmentName === 'Books';

  const selectedCartItem = useMemo(() => {
    const byProduct = (item) => String(item?.product_id) === String(productUid);

    if (!productUid) {
      return null;
    }

    const activeColorUid =
      cloneVariation?.selectedColorUid ||
      cloneVariation?.selectedColor?.uid ||
      cloneVariation?.selectedVariation?.colors?.[0]?.uid ||
      null;

    const matchesColor = (item) => {
      if (!activeColorUid) return true;
      const itemColor = item?.color_id ?? item?.colorUid ?? null;
      return !itemColor || String(itemColor) === String(activeColorUid);
    };

    if (!selectedVariationId) {
      return (
        cartProducts.find(
          (item) => byProduct(item) && !item?.variation_id && matchesColor(item)
        ) ?? null
      );
    }

    return (
      cartProducts.find(
        (item) =>
          byProduct(item) &&
          String(item?.variation_id) === String(selectedVariationId) &&
          matchesColor(item)
      ) ?? null
    );
  }, [
    cartProducts,
    productUid,
    selectedVariationId,
    cloneVariation?.selectedColorUid,
    cloneVariation?.selectedColor?.uid,
    cloneVariation?.selectedVariation?.colors,
  ]);

  const productQty = selectedCartItem?.quantity ?? 0;
  const maxAvailableQty = getAvailableQuantity(
    selectedCartItem,
    cloneVariation?.selectedVariation,
    cloneVariation?.product,
    productObj
  );
  const isOpen = productQty > 0;
  const hasReachedStockLimit =
    maxAvailableQty !== null && productQty >= maxAvailableQty;
  const productInStock = cloneVariation?.selectedVariation
    ? isInStock(cloneVariation?.selectedVariation)
    : isInStock(cloneVariation?.product) || isInStock(productObj);

  const addToCartMutation = useAddToCart({
    onSuccess: (response) => {
      // console.log({
      //   response,
      //   cloneVariation,
      //   productObj,
      // })
      // ToastNotification('success', response?.message || 'Item added to cart');
      const addedQty = Number(cloneVariation.productQty) || 1;
      const unitPrice = Number(
        cloneVariation?.selectedVariation?.sale_price ??
        cloneVariation?.selectedVariation?.disPrice ??
        cloneVariation?.selectedVariation?.mrp ??
        productObj?.disPrice ??
        productObj?.mrp ??
        0
      );
      const targetId =
        selectedVariationId ||
        cloneVariation?.selectedVariation?.skuCode ||
        cloneVariation?.selectedVariation?.uid ||
        productUid;

      trackMetaEvent('AddToCart', {
        content_ids: [String(targetId)].filter(Boolean),
        content_type: 'product',
        content_name:
          productObj?.product?.name ||
          productObj?.name ||
          '',
        content_category: departmentName || productObj?.category?.name || undefined,
        value: unitPrice * addedQty,
        currency: 'INR',
        num_items: addedQty,
        contents: [
          {
            id: String(targetId),
            quantity: addedQty,
            item_price: unitPrice,
          },
        ],
      });
    },
    onError: (error) => {
      console.log(error);
      ToastNotification(
        'error',
        error?.message || 'Failed to add item to cart'
      );
    },
  });

  const removeFromCartMutation = useRemoveFromCart({
    onSuccess: (response) => {
      ToastNotification(
        'success',
        response?.message || 'Item quantity decreased'
      );
    },
    onError: (error) => {
      ToastNotification('error', error?.message || 'Failed to update cart');
    },
  });

  useEffect(() => {
    if (
      pendingAction &&
      !addToCartMutation.isPending &&
      !removeFromCartMutation.isPending &&
      !isCartFetching
    ) {
      setPendingAction(null);
    }
  }, [
    pendingAction,
    addToCartMutation.isPending,
    removeFromCartMutation.isPending,
    isCartFetching,
  ]);

  const isMutationPending =
    addToCartMutation.isPending || removeFromCartMutation.isPending;
  const isActionLocked = pendingAction !== null || isMutationPending;
  const isActionLoading = (action) =>
    pendingAction === action && (isMutationPending || isCartFetching);

  const openCartOnDesktop = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setCartCanvas(true);
    }
  };

  const handleAddToCart = () => {
    if (!productInStock || !productUid || isActionLocked) {
      return;
    }
    const requestedQuantity = Math.max(
      1,
      Number(cloneVariation?.productQty || 1)
    );

    if (maxAvailableQty !== null && requestedQuantity > maxAvailableQty) {
      showStockLimitToast(maxAvailableQty);
      setCloneVariation((prev) => ({
        ...prev,
        productQty: Math.max(1, maxAvailableQty),
      }));
      return;
    }

    const activeColorUid =
      cloneVariation?.selectedColorUid ||
      cloneVariation?.selectedColor?.uid ||
      cloneVariation?.selectedVariation?.colors?.[0]?.uid ||
      null;

    setPendingAction('add');
    addToCartMutation.mutate(
      {
        productUid,
        variantUid: selectedVariationId,
        ...(activeColorUid ? { colorUid: activeColorUid } : {}),
        count: requestedQuantity,
      },
      {
        onSuccess: () => {
          openCartOnDesktop();
        },
      }
    );
  };

  const handleIncrease = () => {
    if (!selectedCartItem || isActionLocked) {
      return;
    }

    if (hasReachedStockLimit) {
      showStockLimitToast(maxAvailableQty);
      return;
    }

    const activeColorUid =
      selectedCartItem.color_id ??
      selectedCartItem.colorUid ??
      cloneVariation?.selectedColorUid ??
      cloneVariation?.selectedColor?.uid ??
      null;

    setPendingAction('inc');
    addToCartMutation.mutate({
      productUid: selectedCartItem.product_id,
      variantUid: selectedCartItem.variation_id ?? null,
      ...(activeColorUid ? { colorUid: activeColorUid } : {}),
    });
  };

  const handleDecrease = () => {
    if (!selectedCartItem || isActionLocked) {
      return;
    }

    const activeColorUid =
      selectedCartItem.color_id ??
      selectedCartItem.colorUid ??
      cloneVariation?.selectedColorUid ??
      cloneVariation?.selectedColor?.uid ??
      null;

    setPendingAction('dec');
    removeFromCartMutation.mutate({
      productUid: selectedCartItem.product_id,
      variantUid: selectedCartItem.variation_id ?? null,
      ...(activeColorUid ? { colorUid: activeColorUid } : {}),
    });
  };

  return (
    <ResponsiveModal
      modal={productObj?.uid === variationModal}
      setModal={setVariationModal}
      mobileBreakpoint={992}
      classes={{
        modalClass: 'view-modal modal-lg theme-modal',
        modalHeaderClass: 'p-0',
        offcanvasClass: 'variation-offcanvas',
        title: '',
      }}
    >
      <div className="variation-modal-content" data-lenis-prevent>
        <div className="variation-modal-body">
          <Row className="m-0">
            <LeftSideModal
              cloneVariation={cloneVariation}
              productObj={productObj}
            />
            <Col lg="6">
              <div className="right-sidebar-modal">
                <div className="right-sidebar-scroll hide-scrollbar">
                  <RightVariationModal
                    cloneVariation={cloneVariation}
                    setCloneVariation={setCloneVariation}
                    shouldShowPricing={shouldShowPricing}
                    displayPrices={displayPrices}
                    isDoctorProduct={isDoctorProduct}
                    isVerifiedDoctor={isVerifiedDoctor}
                  />
                  {cloneVariation?.product &&
                    productObj?.uid == variationModal &&
                    !(cloneVariation?.product?.variations?.length > 0) && (
                      <ProductAttribute
                        productState={cloneVariation}
                        setProductState={setCloneVariation}
                      />
                    )}
                </div>
                <div className="modal-bottom-cart d-none d-lg-block">
                  <div className="dual-cart-buttons">
                    {/* <VariationBuyNow
                      cloneVariation={cloneVariation}
                      setVariationModal={setVariationModal}
                    /> */}
                    {!isBook && isOpen ? (
                      <div className="qty-inline-box">
                        <button
                          type="button"
                          className="qty-btn qty-minus"
                          onClick={handleDecrease}
                          disabled={isActionLocked}
                        >
                          {isActionLoading('dec') ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              aria-hidden="true"
                            />
                          ) : (
                            <RiSubtractLine />
                          )}
                        </button>
                        <span className="qty-value">{productQty}</span>
                        <button
                          type="button"
                          className="qty-btn qty-plus"
                          onClick={handleIncrease}
                          disabled={isActionLocked}
                        >
                          {isActionLoading('inc') ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              aria-hidden="true"
                            />
                          ) : (
                            <RiAddLine />
                          )}
                        </button>
                      </div>
                    ) : (
                      !isBook && (
                        <button
                          className="btn-add-cart addcart-button"
                          onClick={handleAddToCart}
                          disabled={!productInStock || isActionLocked}
                        >
                          {isActionLoading('add') ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                aria-hidden="true"
                              />
                              <span className="label-full">Adding...</span>
                              <span className="label-short">...</span>
                            </>
                          ) : (
                            <>
                              <span className="label-full">Add To Cart</span>
                              <span className="label-short">Add</span>
                            </>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="variation-modal-footer d-lg-none">
          <div className="dual-cart-buttons">
            {/* <VariationBuyNow
              cloneVariation={cloneVariation}
              setVariationModal={setVariationModal}
            /> */}
            {!isBook && isOpen ? (
              <div className="qty-inline-box">
                <button
                  type="button"
                  className="qty-btn qty-minus"
                  onClick={handleDecrease}
                  disabled={isActionLocked}
                >
                  {isActionLoading('dec') ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    />
                  ) : (
                    <RiSubtractLine />
                  )}
                </button>
                <span className="qty-value">{productQty}</span>
                <button
                  type="button"
                  className="qty-btn qty-plus"
                  onClick={handleIncrease}
                  disabled={isActionLocked}
                >
                  {isActionLoading('inc') ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    />
                  ) : (
                    <RiAddLine />
                  )}
                </button>
              </div>
            ) : (
              !isBook && (
                <button
                  className="btn-add-cart addcart-button"
                  onClick={handleAddToCart}
                  disabled={!productInStock || isActionLocked}
                >
                  {isActionLoading('add') ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      <span className="label-full">Adding...</span>
                      <span className="label-short">...</span>
                    </>
                  ) : (
                    <>
                      <span className="label-full">Add To Cart</span>
                      <span className="label-short">Add</span>
                    </>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default VariationModal;
