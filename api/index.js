// Punto de entrada en Vercel. Cada petición llega aquí como una función serverless:
// se reutiliza la misma app de Express que corre en local (src/app.js), y la conexión
// a MongoDB se abre una sola vez por instancia (ver src/config/database.js).
export { default } from '../src/app.js'
