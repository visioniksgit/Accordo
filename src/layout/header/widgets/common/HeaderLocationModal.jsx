'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import {
  RiMapPin2Line,
  RiMapPinLine,
  RiCloseLine,
  RiSearchLine,
  RiFocus3Line,
  RiLoader4Line,
  RiErrorWarningLine,
} from 'react-icons/ri';
import { useGooglePlacesPredictions } from '../../../../utils/hooks/useGooglePlacesPredictions';
import { GoogleMapsProvider } from '../../../../helper/mapsContext/googleMapsProvider';
import {
  formatAddress,
  useGoogleMapsStatus,
  MapsStatus,
  parseGooglePlace,
} from '../../../../utils/helpers';
import useDebounce from '../../../../utils/hooks/useDebounce';
import {
  extractPincodeFromText,
  isPincodeServiceable,
  reverseGeocodeWithPincode,
} from '../../../../utils/locationServiceability';

// ─────────────────────────────────────────────────────────────
// Inner modal (needs GoogleMapsProvider above it in tree)
// ─────────────────────────────────────────────────────────────
const HeaderLocationModalInner = ({
  modal,
  setModal,
  triggerRef,
  onSelectLocation,
  initialView = 'prompt',
  canClose = true,
  savedShippingAddresses = [],
}) => {
  const [view, setView] = useState(initialView); // 'prompt' | 'manual'
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogStyle, setDialogStyle] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [notServiceableMsg, setNotServiceableMsg] = useState('');
  const [checkingPlaceId, setCheckingPlaceId] = useState(null);
  const searchInputRef = useRef(null);

  // Debounce search so we don't fire on every keystroke
  const debouncedQuery = useDebounce(searchQuery.trim(), 500);

  // Only call the hook when Maps SDK is ready
  const mapsStatus = useGoogleMapsStatus();
  const mapsReady = mapsStatus === MapsStatus.READY;

  const { results: predictions, loading: placesLoading } =
    useGooglePlacesPredictions(mapsReady ? debouncedQuery : '', 'in');

  // ── Sync view on open & reset state on close ──
  useEffect(() => {
    if (modal) {
      setView(initialView);
    } else {
      const t = setTimeout(() => {
        setView(initialView);
        setSearchQuery('');
        setGpsError('');
        setGpsLoading(false);
        setNotServiceableMsg('');
        setCheckingPlaceId(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [modal, initialView]);

  // Auto-focus search input when manual view opens
  useEffect(() => {
    if (view === 'manual' && modal) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [view, modal]);

  // ── Position the prompt popover below the header trigger ──
  const calculatePosition = useCallback(() => {
    if (triggerRef?.current && typeof window !== 'undefined') {
      const rect = triggerRef.current.getBoundingClientRect();
      const isRtl = document.dir === 'rtl' || document.documentElement.dir === 'rtl';
      const modalWidth = 400;

      if (window.innerWidth > 576) {
        const top = rect.bottom + 12;
        if (isRtl) {
          const right = Math.max(16, window.innerWidth - rect.right);
          return { position: 'absolute', top: `${top}px`, right: `${right}px`, left: 'auto', margin: 0 };
        } else {
          let left = rect.left;
          if (left + modalWidth > window.innerWidth - 16) {
            left = Math.max(16, window.innerWidth - modalWidth - 16);
          }
          return { position: 'absolute', top: `${top}px`, left: `${left}px`, right: 'auto', margin: 0 };
        }
      }
      return { margin: '1rem auto' };
    }
    return {};
  }, [triggerRef]);

  useEffect(() => {
    if (!modal || view !== 'prompt') return;
    const update = () => setDialogStyle(calculatePosition());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [modal, view, calculatePosition]);

  // ── Validate pincode before saving & closing ──
  const validateAndSelect = ({ address, pincode }) => {
    if (!pincode) {
      setNotServiceableMsg(
        'Could not detect a pincode for this location. Please pick a more specific street or area.'
      );
      return false;
    }

    if (!isPincodeServiceable(pincode)) {
      setNotServiceableMsg(
        `Not Serviceable: We don't deliver to pincode ${pincode} yet. Accordo currently serves only Navi Mumbai.`
      );
      return false;
    }

    setNotServiceableMsg('');
    onSelectLocation?.(address, pincode);
    setModal(false);
    return true;
  };

  // ── GPS handler ──
  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    setNotServiceableMsg('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const { address, pincode } = await reverseGeocodeWithPincode(
            latitude,
            longitude
          );
          validateAndSelect({ address, pincode });
        } catch {
          setGpsError('Unable to fetch address for your current location. Please search manually.');
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        const messages = {
          1: 'Location permission denied. Please allow access in your browser settings.',
          2: 'Location unavailable. Try again or search manually.',
          3: 'Location request timed out. Try again.',
        };
        setGpsError(messages[err.code] || 'Unable to get your location.');
      },
      { timeout: 10000 }
    );
  };

  // ── Select a Places prediction & verify its pincode ──
  const handleSelectPrediction = (prediction) => {
    if (checkingPlaceId) return;
    setNotServiceableMsg('');
    setGpsError('');

    const fallbackAddress = prediction.description;

    if (!window.google?.maps?.places) {
      const pincode = extractPincodeFromText(fallbackAddress);
      validateAndSelect({ address: fallbackAddress, pincode });
      return;
    }

    setCheckingPlaceId(prediction.place_id);
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    service.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['address_components', 'formatted_address', 'geometry'],
      },
      async (place, status) => {
        try {
          let pincode = '';
          let address = fallbackAddress;

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            const parsed = parseGooglePlace(place);
            address = place.formatted_address || fallbackAddress;
            pincode = parsed.pincode || extractPincodeFromText(address);

            // If Google Places didn't include a postal_code (e.g., broad locality),
            // reverse-geocode its coordinates to resolve the pincode.
            if (!pincode && place.geometry?.location) {
              try {
                const geo = await reverseGeocodeWithPincode(
                  place.geometry.location.lat(),
                  place.geometry.location.lng()
                );
                pincode = geo.pincode;
              } catch {
                // Keep pincode empty; validateAndSelect will inform the user
              }
            }
          } else {
            pincode = extractPincodeFromText(fallbackAddress);
          }

          validateAndSelect({ address, pincode });
        } finally {
          setCheckingPlaceId(null);
        }
      }
    );
  };

  const isManualView = view === 'manual';
  const hasQuery = searchQuery.trim().length > 0;
  // Show results only once debounced query has arrived
  const showResults = debouncedQuery.length > 0;

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        if (canClose) setModal((p) => !p);
      }}
      backdrop={canClose ? true : 'static'}
      keyboard={canClose}
      centered={isManualView}
      className={`theme-modal header-location-modal ${
        isManualView ? 'header-location-modal--manual' : 'header-location-modal--prompt'
      }`}
      style={isManualView ? {} : dialogStyle}
    >
      <ModalBody
        className={`header-location-modal__body ${
          isManualView ? 'header-location-modal__body--manual' : ''
        }`}
      >
        {/* ─── VIEW 1: Initial Prompt Popover ─── */}
        {!isManualView ? (
          <>
            {canClose && (
              <button
                type="button"
                className="header-location-modal__close"
                aria-label="Close location modal"
                onClick={() => setModal(false)}
              >
                <RiCloseLine />
              </button>
            )}

            <div className="header-location-modal__content">
              <div className="header-location-modal__icon-wrap">
                <RiMapPin2Line className="header-location-modal__pin" />
              </div>
              <p className="header-location-modal__message">
                To deliver as quickly as possible, we would like your current location
              </p>
            </div>

            {gpsError && (
              <p className="header-location-modal__gps-error">{gpsError}</p>
            )}

            {notServiceableMsg && (
              <div className="location-not-serviceable" role="alert">
                <RiErrorWarningLine className="location-not-serviceable__icon" />
                <span>{notServiceableMsg}</span>
              </div>
            )}

            <div className="header-location-modal__actions">
              <button
                type="button"
                className="header-location-modal__btn header-location-modal__btn--outline"
                onClick={() => {
                  setNotServiceableMsg('');
                  setGpsError('');
                  setView('manual');
                }}
              >
                Type Manually
              </button>
              <button
                type="button"
                className="header-location-modal__btn header-location-modal__btn--primary"
                onClick={handleGps}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <><RiLoader4Line className="spin-icon" /> Locating…</>
                ) : (
                  'Use Current Location'
                )}
              </button>
            </div>
          </>
        ) : (
          /* ─── VIEW 2: Manual Search Modal ─── */
          <div className="location-manual-view">
            {/* Header */}
            <div className="location-manual-view__header">
              <h4 className="location-manual-view__title">YOUR LOCATION</h4>
              {canClose && (
                <button
                  type="button"
                  className="location-manual-view__close-btn"
                  aria-label="Close"
                  onClick={() => setModal(false)}
                >
                  <RiCloseLine />
                </button>
              )}
            </div>

            {/* Search input */}
            <div className="location-search-box">
              <RiSearchLine className="location-search-box__search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                className="location-search-box__input"
                placeholder='Search for "Address, area or landmark"...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (notServiceableMsg) setNotServiceableMsg('');
                }}
                autoComplete="off"
              />
              {hasQuery && (
                <button
                  type="button"
                  className="location-search-box__clear-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setNotServiceableMsg('');
                  }}
                  aria-label="Clear search"
                >
                  <RiCloseLine />
                </button>
              )}
            </div>

            {/* Not Serviceable Alert */}
            {notServiceableMsg && (
              <div className="location-not-serviceable" role="alert">
                <RiErrorWarningLine className="location-not-serviceable__icon" />
                <span>{notServiceableMsg}</span>
              </div>
            )}

            {/* Maps unavailable warning */}
            {!mapsReady && hasQuery && (
              <p className="location-results-empty">
                ⚠️ Address search is loading, please wait…
              </p>
            )}

            {/* Current Location row — always visible */}
            <div
              className="current-location-row"
              role="button"
              tabIndex={0}
              onClick={handleGps}
              onKeyDown={(e) => e.key === 'Enter' && handleGps()}
            >
              <div className="current-location-row__left">
                <span className="current-location-row__icon">
                  {gpsLoading ? <RiLoader4Line className="spin-icon" /> : <RiFocus3Line />}
                </span>
                <div className="current-location-row__info">
                  <h6 className="current-location-row__title">
                    {gpsLoading ? 'Detecting your location…' : 'Current Location'}
                  </h6>
                  {gpsError ? (
                    <p className="current-location-row__subtitle current-location-row__subtitle--error">
                      {gpsError}
                    </p>
                  ) : (
                    <p className="current-location-row__subtitle">
                      {gpsLoading ? 'Please wait…' : 'Use GPS to auto-detect your location'}
                    </p>
                  )}
                </div>
              </div>
              {!gpsLoading && (
                <span className="current-location-row__enable-btn">ENABLE</span>
              )}
            </div>

            {/* Saved Shipping Addresses (shown when search is empty) */}
            {!hasQuery && savedShippingAddresses.length > 0 && (
              <div className="saved-addresses-section">
                <h5 className="saved-addresses-section__title">
                  Saved Addresses
                </h5>
                <div className="saved-addresses-list">
                  {savedShippingAddresses.map((addr, idx) => {
                    const formatted = formatAddress(addr);
                    const label =
                      addr?.addressType ||
                      addr?.landmark ||
                      addr?.city ||
                      'Shipping Address';
                    const handleSelectSaved = () => {
                      setNotServiceableMsg('');
                      setGpsError('');
                      validateAndSelect({
                        address: formatted,
                        pincode:
                          addr?.pincode || extractPincodeFromText(formatted),
                      });
                    };

                    return (
                      <div
                        key={addr?.uid || idx}
                        className="saved-address-card"
                        role="button"
                        tabIndex={0}
                        onClick={handleSelectSaved}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectSaved();
                          }
                        }}
                      >
                        <span className="saved-address-card__icon">
                          <RiMapPinLine />
                        </span>
                        <div className="saved-address-card__content">
                          <div className="saved-address-card__header">
                            <span className="saved-address-card__label">
                              {label}
                            </span>
                            {addr?.pincode && (
                              <span className="saved-address-card__pincode">
                                • {addr.pincode}
                              </span>
                            )}
                            {addr?.defaultFlag && (
                              <span className="saved-address-card__badge">
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className="saved-address-card__address"
                            title={formatted}
                          >
                            {formatted}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Google Places predictions */}
            {mapsReady && (
              <div className="location-results-container">
                {/* Spinner only while debounce is pending OR Places is fetching */}
                {hasQuery && (placesLoading || debouncedQuery !== searchQuery.trim()) && (
                  <p className="location-results-loading">Searching…</p>
                )}

                {showResults && !placesLoading && predictions.length === 0 && (
                  <p className="location-results-empty">
                    No results for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                )}

                {predictions.length > 0 && (
                  <ul className="location-results-list">
                    {predictions.map((pred, idx) => {
                      const isChecking = checkingPlaceId === pred.place_id;
                      return (
                        <li
                          key={pred.place_id}
                          className={`location-results-list__item ${idx === 0 ? 'is-active' : ''}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelectPrediction(pred)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSelectPrediction(pred)}
                        >
                          <span className="location-results-list__icon">
                            {isChecking ? (
                              <RiLoader4Line className="spin-icon" />
                            ) : (
                              <RiMapPinLine />
                            )}
                          </span>
                          <div className="location-results-list__details">
                            <p className="location-results-list__title">
                              {pred.structured_formatting?.main_text || pred.description}
                            </p>
                            <span className="location-results-list__subtitle">
                              {isChecking
                                ? 'Checking serviceability…'
                                : pred.structured_formatting?.secondary_text || ''}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────
// Public export — wraps inner modal with GoogleMapsProvider
// so the Places SDK is loaded before the hook runs.
// ─────────────────────────────────────────────────────────────
const HeaderLocationModal = (props) => (
  <GoogleMapsProvider>
    <HeaderLocationModalInner {...props} />
  </GoogleMapsProvider>
);

export default HeaderLocationModal;
