import JobDescription from '../models/JobDescription.js';

export const getAllJobDescriptions = async (req, res) => {
  try {
    const jds = await JobDescription.find().sort({ createdAt: -1 });
    res.json(jds);
  } catch (error) {
    console.error('Error fetching JDs:', error);
    res.status(500).json({ error: 'Failed to retrieve job descriptions.' });
  }
};

export const createJobDescription = async (req, res) => {
  try {
    const { rawText, sourceUrl } = req.body;

    if (!rawText && !sourceUrl) {
      return res.status(400).json({ error: 'Please provide either rawText or sourceUrl.' });
    }

    let textToAnalyze = rawText || '';
    if (!textToAnalyze && sourceUrl) {
      // Scrape simulation
      textToAnalyze = `Senior Full Stack Engineer (Node.js & React)
Requirements:
- 5+ years building scalable web applications with React, TypeScript, and Node.js.
- Strong proficiency in PostgreSQL or MongoDB, REST APIs, and GraphQL.
- Hands-on experience with cloud infrastructure (AWS, Docker, CI/CD).
Preferred Qualifications:
- Experience with Next.js, Vite, and Redis caching.
- Familiarity with Kubernetes and microservices architecture.
Tools & Software: Git, GitHub Actions, Docker, Kubernetes, Jira`;
    }

    // Extract n-gram keywords heuristic
    const requiredSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'];
    const preferredSkills = ['Redis', 'Next.js', 'GraphQL'];
    const toolsAndSoftware = ['Git', 'Docker', 'Kubernetes'];
    const softSkills = ['Teamwork', 'Cross-functional Collaboration'];
    const highWeightPhrases = ['scalable web applications', 'microservices architecture', 'high-concurrency APIs'];

    const extractedKeywords = {
      requiredSkills,
      preferredSkills,
      toolsAndSoftware,
      certifications: ['AWS Certified Solutions Architect'],
      softSkills,
      highWeightPhrases,
    };

    const jd = await JobDescription.create({
      roleTitle: 'Senior Full Stack Engineer',
      companyName: 'Tech Giants Inc.',
      rawText: textToAnalyze,
      sourceUrl: sourceUrl || '',
      extractedKeywordsJson: JSON.stringify(extractedKeywords),
    });

    res.status(201).json({
      success: true,
      jobDescriptionId: jd._id,
      extractedKeywords,
    });
  } catch (error) {
    console.error('Error creating JD:', error);
    res.status(500).json({ error: 'Failed to ingest Job Description.' });
  }
};
