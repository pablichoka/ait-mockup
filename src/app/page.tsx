"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import PharmacyCard, { PharmacyRaw } from "../components/PharmacyCard";
import SearchBar from "../components/SearchBar";

const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [url, setUrl] = useState("/api/farmacias");

  // Actualizar la URL cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      setUrl(`/api/farmacias?q=${encodeURIComponent(searchTerm)}`);
    } else {
      setUrl("/api/farmacias");
    }
  }, [searchTerm]);

  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error) return <Alert severity="error">Error al cargar los datos</Alert>;

  return isLoading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="static" color="default" elevation={4}>
        <Toolbar>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Farmacias de Murcia
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <SearchBar onSearch={setSearchTerm} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mt: 2,
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                height: "calc(95vh - 200px)",
                borderRadius: 2,
                overflow: "auto",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {data && data.length > 0 ? (
                  data.map((pharmacy: PharmacyRaw) => (
                    <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                  ))
                ) : (
                  <Typography>No se encontraron farmacias.</Typography>
                )}
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper
              elevation={3}
              sx={{
                height: "calc(95vh - 200px)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <MapComponent pharmacies={data} />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
