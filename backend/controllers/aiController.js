import JobDescription from '../models/JobDescription.js';
import ResumeVersion from '../models/ResumeVersion.js';
import { AIService } from '../services/aiService.js';

export const generateRewrites = async (req, res) => {
  try {
    const { bulletText, company, title, jobDescriptionId, apiKey } = req.body;

    if (!bulletText) {
      return res.status(400).json({ error: 'bulletText is required.' });
    }

    let jdKeywords = null;
    if (jobDescriptionId) {
      const jd = await JobDescription.findById(jobDescriptionId);
      if (jd && jd.extractedKeywordsJson) {
        jdKeywords = JSON.parse(jd.extractedKeywordsJson);
      }
    }

    const suggestions = await AIService.generateBulletRewrites({
      bulletText,
      company: company || 'Company',
      title: title || 'Engineer',
      jdKeywords,
      apiKey: apiKey || null,
    });

    res.json({
      success: true,
      rewrites: suggestions.rewrites || [],
      unsupportedRequirementsFlagged: suggestions.unsupportedRequirementsFlagged || [],
    });
  } catch (error) {
    console.error('AI Rewrite Controller Error:', error);
    res.status(500).json({ error: 'Failed to generate bullet point rewrites.' });
  }
};

export const optimizeResumeVocabularyAndVerbs = async (req, res) => {
  try {
    const { resumeVersionId, jobDescriptionId } = req.body;
    if (!resumeVersionId) {
      return res.status(400).json({ error: 'resumeVersionId is required.' });
    }

    const version = await ResumeVersion.findById(resumeVersionId);
    if (!version) {
      return res.status(404).json({ error: 'Resume version not found.' });
    }

    let jdKeywords = null;
    if (jobDescriptionId) {
      const jd = await JobDescription.findById(jobDescriptionId);
      if (jd && jd.extractedKeywordsJson) {
        jdKeywords = JSON.parse(jd.extractedKeywordsJson);
      }
    }

    const resumeData = JSON.parse(version.contentJson);
    const result = AIService.optimizeBulletsVocabularyAndVerbs(resumeData, jdKeywords);

    if (result.changesCount > 0) {
      version.contentJson = JSON.stringify(result.updatedResumeData);
      version.versionLabel = `${version.versionLabel || 'v1.0'} + Pro Verbs & Words`;
      await version.save();
    }

    res.json({
      success: true,
      changesCount: result.changesCount,
      log: result.log,
      updatedResumeData: result.updatedResumeData,
    });
  } catch (error) {
    console.error('Error optimizing resume vocabulary and verbs:', error);
    res.status(500).json({ error: 'Failed to optimize resume vocabulary and verbs.' });
  }
};
