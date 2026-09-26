import * as phraseService from '../services/phrase.service.js'

// GET /api/v1/phrases
export async function listPhrases(req, res) {
  const phrases = await phraseService.listPhrases(req.user._id, req.validated.query)

  res.json({ data: phrases })
}

// POST /api/v1/phrases
export async function createPhrase(req, res) {
  const phrase = await phraseService.createPhrase(req.user._id, req.validated.body)

  res.status(201).json({ data: phrase })
}

// PATCH /api/v1/phrases/:id
export async function updatePhrase(req, res) {
  const phrase = await phraseService.updatePhrase(
    req.user._id,
    req.validated.params.id,
    req.validated.body,
  )

  res.json({ data: phrase })
}

// DELETE /api/v1/phrases/:id
export async function deletePhrase(req, res) {
  await phraseService.deletePhrase(req.user._id, req.validated.params.id)

  res.status(204).end()
}
