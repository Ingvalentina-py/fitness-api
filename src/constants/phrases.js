// Momento en que se muestra una frase motivacional
export const PHRASE_CONTEXTS = [
  { value: 'general', label: 'General' },
  { value: 'streak', label: 'Racha' },
  { value: 'record', label: 'Récord' },
  { value: 'sessionCompleted', label: 'Sesión terminada' },
]

export const PHRASE_CONTEXT_VALUES = PHRASE_CONTEXTS.map((context) => context.value)
