import { describe, it, expect } from 'vitest';
import { ScoringService } from '../services/scoringService.js';

describe('ScoringService Pure JavaScript Engine', () => {
  const sampleResume = {
    contact: { fullName: 'Test Candidate', email: 'test@example.com', phone: '555-000-1111', location: 'New York, NY' },
    summary: 'Senior Software Engineer specializing in React, TypeScript, and Node.js backend systems.',
    workExperience: [
      {
        id: '1',
        company: 'Tech Corp',
        title: 'Senior Developer',
        location: 'NYC',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected customer analytics module in React and TypeScript, reducing load time by 35%.',
          'Spearheaded migration to PostgreSQL and Redis, saving $12,000 annually.',
          'Responsible for daily standups and basic documentation updates.',
        ],
      },
    ],
    education: [],
    skills: {
      hardSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      softSkills: ['Teamwork'],
      tools: ['Git', 'Docker', 'Redis'],
    },
    rawText: 'React TypeScript Node.js PostgreSQL Docker Redis',
    layoutRiskWarnings: ['Detected 2-column header table structure.'],
  };

  const sampleJD = {
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    preferredSkills: ['Redis', 'Tailwind CSS'],
    toolsAndSoftware: ['Git', 'Docker', 'Kubernetes'],
    softSkills: ['Communication'],
    highWeightPhrases: ['analytics module'],
  };

  it('accurately calculates keyword match score and flags missing required keywords like AWS', () => {
    const result = ScoringService.calculateCompositeScore(sampleResume, sampleJD);
    expect(result.breakdown.keywordMatch.missingRequired).toContain('AWS');
    expect(result.breakdown.keywordMatch.matchedKeywords).toContain('React');
    expect(result.breakdown.keywordMatch.matchedKeywords).toContain('TypeScript');
    expect(result.keywordScore).toBeGreaterThan(60);
  });

  it('penalizes format score when multi-column layout warnings exist', () => {
    const result = ScoringService.calculateCompositeScore(sampleResume, sampleJD);
    expect(result.formatScore).toBeLessThan(100);
    expect(result.breakdown.formattingAudit.risksFound.some((r) => r.type === 'multi_column_table')).toBe(true);
  });

  it('calculates quantification score based on regex matches for percentages and dollar amounts', () => {
    const result = ScoringService.calculateCompositeScore(sampleResume, sampleJD);
    expect(result.breakdown.quantification.quantifiedBulletsCount).toBe(2);
    expect(result.breakdown.quantification.totalBulletsCount).toBe(3);
    expect(result.quantificationScore).toBe(Math.round((2 / 3) * 100));
  });

  it('detects weak passive verbs ("responsible for") and counts strong verbs ("Architected", "Spearheaded")', () => {
    const result = ScoringService.calculateCompositeScore(sampleResume, sampleJD);
    const weakVerbs = result.breakdown.actionVerbs.weakVerbsFound;
    expect(weakVerbs.some((w) => w.weakVerb === 'responsible for')).toBe(true);
    expect(result.breakdown.actionVerbs.strongVerbsCount).toBe(2);
  });
});
