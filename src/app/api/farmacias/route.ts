import { normalizeCoordinates } from "@/utils/coordinatesConverter";
import axios from "axios";
import { NextResponse } from "next/server";

export interface PharmacyRaw {
  _id?: string;
  Codigo?: string;
  Nombre: string;
  Direccion: string;
  Municipio: string;
  Pedania?: string;
  Telefono?: string;
  "C.P."?: string;
  Email?: string;
  "URL Real"?: string;
  "URL Corta"?: string;
  Latitud: string | number;
  Longitud: string | number;
  "Foto 1"?: string;
  "Foto 2"?: string;
  "Foto 3"?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q") || "";

    let url = "";

    if (searchTerm) {
      const sqlQuery = `SELECT * from "459b23f1-b239-49f5-a4b9-c325d66e2799" WHERE LOWER("Nombre") LIKE LOWER('%${searchTerm}%') OR LOWER("Municipio") LIKE LOWER('%${searchTerm}%')`;
      url = `https://datosabiertos.regiondemurcia.es/api/action/datastore_search_sql?sql=${encodeURIComponent(
        sqlQuery
      )}`;
    } else {
      url =
        "https://datosabiertos.regiondemurcia.es/api/action/datastore_search?resource_id=459b23f1-b239-49f5-a4b9-c325d66e2799&limit=1000";
    }

    const { data: apiResponse } = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const rawData = apiResponse.result.records;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = rawData.map((pharmacy: PharmacyRaw) => {
      const rawLat = pharmacy.Latitud;
      const rawLng = pharmacy.Longitud;

      let [latitude, longitude] = [0, 0];

      try {
        // normalize coordinates based on detected format
        [latitude, longitude] = normalizeCoordinates(rawLat, rawLng);
      } catch (e) {
        console.warn(
          "Error al procesar coordenadas:",
          pharmacy.Nombre,
          pharmacy.Codigo || pharmacy._id
        );
        console.error(e);
      }

      return {
        id: String(pharmacy._id || pharmacy.Codigo || "0"),
        name: pharmacy.Nombre || "",
        address: pharmacy.Direccion || "",
        city: pharmacy.Municipio || "",
        district: pharmacy.Pedania || "",
        phone: pharmacy.Telefono || "",
        postalCode: pharmacy["C.P."] || "",
        email: pharmacy.Email || "",
        url: pharmacy["URL Real"] || pharmacy["URL Corta"] || "",
        latitude: latitude,
        longitude: longitude,
        photos: [
          pharmacy["Foto 1"],
          pharmacy["Foto 2"],
          pharmacy["Foto 3"],
        ].filter(Boolean),
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error retrieving data" },
      { status: 500 }
    );
  }
}
