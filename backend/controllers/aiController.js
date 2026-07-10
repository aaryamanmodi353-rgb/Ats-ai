import JobDescription from '../models/JobDescription.js';
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
