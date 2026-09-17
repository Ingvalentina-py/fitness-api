# fitness-api

API REST de **App Fitness**, una aplicación para registrar actividad física con el gimnasio como sección principal.

El frontend vive en otro repositorio: **fitness-web**.

## Tecnologías

- **Node.js 24** + **Express 5**
- **MongoDB Atlas** con **Mongoose**
- **Zod** para validar todo lo que entra (variables de entorno y peticiones), con mensajes en español
- **bcryptjs** (contraseñas), **jose** (JWT) y **cookie-parser** (cookie de sesión)
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

Abre `.env` y completa:

- `MONGODB_URI` con tu cadena de conexión de Atlas.
- `JWT_SECRET` con una clave aleatoria. Genérala con:
  `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`

Luego crea los índices y carga el catálogo inicial (la primera vez, y cada vez que se agreguen modelos o índices):

```bash
npm run seed
```

Y arranca la API:

```bash
npm run dev
```

Deberías ver en la terminal:

```
✅ Conectado a MongoDB Atlas (base de datos: fitness)
🚀 API lista en http://localhost:3000/api/v1/health
```

## Scripts

| Comando        | Qué hace                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| `npm run dev`  | Inicia la API y la reinicia sola al guardar cambios (`--watch`)          |
| `npm start`    | Inicia la API sin reinicio automático                                    |
| `npm run seed` | Crea los índices y carga ejercicios, tipos de actividad y frases globales |
| `npm run lint` | Revisa el código con Oxlint                                              |

`npm run seed` se puede ejecutar las veces que quieras: actualiza lo que ya existe en vez de duplicarlo.

## Variables de entorno

Se leen del archivo `.env` (nunca se sube a GitHub). La plantilla es `.env.example`.

