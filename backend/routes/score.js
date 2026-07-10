import express from 'express';
import { calculateScore, getScoreReportById } from '../controllers/scoreController.js';

const router = express.Router();

router.post('/score', calculateScore);
router.get('/score/:reportId', getScoreReportById);

export default router;
