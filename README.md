# fitness-api

API REST de **App Fitness**, una aplicación para registrar actividad física con el gimnasio como sección principal.

El frontend vive en otro repositorio: **fitness-web**.

## Tecnologías

- **Node.js 24** + **Express 5**
- **MongoDB Atlas** con **Mongoose**
- **Zod** para validar datos (por ahora, las variables de entorno)
- **helmet** (cabeceras de seguridad) y **cors**
- **Oxlint** para revisar el código

## Requisitos

- Node.js 24 (`node --version`)
- Un clúster de MongoDB Atlas y su cadena de conexión

## Puesta en marcha

```bash
npm install
cp .env.example .env   # en PowerShell: Copy-Item .env.example .env
```

Abre `.env` y completa `MONGODB_URI` con tu cadena de conexión de Atlas. Luego:

```bash
npm run dev
```

Deberías ver en la terminal:

```
✅ Conectado a MongoDB Atlas (base de datos: fitness)
🚀 API lista en http://localhost:3000/api/v1/health
```

## Scripts

| Comando         | Qué hace                                                        |
| --------------- | --------------------------------------------------------------- |
| `npm run dev`   | Inicia la API y la reinicia sola al guardar cambios (`--watch`) |
| `npm start`     | Inicia la API sin reinicio automático                           |
| `npm run lint`  | Revisa el código con Oxlint                                     |

## Variables de entorno

Se leen del archivo `.env` (nunca se sube a GitHub). La plantilla es `.env.example`.

| Variable          | Obligatoria | Por defecto             | Descripción                                        |
| ----------------- | ----------- | ----------------------- | -------------------------------------------------- |
| `MONGODB_URI`     | Sí          | —                       | Cadena de conexión de MongoDB Atlas                |
| `MONGODB_DB_NAME` | No          | `fitness`               | Base de datos dentro del clúster                   |
| `PORT`            | No          | `3000`                  | Puerto del servidor local                          |
| `CORS_ORIGIN`     | No          | `http://localhost:5173` | Direcciones del frontend permitidas, separadas por comas |
| `NODE_ENV`        | No          | `development`           | `development`, `test` o `production`               |
| `DNS_SERVERS`     | No          | —                       | Servidores DNS para resolver `mongodb+srv://` (ver abajo) |

Si falta una variable o tiene un formato incorrecto, la API no arranca y explica qué corregir (ver `src/config/env.js`).

### Error `querySrv ECONNREFUSED` en Windows

En algunos equipos con Windows, Node no detecta el DNS del sistema y no puede resolver la dirección `mongodb+srv://` del clúster, aunque la cadena de conexión sea correcta. Para solucionarlo, agrega esto a tu `.env`:

```
DNS_SERVERS=8.8.8.8,1.1.1.1
```

Solo hace falta en local. En Vercel no se configura.

## Estructura

```
src/
├── app.js            # Crea y configura Express (sin escuchar en un puerto)
├── server.js         # Arranque local: conecta a MongoDB y escucha en PORT
├── config/
│   ├── env.js        # Lee y valida las variables de entorno
│   └── database.js   # Conexión a MongoDB reutilizable (lista para serverless)
├── routes/           # URLs de la API → qué controlador responde
├── controllers/      # Leen la petición y arman la respuesta HTTP
├── services/         # Lógica de negocio
└── models/           # Esquemas de Mongoose (desde la Fase 1)
```

Cada petición recorre las capas **rutas → controladores → servicios → modelos**. Así la lógica de negocio no queda mezclada con los detalles de HTTP y es más fácil de probar y reutilizar.

## Endpoints

| Método | Ruta             | Descripción                                                     |
| ------ | ---------------- | --------------------------------------------------------------- |
| GET    | `/api/v1/health` | Estado de la API y de la base de datos (`200` si todo está bien, `503` si MongoDB no responde) |
