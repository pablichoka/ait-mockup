import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Box, Typography } from "@mui/material";

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone?: string;
  district?: string;
}

export default function MapComponent({
  pharmacies,
}: {
  pharmacies: Pharmacy[];
}) {
  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  console.log([pharmacies[0].latitude, pharmacies[0].longitude])

  return (
    <MapContainer
      center={[37.9922, -1.1307]}
      zoom={8.5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {pharmacies.map((pharmacy) => (
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
