import { Card, CardContent, Typography, Link, Box } from "@mui/material";

export interface PharmacyRaw {
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

export default function PharmacyCard({ pharmacy }: { pharmacy: PharmacyRaw }) {
  return (
    <>
      <Card elevation={3} sx={{ p: 2 }}>
        <CardContent>
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
                href={pharmacy.url}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                Sitio web
              </Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
}
