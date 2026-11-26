/**
 * Navi Mumbai serviceable pincodes mapped to their primary area names.
 * Add or remove 6-digit pincodes here as delivery coverage expands.
 */
// export const NAVI_MUMBAI_PINCODES = {
//   '400614': 'CBD Belapur',
//   '400701': 'Ghansoli',
//   '400702': 'Kopar Khairane / Mahape',
//   '400703': 'Vashi',
//   '400704': 'Turbhe',
//   '400705': 'Sanpada / Juinagar',
//   '400706': 'Nerul / Seawoods',
//   '400707': 'Uran / Dronagiri',
//   '400708': 'Airoli',
//   '400709': 'Kopar Khairane',
//   '400710': 'Rabale / Ghansoli MIDC',
//   '410206': 'Panvel / New Panvel',
//   '410208': 'Kalamboli / Taloja',
//   '410209': 'Kamothe',
//   '410210': 'Kharghar',
//   '410218': 'Roadpali / Kalamboli',
// };
export const NAVI_MUMBAI_PINCODES = {
  '400614': 'CBD Belapur',
  '400701': 'Ghansoli',
  '400702': 'Uran',
  '400703': 'Vashi / Turbhe MIDC',
  '400704': 'Karanja / Mora (Uran)',
  '400705': 'Sanpada / Juinagar / Turbhe',
  '400706': 'Nerul / Seawoods',
  '400707': 'Dronagiri / JNPT',
  '400708': 'Airoli / Dighe',
  '400709': 'Kopar Khairane',
  '400710': 'Rabale / Mahape / Ghansoli MIDC',
  '410206': 'Panvel / New Panvel / Ulwe',
  '410208': 'Taloja',
  '410209': 'Kamothe / Khandeshwar / Khanda Colony',
  '410210': 'Kharghar',
  '410218': 'Kalamboli / Roadpali',
};

const SERVICEABLE_PINCODE_SET = new Set(Object.keys(NAVI_MUMBAI_PINCODES));

/** Extract a 6-digit Indian pincode from a formatted address string. */
export const extractPincodeFromText = (text = '') => {
  const match = String(text).match(/\b([1-9]\d{5})\b/);
  return match ? match[1] : '';
};

/** Returns true if the given 6-digit pincode is in the Navi Mumbai serviceable list. */
export const isPincodeServiceable = (pincode) => {
  if (!pincode) return false;
  return SERVICEABLE_PINCODE_SET.has(String(pincode).trim());
};

/**
 * Reverse-geocode lat/lng -> { address, pincode }.
 * Tries Google Maps Geocoder first; falls back to OpenStreetMap Nominatim.
 */
export const reverseGeocodeWithPincode = async (lat, lng) => {
  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    try {
      const geocoded = await new Promise((resolve, reject) => {
        new window.google.maps.Geocoder().geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const first = results[0];
              const pinComponent = first.address_components?.find((c) =>
                c.types.includes('postal_code')
              );
              const pincode =
                pinComponent?.long_name ||
                extractPincodeFromText(first.formatted_address);
              resolve({
                address: first.formatted_address,
                pincode,
              });
            } else {
              reject(new Error(status));
            }
          }
        );
      });
      if (geocoded?.address) return geocoded;
    } catch {
      // Fall through to Nominatim
    }
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Nominatim error');
  const data = await res.json();

  const a = data.address || {};
  const parts = [
    a.suburb || a.neighbourhood || a.village || a.town,
    a.city || a.county,
    a.state,
    a.postcode,
  ].filter(Boolean);

  const address = parts.length ? parts.join(', ') : data.display_name;
  const pincode = a.postcode ? String(a.postcode).trim() : extractPincodeFromText(address);

  return { address, pincode };
};
