import express from 'express';
import { getAllJobDescriptions, createJobDescription } from '../controllers/jobDescriptionController.js';

const router = express.Router();

router.get('/job-descriptions', getAllJobDescriptions);
router.post('/job-descriptions', createJobDescription);

export default router;
