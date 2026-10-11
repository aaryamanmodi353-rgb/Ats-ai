import { describe, it, expect } from 'vitest';
import { AIService } from '../services/aiService.js';

describe('AIService with Groq and Simulation Guardrails', () => {
  const sampleBullet = 'Responsible for developing the customer dashboard using React and Node.js.';
  const sampleJD = {
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  };

  it('generates simulated bullet rewrites with anti-hallucination guardrails when no key is set', async () => {
    const result = await AIService.generateBulletRewrites({
      bulletText: sampleBullet,
      company: 'TechCorp',
      title: 'Full Stack Engineer',
      jdKeywords: sampleJD,
      apiKey: null,
    });

    expect(result).toBeDefined();
    expect(result.rewrites).toBeInstanceOf(Array);
    expect(result.rewrites.length).toBeGreaterThan(0);
    // Anti-fabrication check: because the original bullet has no metric, a metric prompt must be provided
    expect(result.rewrites[0].promptForMetric).toBeTruthy();
    expect(result.unsupportedRequirementsFlagged.length).toBeGreaterThan(0);
  });

  it('retains candidate metrics when numbers are present in the original bullet', async () => {
    const bulletWithNumbers = 'Architected high-throughput API endpoints reducing latency by 45%.';
    const result = await AIService.generateBulletRewrites({
      bulletText: bulletWithNumbers,
      company: 'CloudTech',
      title: 'Senior Engineer',
      jdKeywords: sampleJD,
      apiKey: null,
    });

    expect(result.rewrites[0].promptForMetric).toBeNull();
    expect(result.rewrites[0].rewrittenText).toContain('45%');
  });

  it('optimizes vocabulary and replaces repetitive verbs deterministically', () => {
    const resumeData = {
      workExperience: [
        {
          title: 'Senior Engineer',
          bullets: [
            'Responsible for leading the migration of legacy services.',
            'Developed frontend applications and developed backend databases.',
          ],
        },
      ],
    };

    const optimization = AIService.optimizeBulletsVocabularyAndVerbs(resumeData, sampleJD);
    expect(optimization.changesCount).toBeGreaterThan(0);
    expect(optimization.updatedResumeData.workExperience[0].bullets[0]).not.toMatch(/^Responsible for/i);
    expect(optimization.log.length).toBeGreaterThan(0);
  });
});
