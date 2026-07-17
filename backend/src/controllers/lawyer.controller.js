import Lawyer from '../models/lawyer.model.js';
import Review from '../models/review.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/lawyers
 * Powers Home top-lawyers (Screen 1), Map pins (Screen 2) and Search (Screen 3).
 * Query: q, specialty, city, minRating, minExp, maxRate, sort, page, limit
 */
export const listLawyers = asyncHandler(async (req, res) => {
  const {
    q, specialty, city, minRating, minExp, maxRate,
    sort = 'rating', page = 1, limit = 24,
  } = req.query;

  const filter = {};
  if (specialty) filter.specialties = specialty;
  if (city) filter.city = city;
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (minExp) filter.experience = { $gte: Number(minExp) };
  if (maxRate) filter.hourlyRate = { ...(filter.hourlyRate || {}), $lte: Number(maxRate) };
  if (q) {
    const rx = new RegExp(q, 'i');
    filter.$or = [{ name: rx }, { title: rx }, { specialties: rx }, { area: rx }];
  }

  const sortMap = {
    rating: { rating: -1 },
    experience: { experience: -1 },
    price_asc: { hourlyRate: 1 },
    price_desc: { hourlyRate: -1 },
  };

  const total = await Lawyer.countDocuments(filter);
  const lawyers = await Lawyer.find(filter)
    .sort(sortMap[sort] || { rating: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, data: { lawyers, total, page: Number(page), pages: Math.ceil(total / limit) } });
});

/** GET /api/lawyers/:id — full profile (Screen 4). */
export const getLawyer = asyncHandler(async (req, res) => {
  const lawyer = await Lawyer.findById(req.params.id);
  if (!lawyer) throw ApiError.notFound('Lawyer not found.');
  res.json({ success: true, data: { lawyer } });
});

/** GET /api/lawyers/:id/reviews — reviews for a lawyer (Screen 4). */
export const getLawyerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ lawyer: req.params.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { reviews } });
});
