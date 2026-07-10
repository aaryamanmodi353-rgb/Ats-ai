import express from 'express';
import { generateRewrites } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/rewrite-suggestions', protect, generateRewrites);

export default router;
