// ¿Las dos listas tienen exactamente los mismos ids (en cualquier orden y sin repetidos)?
// Se usa al reordenar: la lista nueva debe incluir todos los elementos, ni uno más ni uno menos.
export function hasSameIds(expectedIds, receivedIds) {
  const expected = new Set(expectedIds.map(String))
  const received = new Set(receivedIds.map(String))

  return (
    received.size === receivedIds.length &&
    expected.size === received.size &&
    [...received].every((id) => expected.has(id))
  )
}
