import Favorite from '../models/favorite.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/** GET /api/favorites — list the user's saved lawyers (Screen 5). */
export const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.userId }).populate('lawyer');
  res.json({
    success: true,
    data: {
      lawyers: favorites.map((f) => f.lawyer).filter(Boolean),
      ids: favorites.map((f) => f.lawyer?._id).filter(Boolean),
    },
  });
});

/** POST /api/favorites/:lawyerId/toggle — add/remove a favorite. */
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { lawyerId } = req.params;
  const existing = await Favorite.findOne({ user: req.userId, lawyer: lawyerId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, data: { favorited: false } });
  }
  await Favorite.create({ user: req.userId, lawyer: lawyerId });
  res.json({ success: true, data: { favorited: true } });
});
