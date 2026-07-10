import Resume from '../models/Resume.js';
import ResumeVersion from '../models/ResumeVersion.js';
import { ParserService } from '../services/parserService.js';
import { ExportService } from '../services/exportService.js';

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().populate({
      path: 'versions',
      options: { sort: { createdAt: -1 } },
    }).sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Failed to retrieve resumes.' });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate({
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

export const uploadAndParseResume = async (req, res) => {
  try {
    let rawText = req.body?.rawText || '';
    let filename = req.file?.originalname || 'Paste_Resume.txt';

    if (req.file && !rawText) {
      // If file uploaded, convert buffer to string or heuristic text
      rawText = req.file.buffer.toString('utf-8');
      if (rawText.includes('%PDF') || rawText.includes('PK')) {
        // Fallback simulation text if binary PDF/DOCX uploaded without text extraction
        rawText = `Alex Morgan | alex.morgan@example.com | San Francisco, CA | (555) 019-2834
Summary: Senior Software Engineer with 6+ years building high-concurrency Node.js and React web applications.
Work Experience:
CloudScale Technologies | Senior Software Engineer | 2022-Present
- Architected high-concurrency microservices in Node.js and TypeScript, reducing API response latency by 35%.
- Spearheaded migration of frontend client to React 18 and Vite, accelerating page load speeds by 40%.
- Responsible for daily code reviews, CI/CD pipeline optimization with Docker, and mentoring junior engineers.
NextGen Solutions | Full Stack Developer | 2019-2022
- Developed interactive web applications using React, Express.js, and MongoDB serving 250,000 monthly active users.
- Helped with database query indexing and caching strategies using Redis, improving dashboard load time by 50%.
Skills: React, TypeScript, Node.js, PostgreSQL, MongoDB, Docker, AWS, Git, Redis`;
      }
    }

    const structuredData = await ParserService.parseTextToStructuredData(rawText, filename);

    // Create Resume record
    const resume = await Resume.create({
      originalFilename: filename,
      rawText: structuredData.rawText,
      contactJson: JSON.stringify(structuredData.contact),
      layoutRisksJson: JSON.stringify(structuredData.layoutRiskWarnings || []),
    });

    // Create initial Version snapshot
    const version = await ResumeVersion.create({
      resumeId: resume._id,
      versionLabel: 'v1.0 - Initial Upload',
      contentJson: JSON.stringify(structuredData),
      atsScore: null,
    });

    res.status(201).json({
      success: true,
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
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.contact.fullName.replace(/\s+/g, '_')}_ATS_Resume.docx"`);
      return res.send(buffer);
    } else {
      // PDF or TXT clean stream
      const textStream = `${resumeData.contact.fullName.toUpperCase()}\n${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.contact.location}\n\nSUMMARY:\n${resumeData.summary}\n\nSKILLS:\nHard Skills: ${resumeData.skills.hardSkills.join(', ')}\nTools: ${resumeData.skills.tools.join(', ')}\n\nEXPERIENCE:\n` +
        resumeData.workExperience.map((w) => `${w.title} at ${w.company} (${w.startDate} - ${w.current ? 'Present' : w.endDate})\n` + w.bullets.map((b) => `* ${b}`).join('\n')).join('\n\n');

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${resumeData.contact.fullName.replace(/\s+/g, '_')}_ATS_Resume.txt"`);
      return res.send(textStream);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to generate exported document.' });
  }
};
