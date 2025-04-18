import proj4 from "proj4";

// define projections with more precision
proj4.defs([
  [
    "EPSG:25830",
    "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +wktext +over +geoidgrids=egm08_30.gtx"
  ],
  [
    "EPSG:4326",
    "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs +wktext"
  ],
]);

// increase internal precision if possible
if (typeof proj4.defs === 'function') {
  try {
    // Get all definitions
    const defs = proj4.defs("EPSG:4326");
    if (defs && typeof defs === 'object' && 'accuracy' in defs) {
      defs.accuracy = 0.0000000000001;
    }
  } catch (e) {
    console.error("Error setting accuracy for EPSG:4326:", e);
    // ignore if not supported
  }
}

// detect if value appears to be a utm coordinate
function isUTMValue(value: number | string | undefined): boolean {
  if (value === undefined || value === null) return false;
  const num = Number(value);
  // utm coordinates in spain have 6+ digits
  return !isNaN(num) && num > 100000;
}

// detect if value appears to be a lat/lng coordinate
function isLatLngValue(value: number | string | undefined): boolean {
  if (value === undefined || value === null) return false;
  const num = Number(value);
  // lat/lng coordinates are within specific range
  return !isNaN(num) && Math.abs(num) <= 180;
}

// convert utm coordinates to lat/lng with full precision
function convertUTMToLatLng(
  utmX: number | string,
  utmY: number | string
): [number, number] {
  const x = Number(utmX);
  const y = Number(utmY);

  if (isNaN(x) || isNaN(y)) {
    console.warn("invalid utm values:", utmX, utmY);
    return [0, 0];
  }

  try {
    // proj4 returns [longitude, latitude] but we need [latitude, longitude]
    const [longitude, latitude] = proj4("EPSG:25830", "EPSG:4326", [x, y]);

    // verify coordinates are within spain's range
    if (
      latitude >= 35 &&
      latitude <= 44 &&
      longitude >= -10 &&
      longitude <= 5
    ) {
      return [latitude, longitude];
    } else {
      console.warn("utm conversion produced coordinates outside spain range:", {
        latitude,
        longitude,
        utmX,
        utmY,
      });
      
      // try inverting utm x and y as last resort
      const [altLongitude, altLatitude] = proj4(
        "EPSG:25830",
        "EPSG:4326",
        [y, x]
      );

      if (
        altLatitude >= 35 &&
        altLatitude <= 44 &&
        altLongitude >= -10 &&
        altLongitude <= 5
      ) {
        return [altLatitude, altLongitude];
      }

      return [0, 0];
    }
  } catch (e) {
    console.error("error converting utm coordinates:", e);
    return [0, 0];
  }
}

// normalize latitude and longitude values with full precision
export function normalizeCoordinates(
  lat: number | string | undefined,
  lng: number | string | undefined
): [number, number] {
  const numLat = lat !== undefined ? Number(lat) : 0;
  const numLng = lng !== undefined ? Number(lng) : 0;

  if (isNaN(numLat) || isNaN(numLng)) {
    return [0, 0];
  }

  // both values appear to be utm coordinates
  if (isUTMValue(numLat) && isUTMValue(numLng)) {
    // for utm in spain, normally x (east) is smaller than y (north)
    // if values seem inverted, switch them before converting
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
      // lat/lng appear to be reversed
      return [numLng, numLat];
    } else {
      if (Math.abs(numLat) <= 90 && Math.abs(numLng) <= 180) {
        // use heuristic: in spain, generally lat > long
        if (Math.abs(numLat) < Math.abs(numLng) && Math.abs(numLng) < 90) {
          return [numLng, numLat]; // invert
        } else {
          return [numLat, numLng]; // keep as is
        }
      }
    }
  }
  
  // fallback
  return [0, 0];
}