import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';
    
    let url = '';
    
    if (searchTerm) {
      const sqlQuery = `SELECT * from "459b23f1-b239-49f5-a4b9-c325d66e2799" WHERE LOWER("Nombre") LIKE LOWER('%${searchTerm}%') OR LOWER("Municipio") LIKE LOWER('%${searchTerm}%')`;
      url = `https://datosabiertos.regiondemurcia.es/api/action/datastore_search_sql?sql=${encodeURIComponent(sqlQuery)}`;
    } else {
      url = 'https://datosabiertos.regiondemurcia.es/api/action/datastore_search?resource_id=459b23f1-b239-49f5-a4b9-c325d66e2799';
    }

    const { data: apiResponse } = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const rawData = apiResponse.result.records || apiResponse.result.results || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData = rawData.map((farmacia: any) => {
      // Intentar convertir las coordenadas a números
      let latitude = 0;
      let longitude = 0;
      
      try {
        latitude = parseFloat(String(farmacia.Latitud || '0'));
        longitude = parseFloat(String(farmacia.Longitud || '0'));
      } catch (e) {
        console.warn('Error al convertir coordenadas:', farmacia.Codigo || farmacia._id);
        console.error(e);
      }
      
      // Validar que las coordenadas son números válidos
      if (isNaN(latitude)) latitude = 0;
      if (isNaN(longitude)) longitude = 0;
      
      return {
        id: String(farmacia._id || farmacia.Codigo || '0'),
        name: farmacia.Nombre || '',
        address: farmacia.Direccion || '',
        city: farmacia.Municipio || '',
        district: farmacia.Pedania || '',
        phone: farmacia.Telefono || '',
        postalCode: farmacia['C.P.'] || '',
        email: farmacia.Email || '',
        url: farmacia['URL Real'] || farmacia['URL Corta'] || '',
        latitude: latitude,
        longitude: longitude,
        photos: [
          farmacia['Foto 1'],
          farmacia['Foto 2'],
          farmacia['Foto 3']
        ].filter(Boolean) // Eliminar valores nulos
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error retrieving data' }, { status: 500 });
  }
}