import express from 'express';
import multer from 'multer';
import {
  getAllResumes,
  getResumeById,
  deleteResume,
  uploadAndParseResume,
  createResumeVersion,
  updateResumeVersion,
  exportResumeVersion,
} from '../controllers/resumeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.get('/resumes', optionalAuth, getAllResumes);
router.get('/resumes/:id', optionalAuth, getResumeById);
router.delete('/resumes/:id', protect, deleteResume);
router.post('/resumes', protect, upload.single('file'), uploadAndParseResume);
router.post('/resumes/:id/versions', protect, createResumeVersion);
router.put('/resume-versions/:versionId', protect, updateResumeVersion);
router.post('/resume-versions/:versionId/export', protect, exportResumeVersion);

export default router;
