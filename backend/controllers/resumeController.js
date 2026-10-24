import Resume from '../models/Resume.js';
import ResumeVersion from '../models/ResumeVersion.js';
import ScoreReport from '../models/ScoreReport.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';
import { ParserService } from '../services/parserService.js';
import { ExportService } from '../services/exportService.js';

export const getAllResumes = async (req, res) => {
  try {
    const currentUserId = req.user?._id?.toString();
    const currentUserEmail = req.user?.email?.trim().toLowerCase();

    // The account owner explicitly chose to migrate all legacy, ownerless
    // resumes into their workspace so those records can be managed normally.
    if (currentUserId) {
      await Resume.updateMany(
        { $or: [{ ownerId: { $exists: false } }, { ownerId: null }] },
        { $set: { ownerId: req.user._id } },
      );
    }

    const resumes = await Resume.find().populate({
      path: 'versions',
      options: { sort: { createdAt: -1 } },
    }).sort({ createdAt: -1 });

    const resumeResults = resumes.map((resume) => {
      const resumeData = resume.toJSON();
      const ownerId = resume.ownerId?.toString();
      delete resumeData.ownerId;
      let legacyOwnerEmail = '';

      if (!ownerId && currentUserEmail) {
        try {
          legacyOwnerEmail = JSON.parse(resume.contactJson || '{}').email?.trim().toLowerCase() || '';
        } catch {
          legacyOwnerEmail = '';
        }
      }

      return {
        ...resumeData,
        canDelete: Boolean(currentUserId && (ownerId === currentUserId || (!ownerId && legacyOwnerEmail === currentUserEmail))),
      };
    });

    res.json(resumeResults);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to retrieve resumes.' });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-ownerId').populate({
      path: 'versions',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'scoreReports', options: { sort: { createdAt: -1 } } },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to retrieve resume.' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id?.toString();
    const currentUserEmail = req.user?.email?.trim().toLowerCase();

    if (!currentUserId) {
      return res.status(401).json({ error: 'Not authorized to delete this resume.' });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid resume ID.' });
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    const ownerId = resume.ownerId?.toString();
    let isOwner = ownerId === currentUserId;

    // Older records predate ownership fields. Allow a match only when the stored
    // resume contact email exactly matches the authenticated account email.
    if (!ownerId && currentUserEmail) {
      try {
        const resumeEmail = JSON.parse(resume.contactJson || '{}').email?.trim().toLowerCase();
        isOwner = resumeEmail === currentUserEmail;
      } catch {
        isOwner = false;
      }
    }

    if (!isOwner) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    const versions = await ResumeVersion.find({ resumeId: resume._id }).select('_id');
    const versionIds = versions.map((version) => version._id);

    if (versionIds.length > 0) {
      // Preserve job applications while removing links to deleted resume versions.
      await Application.updateMany(
        { resumeVersionId: { $in: versionIds } },
        { $set: { resumeVersionId: null } },
      );
      await ScoreReport.deleteMany({ resumeVersionId: { $in: versionIds } });
      await ResumeVersion.deleteMany({ _id: { $in: versionIds } });
    }

    await Resume.deleteOne({ _id: resume._id });
    res.json({ success: true, deletedResumeId: resume._id });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume and its saved versions.' });
  }
};

export const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'Please sign in before uploading a resume.' });
    }

    let rawText = req.body?.rawText || '';
    let filename = req.file?.originalname || 'Paste_Resume.txt';

    if (req.file && !rawText) {
      if (filename.toLowerCase().endsWith('.pdf') || req.file.mimetype === 'application/pdf') {
        try {
          const pdfParse = (await import('pdf-parse')).default;
          const pdfData = await pdfParse(req.file.buffer);
          rawText = pdfData.text || '';
        } catch (pdfErr) {
          console.error('Error parsing PDF buffer:', pdfErr);
        }
      } else if (filename.toLowerCase().endsWith('.docx') || req.file.mimetype.includes('wordprocessingml')) {
        try {
          const mammoth = (await import('mammoth')).default;
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          rawText = result.value || '';
        } catch (docxErr) {
          console.error('Error parsing DOCX buffer:', docxErr);
        }
      } else {
        rawText = req.file.buffer.toString('utf-8');
      }

      // If text extraction yielded nothing or almost nothing, create a clean empty baseline structure rather than static mock data
      if (!rawText || rawText.trim().length < 20) {
        rawText = `Candidate Resume | ${filename}\nSummary: [Please edit your professional summary in the Live Editor below]\nWork Experience:\nCompany Name | Role Title | 2023-Present\n- Add your quantifiable achievements and impact bullets here.\nSkills: Professional Skills, Tools`;
      }
    }

    let structuredData;
    if (req.body?.contentJson) {
      try {
        structuredData = typeof req.body.contentJson === 'string' ? JSON.parse(req.body.contentJson) : req.body.contentJson;
      } catch (e) {
        console.error('Error parsing req.body.contentJson:', e);
      }
    }
    if (!structuredData) {
      structuredData = await ParserService.parseTextToStructuredData(rawText, filename);
    }

    // Create Resume record
    const resume = await Resume.create({
      originalFilename: filename,
      ownerId: req.user?._id,
      rawText: structuredData.rawText || rawText,
      contactJson: JSON.stringify(structuredData.contact || {}),
      layoutRisksJson: JSON.stringify(structuredData.layoutRiskWarnings || []),
    });

    // Create initial Version snapshot
    const version = await ResumeVersion.create({
      resumeId: resume._id,
      versionLabel: req.body?.title || 'v1.0 - Initial Upload',
      contentJson: JSON.stringify(structuredData),
      atsScore: null,
    });

    res.status(201).json({
      success: true,
      _id: resume._id,
      id: resume._id,
      resumeId: resume._id,
      versionId: version._id,
      structuredData,
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to ingest and parse resume document.' });
  }
};

