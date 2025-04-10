# Buscador de Farmacias de Murcia

Este proyecto es una aplicación web desarrollada con **Next.js** que permite buscar farmacias en la Región de Murcia utilizando datos reales obtenidos del portal de Datos Abiertos de la Región de Murcia. La aplicación incluye un mapa interactivo, una barra de búsqueda y una lista de farmacias con información detallada.

## Objetivo

El objetivo principal de este proyecto es proporcionar una herramienta funcional y visualmente atractiva para localizar farmacias en la Región de Murcia. La aplicación permite a los usuarios:
- Buscar farmacias por nombre o municipio.
- Visualizar las farmacias en un mapa interactivo.
- Consultar información detallada de cada farmacia, como dirección, teléfono, correo electrónico y enlaces a su sitio web.

## ¿Cómo funciona?

1. **Pantalla Principal**:
  - Al abrir la aplicación, se muestra un mapa interactivo con las farmacias disponibles.
  - Una barra de búsqueda permite filtrar farmacias por nombre o municipio.
  - Los resultados se muestran tanto en el mapa como en una lista detallada.

2. **Mapa Interactivo**:
  - Utiliza la librería `react-leaflet` para mostrar las ubicaciones de las farmacias.
  - Los marcadores en el mapa incluyen información básica de cada farmacia.

3. **Lista de Farmacias**:
  - Cada farmacia se muestra en una tarjeta con información como dirección, municipio, teléfono, correo electrónico y un enlace a su sitio web.

4. **API Personalizada**:
  - La aplicación utiliza una API personalizada para obtener y procesar los datos de farmacias desde el portal de Datos Abiertos de la Región de Murcia.

## Integraciones

- **Portal de Datos Abiertos de la Región de Murcia**: Los datos de las farmacias se obtienen en tiempo real desde este portal.
- **Leaflet**: Para la visualización del mapa interactivo.
- **Material-UI**: Para los componentes de la interfaz de usuario, como la barra de búsqueda y las tarjetas de farmacias.

## Tecnologías Usadas

- **Next.js**: Framework de React para el desarrollo de aplicaciones web modernas.
- **React**: Biblioteca para construir interfaces de usuario.
- **TypeScript**: Lenguaje de programación tipado para mejorar la calidad del código.
- **React-Leaflet**: Librería para integrar mapas interactivos en aplicaciones React.
- **Material-UI**: Librería de componentes para construir interfaces de usuario modernas y accesibles.
- **Axios**: Cliente HTTP para realizar solicitudes a la API.
- **TailwindCSS**: Framework de utilidades CSS para estilizar la aplicación.
- **SWR**: Librería para la gestión de datos en el cliente con soporte para revalidación automática.

## Instalación y Uso

1. Clona este repositorio:
  ```bash
  git clone https://github.com/tu-usuario/buscador-farmacias.git
  cd buscador-farmacias
  ```

2. Instala las dependencias:
  ```bash
  npm install
  ```

3. Inicia el servidor de desarrollo:
  ```bash
  npm run dev
  ```

4. Abre http://localhost:3000 en tu navegador para ver la aplicación.

## Estructura del Proyecto

- `src/app`: Contiene las páginas principales de la aplicación.
- `src/components`: Componentes reutilizables como el mapa, la barra de búsqueda y las tarjetas de farmacias.
- `src/utils`: Funciones auxiliares, como la conversión de coordenadas.
- `src/styles`: Archivos de estilos globales.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.