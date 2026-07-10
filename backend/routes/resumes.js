import express from 'express';
import multer from 'multer';
import {
  getAllResumes,
  getResumeById,
  uploadAndParseResume,
  updateResumeVersion,
  exportResumeVersion,
} from '../controllers/resumeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.get('/resumes', optionalAuth, getAllResumes);
router.get('/resumes/:id', optionalAuth, getResumeById);
router.post('/resumes', protect, upload.single('file'), uploadAndParseResume);
router.put('/resume-versions/:versionId', protect, updateResumeVersion);
router.post('/resume-versions/:versionId/export', protect, exportResumeVersion);

export default router;