export const updateResumeVersion = async (req, res) => {
  try {
    const { versionLabel, contentJson, atsScore } = req.body;
    const version = await ResumeVersion.findById(req.params.versionId);

    if (!version) {
      return res.status(404).json({ error: 'Resume version not found.' });
    }

    if (versionLabel) version.versionLabel = versionLabel;
    if (contentJson) version.contentJson = contentJson;
    if (atsScore !== undefined) version.atsScore = atsScore;

    await version.save();

    res.json({ success: true, version });
  } catch (error) {
    console.error('Error updating version:', error);
    res.status(500).json({ error: 'Failed to update resume version.' });
  }
};

export const exportResumeVersion = async (req, res) => {
  try {
    const { format } = req.body;
    const version = await ResumeVersion.findById(req.params.versionId);

    if (!version) {
      return res.status(404).json({ error: 'Resume version not found.' });
    }

    const resumeData = JSON.parse(version.contentJson);

    if (format === 'docx') {
      const buffer = await ExportService.generateSingleColumnDocx(resumeData);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.contact?.fullName?.replace(/\s+/g, '_') || 'Candidate'}_ATS_Resume.docx"`);
      return res.send(buffer);
    } else if (format === 'latex' || format === 'tex') {
      const latexString = ExportService.generateProfessionalLatex(resumeData);
      res.setHeader('Content-Type', 'application/x-tex');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.contact?.fullName?.replace(/\s+/g, '_') || 'Candidate'}_ATS_Resume.tex"`);
      return res.send(latexString);
    } else {
      // PDF or TXT clean stream
      const textStream = `${resumeData.contact?.fullName?.toUpperCase() || 'CANDIDATE NAME'}\n${resumeData.contact?.email || ''} | ${resumeData.contact?.phone || ''} | ${resumeData.contact?.location || ''}\n\nSUMMARY:\n${resumeData.summary || ''}\n\nSKILLS:\nHard Skills: ${(resumeData.skills?.hardSkills || []).join(', ')}\nTools: ${(resumeData.skills?.tools || []).join(', ')}\n\nEXPERIENCE:\n` +
        (resumeData.workExperience || []).map((w) => `${w.title} at ${w.company} (${w.startDate} - ${w.current ? 'Present' : w.endDate})\n` + (w.bullets || []).map((b) => `* ${b}`).join('\n')).join('\n\n');

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.contact?.fullName?.replace(/\s+/g, '_') || 'Candidate'}_ATS_Resume.txt"`);
      return res.send(textStream);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to generate exported document.' });
  }
};
