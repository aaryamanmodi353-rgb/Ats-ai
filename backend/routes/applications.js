import express from 'express';
import { getAllApplications, createApplication, updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

router.get('/applications', getAllApplications);
router.post('/applications', createApplication);
router.patch('/applications/:id/status', updateApplicationStatus);

export default router;
