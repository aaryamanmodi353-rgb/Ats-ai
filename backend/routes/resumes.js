import express from 'express';
import multer from 'multer';
import {
  getAllResumes,
  getResumeById,
  uploadAndParseResume,
  updateResumeVersion,
  exportResumeVersion,
} from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.get('/resumes', getAllResumes);
router.get('/resumes/:id', getResumeById);
router.post('/resumes', upload.single('file'), uploadAndParseResume);
router.put('/resume-versions/:versionId', updateResumeVersion);
router.post('/resume-versions/:versionId/export', exportResumeVersion);

export default router;