| Variable          | Obligatoria | Por defecto             | Descripción                                               |
| ----------------- | ----------- | ----------------------- | --------------------------------------------------------- |
| `MONGODB_URI`     | Sí          | —                       | Cadena de conexión de MongoDB Atlas                       |
| `MONGODB_DB_NAME` | No          | `fitness`               | Base de datos dentro del clúster                          |
| `JWT_SECRET`      | Sí          | —                       | Clave para firmar las sesiones (mínimo 32 caracteres)     |
| `PORT`            | No          | `3000`                  | Puerto del servidor local                                 |
| `CORS_ORIGIN`     | No          | `http://localhost:5173` | Direcciones del frontend permitidas, separadas por comas  |
| `NODE_ENV`        | No          | `development`           | `development`, `test` o `production`                      |
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
scripts/
├── seed.js           # Índices + datos iniciales
└── data/             # Ejercicios, tipos de actividad y frases del sistema
src/
├── app.js            # Crea y configura Express (sin escuchar en un puerto)
├── server.js         # Arranque local: conecta a MongoDB y escucha en PORT
├── config/           # Variables de entorno, conexión a MongoDB, idioma de Zod
├── constants/        # Valores permitidos (músculos, equipos…) con su texto en español
├── routes/           # URLs de la API → validación → controlador
├── controllers/      # Leen la petición y arman la respuesta HTTP
├── services/         # Lógica de negocio y consultas
├── models/           # Esquemas de Mongoose e índices
├── validators/       # Esquemas de Zod para lo que entra en cada ruta
├── middlewares/      # Validación, conexión a la base de datos, 404 y errores
└── utils/            # AppError, paginación, conversión de pesos, zonas horarias
```

Cada petición recorre las capas **rutas → controladores → servicios → modelos**. Así la lógica de negocio no queda mezclada con los detalles de HTTP y es más fácil de probar y reutilizar.

## Modelo de datos

| Colección         | Qué guarda                                                                   |
| ----------------- | ---------------------------------------------------------------------------- |
| `users`           | Cuenta, rol, plan y preferencias (unidad de peso, inicio de semana, zona horaria, voz) |
| `exercises`       | Catálogo: equipo, patrón de movimiento, músculos. `owner: null` = global     |
| `routineGroups`   | Carpetas de rutinas con color, ícono y orden                                 |
| `routines`        | Rutinas con sus ejercicios objetivo (series, rango de reps, descanso)        |
| `weeklyPlans`     | Qué rutina o actividad toca cada día de la semana                            |
| `activityTypes`   | Baile, bicicleta, patinaje… `owner: null` = global                           |
| `activities`      | Todo lo registrado en un día: `kind: "gym"` (GymSession) o `kind: "general"` (GeneralActivity) |
| `personalRecords` | Peso máximo y mejor volumen por persona y ejercicio                          |
| `phrases`         | Frases motivacionales por contexto (general, racha, récord, sesión terminada) |
| `loginAttempts`   | Intentos fallidos de inicio de sesión por correo (se borran solos con un índice TTL) |

Decisiones importantes:

- **Valores en inglés, textos en español.** En la base se guarda `gluteMed`; la interfaz muestra "Glúteo medio". Los textos salen de `GET /api/v1/meta`, así el frontend no duplica listas.
- **`activities` guarda `date` y `day`.** `date` es el instante exacto (UTC) y `day` es el día local de la persona (`"2026-09-16"`). Así el calendario y las rachas no se corren de día por la zona horaria.
- **Copias en las sesiones.** Cada ejercicio realizado guarda una copia de su nombre y músculos: editar el catálogo no cambia el historial.
- **`weightKg` automático.** Cada serie guarda su peso y unidad (`kg`/`lb`), y el modelo calcula `weightKg` para que las estadísticas comparen siempre en kg.
- **Índices creados por script.** `autoIndex` está desactivado (en Vercel se ejecutaría en cada arranque en frío); `npm run seed` los sincroniza.

## Autenticación

- **Sesión en una cookie `httpOnly`** (`fitness_session`) con un JWT firmado que dura **30 días**. El JavaScript del navegador no puede leerla, así que un script malicioso no puede robarla. `SameSite=Lax` evita que otros sitios la usen (CSRF) y en producción solo viaja por HTTPS.
- **Mismo dominio.** El frontend llama a `/api/...` en su propio dominio: en desarrollo lo reenvía el proxy de Vite y en producción lo hará un rewrite de Vercel. Así la cookie funciona también en Safari.
- **Contraseñas con bcrypt** (costo 11). Nunca se guarda la contraseña, solo su hash.
- **`tokenVersion`.** Cada token guarda la versión de sesión del usuario. Al cambiar la contraseña la versión sube y los tokens anteriores dejan de valer en todos los dispositivos.
- **Límite de intentos.** Tras 5 intentos fallidos con un mismo correo, se bloquea 15 minutos (`429`). Se guarda en MongoDB porque en Vercel las instancias no comparten memoria. El mismo límite protege el cambio de contraseña.
- **Sin pistas para atacantes.** El mensaje es siempre "Correo o contraseña incorrectos", y si el correo no existe se compara igual contra un hash falso para que el tiempo de respuesta no lo delate.
- **Sin campos extra.** Los esquemas usan `z.strictObject`: enviar `"role": "admin"` o `"plan"` responde `400`.
- **Datos por persona.** Las rutas privadas usan `requireAuth`, que deja al usuario en `req.user`, y los servicios filtran por él.

## Endpoints

Todas las rutas empiezan por `/api/v1`. 🔒 = requiere sesión.

| Método | Ruta                 | Parámetros / cuerpo                                                  | Descripción                                   |
| ------ | -------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| GET    | `/health`            | —                                                                    | Estado de la API y la base de datos (`200` / `503`) |
| GET    | `/meta`              | —                                                                    | Valores permitidos con sus textos en español  |
| POST   | `/auth/register`     | `name`, `email`, `password` (mín. 8), `timezone` (opcional)          | Crea la cuenta y sus 4 grupos iniciales, e inicia sesión (`201`) |
| POST   | `/auth/login`        | `email`, `password`                                                  | Inicia sesión (pone la cookie)                |
| POST   | `/auth/logout`       | —                                                                    | Cierra sesión (borra la cookie, `204`)        |
| GET    | `/users/me` 🔒        | —                                                                    | Persona con sesión                            |
| PATCH  | `/users/me` 🔒        | `name`, `preferences.{weightUnit, weekStartsOn, timezone, voicePhrases}` | Edita nombre y/o preferencias             |
| PATCH  | `/users/me/password` 🔒 | `currentPassword`, `newPassword`                                  | Cambia la contraseña y cierra las otras sesiones |
| GET    | `/exercises` 🔒       | `muscle`, `equipment`, `pattern`, `page` (1), `limit` (20, máx. 100) | Catálogo global + propio, paginado por nombre |
| GET    | `/exercises/:id` 🔒   | —                                                                    | Un ejercicio                                  |
| GET    | `/activity-types` 🔒  | —                                                                    | Tipos de actividad globales + propios         |
| GET    | `/phrases` 🔒         | `context` (`general`, `streak`, `record`, `sessionCompleted`)        | Frases activas globales + propias             |

### Formato de las respuestas

```jsonc
// Un elemento o una lista corta
{ "data": { ... } }

// Lista paginada
{ "data": [ ... ], "pagination": { "page": 1, "limit": 20, "total": 56, "totalPages": 3, "hasNextPage": true } }

// Error (siempre con esta forma)
{ "error": { "code": "VALIDATION_ERROR", "message": "Los datos enviados no son válidos",
             "details": [{ "field": "query.muscle", "message": "Opción inválida: ..." }] } }
```

| Código de error        | HTTP | Cuándo                                        |
| ---------------------- | ---- | --------------------------------------------- |
| `VALIDATION_ERROR`     | 400  | Parámetros o datos que no cumplen el esquema  |
| `INVALID_JSON`         | 400  | El cuerpo no es un JSON válido                |
| `INVALID_VALUE`        | 400  | Un valor no se puede convertir (ej.: un id)   |
| `UNAUTHENTICATED`      | 401  | No hay sesión, venció o ya no es válida       |
| `INVALID_CREDENTIALS`  | 401  | Correo o contraseña incorrectos               |
| `NOT_FOUND`            | 404  | La ruta o el recurso no existe                |
| `CONFLICT`             | 409  | Ya existe (ej.: correo registrado)            |
| `DUPLICATE`            | 409  | Se viola un índice único                      |
| `TOO_MANY_ATTEMPTS`    | 429  | Demasiados intentos fallidos de contraseña    |
| `PAYLOAD_TOO_LARGE`    | 413  | El cuerpo de la petición es demasiado grande  |
| `DATABASE_UNAVAILABLE` | 503  | No hay conexión con MongoDB                   |
| `INTERNAL_ERROR`       | 500  | Error inesperado (se registra en el servidor) |
