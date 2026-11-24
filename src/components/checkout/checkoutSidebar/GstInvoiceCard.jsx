'use client';

import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import {
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiEditLine,
  RiFileTextLine,
  RiDeleteBinLine,
} from 'react-icons/ri';
import UserContext from '@/helper/userContext';
import {
  useCustomerAddresses,
  useDeleteCustomerAddress,
} from '@/utils/hooks/useCustomerAddress';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import { ToastNotification } from '@/utils/customFunctions/ToastNotification';
import styles from './GstInvoiceCard.module.scss';
import { capitalizeWords } from '@/utils/customFunctions/Capitalize';
import { formatAddress } from '@/utils/helpers';

const GstInvoiceCard = ({
  onClick,
  isBillingSelected = false,
  onBillingSelectionChange,
  onBillingAddressChange,
  onEditAddress,
}) => {
  const { isAuthenticated } = useContext(UserContext);
  const { data } = useCustomerAddresses({ enabled: isAuthenticated });
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const billingAddresses = useMemo(() => {
    const addresses = Array.isArray(data?.data?.addresses)
      ? data.data.addresses
      : [];

    return addresses.filter((address) => address?.type === 'billing');
  }, [data?.data?.addresses]);

  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteAddress, isPending: isDeletingAddress } =
    useDeleteCustomerAddress({
      onSuccess: (res) => {
        setIsDeleteModalOpen(false);
        setAddressToDelete(null);
        ToastNotification(
          'success',
          res?.message || 'Billing address deleted successfully.'
        );
      },
      onError: (error) => {
        ToastNotification(
          'error',
          error?.message || 'Failed to delete billing address.'
        );
      },
    });

  const handleConfirmDelete = () => {
    const idToDelete = addressToDelete?.uid || addressToDelete?.id;
    if (!idToDelete) return;
    deleteAddress(idToDelete);
  };

  // Sync selected billing address with list
  useEffect(() => {
    if (!billingAddresses || billingAddresses.length === 0) {
      setSelectedBillingAddress(null);
      return;
    }

    // Retain currently selected address if it still exists
    const exists = billingAddresses.find(
      (a) =>
        (a.uid || a.id) ===
        (selectedBillingAddress?.uid || selectedBillingAddress?.id)
    );

    if (exists) {
      if (selectedBillingAddress !== exists) {
        setSelectedBillingAddress(exists);
      }
    } else {
      const defaultBilling =
        billingAddresses.find((a) => a.defaultFlag === true) ||
        billingAddresses[0];
      setSelectedBillingAddress(defaultBilling);
    }
  }, [billingAddresses, selectedBillingAddress]);

  const selectedBillingAddressUid =
    selectedBillingAddress?.uid ||
    selectedBillingAddress?.id ||
    selectedBillingAddress?.userId ||
    '';

  // Notify parent component whenever the billing address UID changes
  useEffect(() => {
    onBillingAddressChange?.(selectedBillingAddressUid);
  }, [selectedBillingAddressUid, onBillingAddressChange]);

  /**
   * Auto-select checkbox by default when:
   * 1. A billing address is loaded for the first time.
   * 2. The user modifies/updates an existing billing address.
   */
  useEffect(() => {
    if (billingAddresses.length > 0) {
      onBillingSelectionChange?.(true);
    } else {
      onBillingSelectionChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingAddresses.length]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddressDropdown(false);
      }
    };

    if (showAddressDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressDropdown]);

  if (!isAuthenticated) {
    return null;
  }

  const handleActivate = () => {
    if (onClick) onClick();
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    if (onEditAddress) {
      onEditAddress(selectedBillingAddress);
    } else if (onClick) {
      onClick();
    }
  };

  const handleBillingToggle = (event) => {
    event.stopPropagation();
    onBillingSelectionChange?.(event.target.checked);
  };

  const handleSelectAddress = (address) => {
    setSelectedBillingAddress(address);
    setShowAddressDropdown(false);
    onBillingAddressChange?.(address.uid || address.id || '');
    if (!isBillingSelected) {
      onBillingSelectionChange?.(true);
    }
  };

  const handleAddNewAddress = (event) => {
    event.stopPropagation();
    setShowAddressDropdown(false);
    handleActivate();
  };

  const billingName =
    selectedBillingAddress?.companyName ||
    `${capitalizeWords(selectedBillingAddress?.firstName || '')} ${capitalizeWords(selectedBillingAddress?.lastName || '')}`.trim() ||
    'Billing Address';
  const billingGstNumber = selectedBillingAddress?.gstNo || '';

  // State 1: No billing addresses saved yet
  if (billingAddresses.length === 0) {
    return (
      <div
        className={styles.gstCard}
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleActivate();
          }
        }}
      >
        <div className={styles.leftContent}>
          <div className={styles.iconBox}>
            <RiFileTextLine className={styles.icon} />
          </div>

          <div className={styles.textContent}>
            <span className={styles.title}>Get GST Invoice</span>
            <span className={styles.subtitle}>
              Claim up to 5% with the GST Invoice
            </span>
          </div>
        </div>

        <RiArrowRightSLine className={styles.arrow} />
      </div>
    );
  }

  // State 2: One or more billing addresses saved
  return (
    <div className={styles.gstCardContainer} ref={dropdownRef}>
      <div
        className={`${styles.gstCard} ${styles.gstCardSaved} ${isBillingSelected ? styles.selected : ''}`}
      >
        <div className={styles.leftContent}>
          <label
            className={styles.checkboxBox}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isBillingSelected}
              onChange={handleBillingToggle}
              aria-label="Use billing address for GST invoice"
            />
          </label>

          <div
            className={styles.textContent}
            onClick={() => setShowAddressDropdown((prev) => !prev)}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer', flex: 1 }}
          >
            <div className={styles.metaRow}>
              <span className={styles.meta}>Get GST Invoice</span>
              <RiArrowDownSLine
                className={`${styles.dropdownIcon} ${showAddressDropdown ? styles.open : ''}`}
              />
            </div>

            <span className={styles.title}>{billingName}</span>

            {billingGstNumber ? (
              <span className={styles.gstNumber}>
                GSTIN: {billingGstNumber}
              </span>
            ) : null}

            {selectedBillingAddress && (
              <span className={styles.locationAddress}>
                {formatAddress(selectedBillingAddress)}
              </span>
            )}
          </div>
        </div>

        <div className={styles.actionsBox}>
          <button
            type="button"
            className={styles.editButton}
            onClick={handleEditClick}
            aria-label="Edit GST invoice details"
            title="Edit GST details"
          >
            <RiEditLine className={styles.editIcon} />
          </button>
        </div>
      </div>

      {/* Billing Address Selection Dropdown */}
      {showAddressDropdown && (
        <div className={styles.addressDropdown} data-lenis-prevent>
          {billingAddresses.map((address) => {
            const isSelected =
              (selectedBillingAddress?.uid || selectedBillingAddress?.id) ===
              (address.uid || address.id);
            const addrName =
              address.companyName ||
              `${capitalizeWords(address.firstName || '')} ${capitalizeWords(address.lastName || '')}`.trim() ||
              'Billing Address';

            return (
              <div
                key={address.uid || address.id}
                className={`${styles.addressOption} ${isSelected ? styles.active : ''}`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className={styles.addressOptionHeader}>
                  <div className={styles.addressOptionTitle}>{addrName}</div>
                  <button
                    type="button"
                    className={styles.deleteOptionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddressToDelete(address);
                      setIsDeleteModalOpen(true);
                    }}
                    title="Delete billing address"
                    aria-label="Delete billing address"
                    disabled={isDeletingAddress}
                  >
                    <RiDeleteBinLine className={styles.deleteIcon} />
                  </button>
                </div>

                <div className={styles.addressOptionDetails}>
                  {(address.firstName || address.lastName) && (
                    <span>
                      {capitalizeWords(address.firstName)}{' '}
                      {capitalizeWords(address.lastName)}{' '}
                    </span>
                  )}
                  {address.phone && (
                    <>
                      <span style={{ color: '#D4DEF3' }}>|</span>{' '}
                      <span
                        style={{
                          color: '#535E75',
                          fontWeight: '400',
                          fontSize: '13px',
                        }}
                      >
                        {address.countryCode || '+91'} {address.phone}
                      </span>
                    </>
                  )}
                  {address.gstNo && (
                    <>
                      <br />
                      <span
                        style={{
                          color: '#535E75',
                          fontWeight: '400',
                          fontSize: '13px',
                        }}
                      >
                        GSTIN: {address.gstNo}
                      </span>
                    </>
                  )}
                  <br />
                  <span>{formatAddress(address)}</span>
                </div>
              </div>
            );
          })}

          <div className={styles.addNew} onClick={handleAddNewAddress}>
            + Add New Address
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        modal={isDeleteModalOpen}
        setModal={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setAddressToDelete(null);
        }}
        confirmFunction={handleConfirmDelete}
        setDeleteId={() => setAddressToDelete(null)}
      />
    </div>
  );
};

export default GstInvoiceCard;
