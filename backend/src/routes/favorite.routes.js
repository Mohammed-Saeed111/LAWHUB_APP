import { Router } from 'express';
import { listFavorites, toggleFavorite } from '../controllers/favorite.controller.js';

const router = Router();
router.get('/', listFavorites);
router.post('/:lawyerId/toggle', toggleFavorite);
export default router;
