import express from 'express';
import { generateRewrites, optimizeResumeVocabularyAndVerbs } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/rewrite-suggestions', protect, generateRewrites);
router.post('/optimize-bullets', protect, optimizeResumeVocabularyAndVerbs);

export default router;
