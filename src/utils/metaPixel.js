export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '348446167114642';

/**
 * Standard Meta Pixel track wrapper
 */
export const trackMetaEvent = (eventName, params = {}) => {
  // Disabled
  // if (typeof window === 'undefined') return;
  // if (typeof window.fbq !== 'function') return;
  // window.fbq('track', eventName, params);
};

/**
 * Normalizes and updates Advanced Matching user data on the Meta Pixel instance.
 * Plain text fields are automatically hashed (SHA-256) client-side by Meta's fbevents.js script before transmission.
 */
export const updateMetaUserData = (userData = {}) => {
  // Disabled
  // if (typeof window === 'undefined') return;
  // if (typeof window.fbq !== 'function') return;
  // ...
};

/**
 * Captures fbclid from URL and sets the 1st-party _fbc cookie if present.
 * Strictly does NOT fabricate dummy or random data if fbclid is missing.
 */
export const captureFbclid = () => {
  // Disabled
  // if (typeof window === 'undefined') return;
};
