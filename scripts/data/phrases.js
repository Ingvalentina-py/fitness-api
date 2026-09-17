// Frases motivacionales del sistema, cortas y originales.
// context: cuándo se muestran (ver src/constants/phrases.js).

const general = [
  'Tú puedes.',
  'Hoy suma.',
  'Una serie a la vez.',
  'Llegaste. Eso ya es ganar.',
  'Cada repetición cuenta.',
  'La constancia le gana a la motivación.',
  'Lo que hoy cuesta, mañana es tu base.',
  'Tu cuerpo escucha todo lo que haces por él.',
  'Hoy no tiene que ser perfecto, tiene que ser tuyo.',
  'Muévete por cómo te hace sentir.',
  'Pequeños pasos, grandes cambios.',
  'Entrena con ganas, descansa sin culpa.',
  'La energía se crea moviéndose.',
  'Respira, enfócate y dale.',
  'Tu ritmo, tus reglas.',
  'Más fuerte que ayer.',
  'Disfruta el camino: el resultado llega.',
  'Hoy es un buen día para sumar.',
]

const streak = [
  '¡Racha encendida! No la sueltes.',
  'Otro día más en tu racha. Así se construye.',
  'La constancia se nota: sigue sumando días.',
  'Tu racha habla por ti.',
  'Día tras día, esto ya es un hábito.',
]

const record = [
  '¡Nuevo récord! Te superaste.',
  'Hoy levantaste más que nunca.',
  'Récord personal: tu esfuerzo dio frutos.',
  'Subiste la vara. ¡Qué nivel!',
  'Tu antiguo límite ahora es tu punto de partida.',
]

const sessionCompleted = [
  '¡Sesión terminada! Buen trabajo.',
  'Lo hiciste. Ahora a recuperar.',
  'Otra sesión en la bolsa.',
  'Misión cumplida por hoy.',
  'Entrenaste, sumaste, ganaste.',
  'Te lo prometiste y cumpliste.',
  '¡Qué sesión! Descansa, te lo ganaste.',
]

const withContext = (context) => (text) => ({ text, context })

export const phrases = [
  ...general.map(withContext('general')),
  ...streak.map(withContext('streak')),
  ...record.map(withContext('record')),
  ...sessionCompleted.map(withContext('sessionCompleted')),
]
