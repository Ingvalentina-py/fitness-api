import * as phraseService from '../services/phrase.service.js'

// GET /api/v1/phrases
export async function listPhrases(req, res) {
  const phrases = await phraseService.listPhrases(req.validated.query)

  res.json({ data: phrases })
}
