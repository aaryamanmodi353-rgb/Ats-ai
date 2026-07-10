import express from 'express';
import { getAllApplications, createApplication, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/applications', protect, getAllApplications);
router.post('/applications', protect, createApplication);
router.patch('/applications/:id/status', protect, updateApplicationStatus);

export default router;
