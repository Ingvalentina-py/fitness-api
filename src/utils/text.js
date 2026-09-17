// "Abducción  de Cadera" → "abduccion de cadera": minúsculas, sin tildes y con espacios simples.
// Permite que al buscar "biceps" aparezca "Bíceps".
export function normalizeForSearch(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Escapa los caracteres especiales para usar texto escrito por la persona dentro de
// una expresión regular (si no, buscar "(barra)" rompería la consulta).
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
