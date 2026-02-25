# GameVault Project

## Nombre del proyecto

**GameVault** - Plataforma de administración y exploración de videojuegos.

## Problema que resuelve

Muchos jugadores llevan registros dispersos de los juegos que poseen, horas jugadas y estado de progreso. GameVault apunta a centralizar esa información, permitiendo guardar, buscar y filtrar títulos con detalles importantes, así como aplicar reglas de negocio como evitar duplicados y controlar rangos de valores.

## Descripción funcional

La aplicación consiste en una API REST que gestiona una colección de videojuegos. Cada recurso puede ser creado, consultado, actualizado y eliminado. Se soporta paginación en listados y diversas validaciones, además de servir datos para futuros frontends en Angular o React.

## Entidades

- **Juego** (videojuego)

## Campos de la entidad

| Campo                    | Tipo     | Descripción                                                                 |
| ------------------------ | -------- | --------------------------------------------------------------------------- |
| `titulo`                 | String   | Nombre o título del juego. (requerido, único)                              |
| `descripcion`            | String   | Breve descripción.                                                          |
| `horasJugadas`           | Number   | Campo numérico de horas jugadas (>=0 y <=100000).                          |
| `fechaLanzamiento`       | Date     | Fecha de lanzamiento.                                                       |
| `completado`             | Boolean  | Indica si el juego está completado.                                         |
| `porcentajeCompletado`   | Number   | Porcentaje de avance 0–100.                                                 |
| `imagen`                 | String   | URL de imagen de portada.                                                   |
| `createdAt`              | Date     | Timestamp creado automáticamente.                                           |
| `updatedAt`              | Date     | Timestamp actualizado automáticamente.                                       |

Las propiedades `_id` e `id` están gestionadas por MongoDB.

## Reglas de negocio

1. **No permitir títulos duplicados:** el campo `titulo` debe ser único.
2. **Validar rangos numéricos:** `horasJugadas` no puede ser negativo ni excesivamente alto; `porcentajeCompletado` entre 0 y 100.
3. **Restricción de eliminación:** no se puede eliminar un juego marcado como `completado = true`.

> Se pueden añadir fácilmente más reglas (por ejemplo, filtros por categoría) en futuros pasos.

## Documentación de endpoints

La API expone rutas bajo `/api/v1/games`:

- `GET /api/v1/games/get/all` – lista todos los juegos (se soportan `?page` y `?limit` para paginación).
- `GET /api/v1/games/get/:id` – obtiene un juego por id.
- `POST /api/v1/games/post` – crea un nuevo juego.
- `PATCH /api/v1/games/update/:id` – modifica campos de un juego.
- `PUT /api/v1/games/update/:id` – puede reemplazar un documento completo.
- `DELETE /api/v1/games/delete/:id` – elimina un juego, sujeto a reglas de negocio.

Todos los endpoints responden con códigos HTTP adecuados (200, 201, 400, 404, 500, etc.) y mensajes JSON en español. Se incluyen validaciones y manejo de errores en cada controlador.

## Base de datos

La conexión usa la URL:
```
mongodb+srv://root:root@clusteradrian.wvpy8fa.mongodb.net/?appName=ClusterAdrian
```

Incluye un script de semilla (`src/seed.js`) que inserta al menos 20 registros de ejemplo.

---

## Despliegue

- **API backend:** se puede desplegar en Heroku / Render / Vercel (Node). El repositorio ya está preparado para aceptar la variable `MONGO_URI` en producción.
- **Frontend Angular:** generar `ng build --prod` y subir los archivos a Firebase Hosting, Netlify o GitHub Pages. Asegúrate de cambiar `environment.prod.ts` con la URL de la API desplegada.
- **Frontend React:** ejecutar `npm run build` y publicar la carpeta `dist` en Netlify/Vercel/Firebase. Usa la variable de entorno `REACT_APP_API_URL` en el entorno de producción.

### URLs de ejemplo

- API: `https://gamevault-api.example.com` *(pendiente de deploy)*
- Angular: `https://gamevault-angular.example.com` *(pendiente de deploy)*
- React: `https://gamevault-react.example.com` *(pendiente de deploy)*

---

## Ejecución y pruebas

1. Instalar dependencias en cada carpeta:
   ```bash
   cd backend && npm install
   cd ../frontend-angular && npm install
   cd ../frontend-react && npm install
   ```
2. Configurar variables de entorno en backend copiando `.env.example` a `.env` y ajustando la `MONGO_URI`.
   - en **Angular** el endpoint se lee de `src/environments/environment.ts` (o `environment.prod.ts`).
   - en **React** crear un archivo `.env` con `VITE_API_URL=http://localhost:3000/api/v1/games`.
3. Iniciar el servidor backend:
   ```bash
   cd backend
   npm run dev
   ```
4. Sembrar datos:
   ```bash
   npm run seed
   ```
5. Ejecutar los clientes:
   ```bash
   # Angular
   cd ../frontend-angular
   ng serve --open
   
   # React
   cd ../frontend-react
   npm run dev
   ```
6. Probar la API con Postman o similar.

### Ejecución de pruebas

- **Backend** (Jest + Supertest)
  ```bash
  cd backend && npm test
  ```
- **Angular** (Karma/Jasmine)
  ```bash
  cd frontend-angular && npm test
  ```
---

