import { Box, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export interface MapPharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  district?: string;
}

// component to recalculate map center
function ChangeMapView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [center[0], center[1], zoom, map]); // more precise dependencies

  return null;
}

export default function MapComponent({
  pharmacies,
}: {
  pharmacies: MapPharmacy[];
}) {
  // ensure pharmacies is an array
  const pharmaciesList = Array.isArray(pharmacies) ? pharmacies : [];

  // filter pharmacies with valid coordinates
  const validPharmacies = useMemo(() => {
    return pharmaciesList.filter(
      (pharmacy) => pharmacy.latitude !== 0 && pharmacy.longitude !== 0
    );
  }, [pharmaciesList]);

  const defaultCenter: [number, number] = [37.9922, -1.1307]; // default: Murcia

  // calculate center and zoom once when valid pharmacies change
  const { mapCenter, mapZoom } = useMemo(() => {
    if (validPharmacies.length === 0) {
      return { mapCenter: defaultCenter, mapZoom: 9 };
    }

    // calculate coordinates average
    const sumLat = validPharmacies.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = validPharmacies.reduce((sum, p) => sum + p.longitude, 0);

    const avgLat = sumLat / validPharmacies.length;
    const avgLng = sumLng / validPharmacies.length;

    // find coordinate boundaries for zoom
    const minLat = Math.min(...validPharmacies.map((p) => p.latitude));
    const maxLat = Math.max(...validPharmacies.map((p) => p.latitude));
    const minLng = Math.min(...validPharmacies.map((p) => p.longitude));
    const maxLng = Math.max(...validPharmacies.map((p) => p.longitude));

    // calculate approximate distance
    const latDistance = maxLat - minLat;
    const lngDistance = maxLng - minLng;
    const maxDistance = Math.max(latDistance, lngDistance);

    // heuristic rule for zoom level
    let zoom = 9;
    if (validPharmacies.length <= 1) zoom = 13;
    else if (maxDistance > 1) zoom = 8;
    else if (maxDistance > 0.5) zoom = 9;
    else if (maxDistance > 0.2) zoom = 10;
    else if (maxDistance > 0.05) zoom = 12;
    else zoom = 13;

    return {
      mapCenter: [avgLat, avgLng] as [number, number],
      mapZoom: zoom,
    };
  }, [validPharmacies, defaultCenter]);

  const defaultIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      }),
    []
  ); // created only once

  return (
    <MapContainer
      center={defaultCenter}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeMapView center={mapCenter} zoom={mapZoom} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {validPharmacies.map((pharmacy) => (
        <Marker
          key={pharmacy.id}
          position={[pharmacy.latitude, pharmacy.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            <Box sx={{ padding: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", margin: 0 }}
              >
                {pharmacy.name}
              </Typography>
              <Typography variant="body2" sx={{ my: 0.5 }}>
                {pharmacy.address}
              </Typography>
              <Typography variant="body2" sx={{ my: 0.5 }}>
                {pharmacy.city}{" "}
                {pharmacy.district ? `- ${pharmacy.district}` : ""}
              </Typography>
              {pharmacy.phone && (
                <Typography variant="body2" sx={{ my: 0.5 }}>
                  Tel: {pharmacy.phone}
                </Typography>
              )}
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
