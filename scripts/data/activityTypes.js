// Tipos de actividad globales. Los colores salen de la paleta del plan (sección 7.2).
// `icon` es un nombre que el frontend traduce a un ícono.
// `isLegIntensive`: exige mucho a las piernas (activa el aviso del plan semanal).

export const activityTypes = [
  { name: 'Baile', color: '#FF6B2C', icon: 'music', usesDistance: false, isLegIntensive: false },
  { name: 'Clase grupal', color: '#FFC928', icon: 'users', usesDistance: false, isLegIntensive: false },
  { name: 'Bicicleta', color: '#12D6C5', icon: 'bike', usesDistance: true, isLegIntensive: true },
  { name: 'Patinaje', color: '#7BDC3A', icon: 'roller-skate', usesDistance: true, isLegIntensive: false },
  { name: 'Otra', color: '#8A84A3', icon: 'sparkles', usesDistance: false, isLegIntensive: false },
]
