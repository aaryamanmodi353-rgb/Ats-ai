import express from 'express';
import { generateRewrites } from '../controllers/aiController.js';

const router = express.Router();

router.post('/rewrite-suggestions', generateRewrites);

export default router;
