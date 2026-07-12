import ResumeVersion from '../models/ResumeVersion.js';
import JobDescription from '../models/JobDescription.js';
import ScoreReport from '../models/ScoreReport.js';
import { ScoringService } from '../services/scoringService.js';

export const calculateScore = async (req, res) => {
  try {
    const { resumeVersionId, jobDescriptionId } = req.body;

    if (!resumeVersionId || !jobDescriptionId) {
      return res.status(400).json({ error: 'resumeVersionId and jobDescriptionId are required.' });
    }

    const version = await ResumeVersion.findById(resumeVersionId);
    const jd = await JobDescription.findById(jobDescriptionId);

    if (!version || !jd) {
      return res.status(404).json({ error: 'Resume version or Job Description not found.' });
    }

    const resumeData = JSON.parse(version.contentJson);
    const jdKeywords = JSON.parse(jd.extractedKeywordsJson);

    // Calculate deterministic 4-pillar score
    const scoreResult = ScoringService.calculateCompositeScore(resumeData, jdKeywords);

    // Create ScoreReport snapshot
    const scoreReport = await ScoreReport.create({
      resumeVersionId,
      jobDescriptionId,
      keywordScore: scoreResult.keywordScore,
      formatScore: scoreResult.formatScore,
      quantificationScore: scoreResult.quantificationScore,
      actionVerbScore: scoreResult.actionVerbScore,
      seniorityScore: scoreResult.seniorityScore || 80,
      readabilityScore: scoreResult.readabilityScore || 85,
      compositeScore: scoreResult.compositeScore,
      breakdownJson: JSON.stringify(scoreResult.breakdown),
    });

    // Update snapshot score on version
    version.atsScore = scoreResult.compositeScore;
    await version.save();

    res.status(201).json({
      success: true,
      reportId: scoreReport._id,
      compositeScore: scoreResult.compositeScore,
      breakdown: scoreResult.breakdown,
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({ error: 'Failed to calculate ATS compatibility score.' });
  }
};

export const getScoreReportById = async (req, res) => {
  try {
    const report = await ScoreReport.findById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ error: 'Score report not found.' });
    }

    res.json({
      reportId: report._id,
      resumeVersionId: report.resumeVersionId,
      jobDescriptionId: report.jobDescriptionId,
      keywordScore: report.keywordScore,
      formatScore: report.formatScore,
      quantificationScore: report.quantificationScore,
      actionVerbScore: report.actionVerbScore,
      seniorityScore: report.seniorityScore || 80,
      readabilityScore: report.readabilityScore || 85,
      compositeScore: report.compositeScore,
      breakdown: JSON.parse(report.breakdownJson),
      createdAt: report.createdAt,
    });
  } catch (error) {
    console.error('Error fetching score report:', error);
    res.status(500).json({ error: 'Failed to retrieve score report.' });
  }
};
