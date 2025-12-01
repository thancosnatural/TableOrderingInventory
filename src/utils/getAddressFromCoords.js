import axios from 'axios';

const GOOGLE_MAPS_API_KEY = "AIzaSyCHQaNtfVOdw54LgXxLnY4awrLZs4sNwj8";

export async function getAddressFromCoords(lat, lng) {
  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (res.data.status !== 'OK') throw new Error(res.data.error_message || 'Geocoding error');

    // Find the most specific result (avoid plus_code or broad results)
    const result = res.data.results.find(r =>
      r.types.includes('sublocality_level_1') ||
      r.types.includes('neighborhood') ||
      r.types.includes('premise') ||
      r.types.includes('route')
    ) || res.data.results[0]; // fallback to first if nothing matches


    const components = result.address_components;

    const get = (type) =>
      components.find((c) => c.types.includes(type))?.long_name || '';

    const neighborhood = get('neighborhood');               // Gokula 1st Stage
    const subLocality = get('sublocality_level_1');         // HMT Layout
    const locality = get('locality');                       // Mathikere
    const city = get('administrative_area_level_2');        // Bangalore
    const state = get('administrative_area_level_1');       // Karnataka
    const postalCode = get('postal_code');                  // 560054

    const shortAddress = [
      neighborhood,
      subLocality,
      locality,
      city,
      postalCode
    ].filter(Boolean).join(', ');

    return {
      shortAddress,                          // Zepto-style address
      fullAddress: result.formatted_address, // Google's default full address
      lat,
      lng,
      raw: result
    };
  } catch (err) {
    console.error('Reverse geocoding failed:', err.message);
    return null;
  }
}
