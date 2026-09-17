// Cuántos documentos saltar para llegar a la página pedida
export function getSkip({ page, limit }) {
  return (page - 1) * limit
}

// Forma estándar de las respuestas con listas paginadas
export function paginated(items, { page, limit, total }) {
  const totalPages = Math.ceil(total / limit)

  return {
    data: items,
    pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages },
  }
}
