import { Router } from 'express';
import { getCategories, getCities, getArticles } from '../controllers/meta.controller.js';

const router = Router();
router.get('/categories', getCategories);
router.get('/cities', getCities);
router.get('/articles', getArticles);
export default router;
