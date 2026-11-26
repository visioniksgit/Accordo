'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { RiArrowDownSLine, RiMapPin2Line } from 'react-icons/ri';
import HeaderLocationModal from './HeaderLocationModal';
import UserContext from '@/helper/userContext';
import { useCustomerAddresses } from '@/utils/hooks/useCustomerAddress';
import { formatAddress } from '@/utils/helpers';

const HeaderLocation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('prompt');
  const triggerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_delivery_location') || '';
    }
    return '';
  });

  const { isAuthenticated } = useContext(UserContext);
  const { data: addressesData, isLoading: addressesLoading } =
    useCustomerAddresses({
      enabled: Boolean(isAuthenticated),
    });

  const savedShippingAddresses = useMemo(() => {
    if (!isAuthenticated) return [];
    const addresses = Array.isArray(addressesData?.data?.addresses)
      ? addressesData.data.addresses
      : [];
    return addresses.filter(
      (item) => item?.type?.toLowerCase() === 'shipping'
    );
  }, [addressesData?.data?.addresses, isAuthenticated]);

  // If logged in and no location is saved yet, default to the first saved shipping address
  useEffect(() => {
    if (
      !selectedLocation &&
      isAuthenticated &&
      savedShippingAddresses.length > 0
    ) {
      const firstAddress =
        savedShippingAddresses.find((item) => item?.defaultFlag) ||
        savedShippingAddresses[0];
      const formatted = formatAddress(firstAddress);
      if (formatted) {
        setSelectedLocation(formatted);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_delivery_location', formatted);
          if (firstAddress?.pincode) {
            localStorage.setItem(
              'user_delivery_pincode',
              String(firstAddress.pincode)
            );
          }
        }
        setIsModalOpen(false);
      }
    }
  }, [selectedLocation, isAuthenticated, savedShippingAddresses]);

  // Auto-open prompt modal on visit when no location is selected
  useEffect(() => {
    if (selectedLocation) return;
    if (isAuthenticated && addressesLoading) return;
    if (isAuthenticated && savedShippingAddresses.length > 0) return;

    const timer = setTimeout(() => {
      setModalView('prompt');
      setIsModalOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    selectedLocation,
    isAuthenticated,
    addressesLoading,
    savedShippingAddresses.length,
  ]);

  const handleSelectLocation = (loc, pincode) => {
    setSelectedLocation(loc);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_delivery_location', loc);
      if (pincode) {
        localStorage.setItem('user_delivery_pincode', pincode);
      }
    }
    setIsModalOpen(false);
  };

  const displayText = selectedLocation || 'Select Location';

  return (
    <div className="header-location-wrapper">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        className={`header-location-trigger ${isModalOpen ? 'is-active' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-label="Select delivery location"
        onClick={() => {
          setModalView('manual');
          setIsModalOpen(true);
        }}
      >
        <span className="header-location-pin-icon">
          <RiMapPin2Line />
        </span>
        <span className="header-location-text">
          <span className="header-location-label">Deliver To</span>
          <span className="header-location-value-row">
            <span className="header-location-value" title={displayText}>
              {displayText}
            </span>
            <RiArrowDownSLine
              className="header-location-chevron"
              aria-hidden="true"
            />
          </span>
        </span>
      </button>

      {/* Location Modal */}
      <HeaderLocationModal
        modal={isModalOpen}
        setModal={setIsModalOpen}
        triggerRef={triggerRef}
        onSelectLocation={handleSelectLocation}
        initialView={modalView}
        canClose={Boolean(selectedLocation)}
        savedShippingAddresses={savedShippingAddresses}
      />
    </div>
  );
};

export default HeaderLocation;
