import express from 'express';
import { calculateScore, getScoreReportById } from '../controllers/scoreController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/score', protect, calculateScore);
router.get('/score/:reportId', optionalAuth, getScoreReportById);

export default router;
