import proj4 from "proj4";

// define projections
proj4.defs([
  ["EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs"],
  ["EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"],
]);

// detect if value appears to be a UTM coordinate
function isUTMValue(value: number | string | undefined): boolean {
  if (value === undefined || value === null) return false;
  const num = Number(value);
  // utm coordinates in Spain have 6+ digits
  return !isNaN(num) && num > 100000;
}

// detect if value appears to be a lat/lng coordinate
function isLatLngValue(value: number | string | undefined): boolean {
  if (value === undefined || value === null) return false;
  const num = Number(value);
  // lat/lng coordinates are within specific range
  return !isNaN(num) && Math.abs(num) <= 180;
}

// convert UTM coordinates to lat/lng
function convertUTMToLatLng(
  utmX: number | string,
  utmY: number | string
): [number, number] {
  const x = Number(utmX);
  const y = Number(utmY);

  if (isNaN(x) || isNaN(y)) {
    console.warn("Invalid UTM values:", utmX, utmY);
    return [0, 0];
  }

  try {
    // proj4 returns [longitude, latitude] but we need [latitude, longitude]
    const [longitude, latitude] = proj4("EPSG:25830", "EPSG:4326", [x, y]);

    // verify coordinates are within Spain's range
    if (
      latitude >= 35 &&
      latitude <= 44 &&
      longitude >= -10 &&
      longitude <= 5
    ) {
      return [latitude, longitude];
    } else {
      console.warn("UTM conversion produced coordinates outside Spain range:", {
        latitude,
        longitude,
        utmX,
        utmY,
      });
      // try inverting UTM X and Y
      const [lngAlternativo, latAlternativo] = proj4(
        "EPSG:25830",
        "EPSG:4326",
        [y, x]
      );

      if (
        latAlternativo >= 35 &&
        latAlternativo <= 44 &&
        lngAlternativo >= -10 &&
        lngAlternativo <= 5
      ) {
        return [latAlternativo, lngAlternativo];
      }

      return [0, 0];
    }
  } catch (e) {
    console.error("Error converting UTM coordinates:", e);
    return [0, 0];
  }
}

// normalize latitude and longitude values
export function normalizeCoordinates(
  lat: number | string | undefined,
  lng: number | string | undefined
): [number, number] {
  const numLat = lat !== undefined ? Number(lat) : 0;
  const numLng = lng !== undefined ? Number(lng) : 0;

  if (isNaN(numLat) || isNaN(numLng)) {
    return [0, 0];
  }

  // both values appear to be UTM coordinates
  if (isUTMValue(numLat) && isUTMValue(numLng)) {
    if (numLat > numLng) {
      return convertUTMToLatLng(numLng, numLat);
    } else {
      return convertUTMToLatLng(numLat, numLng);
    }
  }

  // values appear to be normal lat/lng coordinates
  if (isLatLngValue(numLat) && isLatLngValue(numLng)) {
    const isSpanishLatitude = numLat >= 36 && numLat <= 44;
    const isSpanishLongitude = numLng >= -9 && numLng <= 3;

    if (isSpanishLatitude && isSpanishLongitude) {
      return [numLat, numLng];
    } else if (numLng >= 36 && numLng <= 44 && numLat >= -9 && numLat <= 3) {
      return [numLng, numLat];
    } else {
      if (Math.abs(numLat) <= 90 && Math.abs(numLng) <= 180) {
        if (Math.abs(numLat) < Math.abs(numLng) && Math.abs(numLng) < 90) {
          return [numLng, numLat];
        } else {
          return [numLat, numLng];
        }
      }
    }
  }
  return [0, 0];
}
