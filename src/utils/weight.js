const KG_PER_LB = 0.45359237

// Convierte un peso a kg con 2 decimales. Las estadísticas siempre comparan en kg,
// aunque cada serie se registre en la unidad que tenga la máquina.
export function toKg(weight, unit) {
  const kilograms = unit === 'lb' ? weight * KG_PER_LB : weight
  return Math.round(kilograms * 100) / 100
}
