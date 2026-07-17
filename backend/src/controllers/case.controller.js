import Case from '../models/case.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/** GET /api/cases — the user's legal cases (Screen 8; empty → Screen 9). */
export const listCases = asyncHandler(async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.status) filter.status = req.query.status;
  const cases = await Case.find(filter).sort({ updatedAt: -1 });
  res.json({ success: true, data: { cases } });
});
