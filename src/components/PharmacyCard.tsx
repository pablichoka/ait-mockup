import { Box, Card, CardContent, Link, Typography } from "@mui/material";

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  phone?: string;
  postalCode?: string;
  email?: string;
  url?: string;
  latitude: number;
  longitude: number;
  photos?: string[];
}

function formatUrl(url: string): string {
  if (!url) return "";
  
  // remove spaces
  url = url.trim();
  if (!url) return "";
  
  // keep as is if already has protocol
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // add https:// prefix
  return `https://${url}`;
}

export default function PharmacyCard({ pharmacy }: { pharmacy: Pharmacy }) {
  const firstPhoto =
    pharmacy.photos && pharmacy.photos.length > 0 ? pharmacy.photos[0] : null;

  return (
    <Card elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {firstPhoto && (
          <Box
            sx={{
              width: 150,
              height: 150,
              flexShrink: 0,
              mr: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              overflow: "hidden",
            }}
          >
            <img
              src={firstPhoto}
              alt={`${pharmacy.name}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        <CardContent sx={{ flex: 1, p: 0 }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            {pharmacy.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {pharmacy.address}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {pharmacy.city}
            {pharmacy.district ? ` - ${pharmacy.district}` : ""}
          </Typography>

          {pharmacy.phone && (
            <Box mt={1}>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" fontWeight="medium">
                  Teléfono:
                </Box>{" "}
                {pharmacy.phone}
              </Typography>
            </Box>
          )}

          {pharmacy.email && (
            <Typography variant="body2" color="text.secondary">
              <Box component="span" fontWeight="medium">
                Email:
              </Box>{" "}
              {pharmacy.email}
            </Typography>
          )}

          {pharmacy.url && (
            <Typography variant="body2" mt={1}>
              <Link
                href={formatUrl(pharmacy.url)}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Sitio web
              </Link>
            </Typography>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}
