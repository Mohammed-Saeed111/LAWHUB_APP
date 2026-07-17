import Category from '../models/category.model.js';
import Article from '../models/article.model.js';
import Lawyer from '../models/lawyer.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/** GET /api/categories — legal categories with counts (Screens 1 & 3). */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ count: -1 });
  res.json({ success: true, data: { categories } });
});

/** GET /api/cities — distinct cities that actually have lawyers (Screen 3 filter). */
export const getCities = asyncHandler(async (req, res) => {
  const cities = await Lawyer.distinct('city');
  res.json({ success: true, data: { cities: cities.filter(Boolean).sort() } });
});

/** GET /api/articles — latest legal articles (Screen 1). */
export const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 }).limit(10);
  res.json({ success: true, data: { articles } });
});
