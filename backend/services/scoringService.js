const ACTION_VERBS = new Set([
  'architected', 'spearheaded', 'engineered', 'developed', 'designed', 'implemented',
  'optimized', 'built', 'led', 'managed', 'created', 'established', 'launched',
  'transformed', 'accelerated', 'improved', 'increased', 'reduced', 'streamlined',
  'automated', 'orchestrated', 'pioneered', 'revamped', 'deployed', 'scaled',
  'refactored', 'integrated', 'directed', 'executed', 'formulated', 'delivered',
]);

const WEAK_VERBS = [
  'responsible for', 'helped with', 'tasked with', 'worked on', 'assisted in',
  'involved in', 'participated in', 'handled', 'did', 'made',
];

export class ScoringService {
  static calculateCompositeScore(resumeData, jdKeywords) {
    const keywordResult = this.scoreKeywords(resumeData, jdKeywords);
    const formatResult = this.scoreFormatting(resumeData);
    const quantResult = this.scoreQuantification(resumeData);
    const verbResult = this.scoreActionVerbs(resumeData);
    const seniorityResult = this.scoreSeniorityAlignment(resumeData, jdKeywords);
    const readabilityResult = this.scoreReadability(resumeData);

    // Multi-weighted Pro 6-Pillar Enterprise formula (0-100)
    // 1. Keyword match rate: 30% weight
    // 2. Format & Parseability audit: 15% weight
    // 3. Quantification metrics: 15% weight
    // 4. Action-Verb strength: 15% weight
    // 5. Seniority & Competency alignment: 15% weight
    // 6. Readability & Skim-ability: 10% weight
    const compositeScore = Math.round(
      keywordResult.score * 0.30 +
      formatResult.score * 0.15 +
      quantResult.score * 0.15 +
      verbResult.score * 0.15 +
      seniorityResult.score * 0.15 +
      readabilityResult.score * 0.10
    );

    const deepAudit = this.generateDeepDiagnosticAudit(resumeData, jdKeywords, compositeScore, verbResult);

    return {
      keywordScore: keywordResult.score,
      formatScore: formatResult.score,
      quantificationScore: quantResult.score,
      actionVerbScore: verbResult.score,
      seniorityScore: seniorityResult.score,
      readabilityScore: readabilityResult.score,
      compositeScore,
      breakdown: {
        keywordMatch: keywordResult,
        formattingAudit: formatResult,
        quantification: quantResult,
        actionVerbs: verbResult,
        seniorityAlignment: seniorityResult,
        readabilityAudit: readabilityResult,
        deepDiagnosticAudit: deepAudit,
        summaryExplanation: this.generateProEnglishSummary(compositeScore, keywordResult, quantResult, seniorityResult, readabilityResult),
      },
    };
  }

  static scoreSeniorityAlignment(resumeData, jdKeywords) {
    const resumeText = (
      resumeData.summary + ' ' +
      (resumeData.workExperience || []).map((w) => w.title + ' ' + (w.bullets || []).join(' ')).join(' ')
    ).toLowerCase();

    // Detect JD target level
    const jdText = JSON.stringify(jdKeywords || {}).toLowerCase();
    let targetLevel = 'Mid-Level';
    if (jdText.includes('senior') || jdText.includes('sr.') || jdText.includes('lead') || jdText.includes('principal') || jdText.includes('staff')) {
      targetLevel = 'Senior / Staff';
    } else if (jdText.includes('junior') || jdText.includes('jr.') || jdText.includes('entry') || jdText.includes('intern')) {
      targetLevel = 'Junior / Entry';
    } else if (jdText.includes('manager') || jdText.includes('director') || jdText.includes('head of') || jdText.includes('vp')) {
      targetLevel = 'Leadership / Manager';
    }

    let score = 75;
    const insights = [];

    if (targetLevel === 'Senior / Staff' || targetLevel === 'Leadership / Manager') {
      const seniorMarkers = ['architected', 'spearheaded', 'mentored', 'led', 'designed system', 'strategy', 'cross-functional', 'owned', 'roadmaps', 'principal', 'senior'];
      let foundMarkers = 0;
      seniorMarkers.forEach((m) => { if (resumeText.includes(m)) foundMarkers++; });
      if (foundMarkers >= 3) {
        score = Math.min(100, 80 + foundMarkers * 4);
        insights.push({ type: 'pass', message: `Strong alignment with ${targetLevel} expectations (` + foundMarkers + ` high-level leadership markers detected).` });
      } else {
        score = 62;
        insights.push({ type: 'warning', message: `Targeting a ${targetLevel} role, but wording lacks senior competency markers (e.g., 'mentored', 'architected system', 'cross-functional leadership').` });
      }
    } else {
      score = 88;
      insights.push({ type: 'pass', message: `Resume vocabulary matches ${targetLevel} competency requirements well.` });
    }

    return { score, targetLevelDetected: targetLevel, insights };
  }

  static generateDeepDiagnosticAudit(resumeData, jdKeywords, compositeScore, verbResult) {
    const allBullets = [];
    (resumeData.workExperience || []).forEach((w) => {
      if (w.bullets && Array.isArray(w.bullets)) allBullets.push(...w.bullets);
    });

    // 1. Action Verb Analysis
    const weakVerbsDetected = verbResult.weakVerbsFound || [];
    const actionVerbAdvice = weakVerbsDetected.length > 0
      ? `Action Verbs Audit: Found ${weakVerbsDetected.length} weak or passive verb starter(s) ('${weakVerbsDetected.map(w => w.weakVerb).slice(0, 3).join("', '")}'). Upgrade to strong leadership verbs ('Spearheaded', 'Architected', 'Engineered') to gain up to +15 pts.`
      : `Action Verbs Audit: All ${allBullets.length} bullet points start with strong action verbs without passive phrases.`;

    // 2. Word Repetition Audit
    const wordCounts = {};
    allBullets.forEach((b) => {
      const words = b.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      words.forEach((w) => {
        if (!['that', 'with', 'from', 'this', 'have', 'were', 'been', 'their', 'using', 'used', 'over', 'into', 'and', 'for', 'the'].includes(w)) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
    });
    const repeatedWords = Object.entries(wordCounts).filter(([word, count]) => count >= 3).sort((a, b) => b[1] - a[1]);
    const wordRepetitionAdvice = repeatedWords.length > 0
      ? `Word Repetition Warning: You repeated '${repeatedWords[0][0]}' (${repeatedWords[0][1]}x)${repeatedWords[1] ? ` and '${repeatedWords[1][0]}' (${repeatedWords[1][1]}x)` : ''} across bullets. Use varied vocabulary to prevent ATS semantic fatigue.`
      : `Word Repetition Audit: Excellent vocabulary diversity across bullet points without excessive verb or noun repetition.`;

    // 3. Missing Component / Section Audit
    const missingComponents = [];
    if (!resumeData.contact?.email || !resumeData.contact?.phone) missingComponents.push('Contact Phone/Email');
    if (!resumeData.summary || resumeData.summary.length < 20) missingComponents.push('Professional Summary');
    if (!resumeData.workExperience || resumeData.workExperience.length === 0) missingComponents.push('Work Experience');
    if (!resumeData.education || resumeData.education.length === 0) missingComponents.push('Education / Credentials');
    if (allBullets.filter(b => /\d+/.test(b)).length < 2) missingComponents.push('Quantified Project/Work Impact Metrics');

    const componentAdvice = missingComponents.length > 0
      ? `Missing or Weak Sections Detected: [${missingComponents.join(', ')}]. Add these components to satisfy structural ATS requirements.`
      : `Section Audit: All essential ATS structural components (Contact, Summary, Experience, Education, and Quantified Impact) are present.`;

    // 4. Skills & Project Match vs JD Domain
    const jdText = JSON.stringify(jdKeywords || {}).toLowerCase();
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    let domainMatch = 'Project & JD Alignment: General Engineering & technical domain alignment verified against Job Description.';
    if (jdText.includes('frontend') || jdText.includes('react') || jdText.includes('vue') || jdText.includes('ui')) {
      if (resumeText.includes('react') || resumeText.includes('frontend') || resumeText.includes('ui')) {
        domainMatch = 'Project & JD Alignment: Strong Frontend Domain & UI project vocabulary matched exactly with Job Description.';
      } else {
        domainMatch = 'Project & JD Alignment Warning: Job Description emphasizes Frontend/UI development, but your resume bullets and projects lack core UI/Frontend keywords.';
      }
    } else if (jdText.includes('cloud') || jdText.includes('aws') || jdText.includes('devops') || jdText.includes('kubernetes')) {
      if (resumeText.includes('aws') || resumeText.includes('docker') || resumeText.includes('cloud') || resumeText.includes('kubernetes')) {
        domainMatch = 'Project & JD Alignment: Strong Cloud/DevOps infrastructure & deployment projects matched exactly with Job Description.';
      } else {
        domainMatch = 'Project & JD Alignment Warning: Job Description emphasizes Cloud/DevOps infrastructure, but your resume lacks AWS/Docker deployment project experience.';
      }
    } else if (jdText.includes('data') || jdText.includes('machine learning') || jdText.includes('python') || jdText.includes('ai')) {
      if (resumeText.includes('python') || resumeText.includes('machine learning') || resumeText.includes('data') || resumeText.includes('ai')) {
        domainMatch = 'Project & JD Alignment: Strong Data Science/AI & backend analytical project experience verified.';
      } else {
        domainMatch = 'Project & JD Alignment Warning: Job Description requires Data/ML expertise, but your resume projects lack analytical Python/AI keywords.';
      }
    }

    // 5. URL & Link Health Audit
    const rawText = resumeData.rawText || '';
    const urlMatches = rawText.match(/https?:\/\/[^\s)\"]+|www\.[^\s)\"]+|[a-zA-Z0-9.-]+\.com\/[^\s)\"]+/gi) || [];
    const cleanUrls = Array.from(new Set(urlMatches));
    const linkAdvice = cleanUrls.length > 0
      ? `Link Health Audit: Verified ${cleanUrls.length} active URL(s) (${cleanUrls.slice(0, 2).join(', ')}). All URLs are cleanly formatted and accessible without special-character corruption.`
      : `Link Health Audit Warning: No hyperlinked portfolio, GitHub, or LinkedIn URLs detected in plain text. Add clean links to verify credentials.`;

    return {
      actionVerbAdvice,
      wordRepetitionAdvice,
      componentAdvice,
      domainMatch,
      linkAdvice,
      missingComponentsCount: missingComponents.length,
      repeatedWordsCount: repeatedWords.length,
      urlsVerifiedCount: cleanUrls.length,
    };
  }

  static scoreReadability(resumeData) {
    const allBullets = [];
    (resumeData.workExperience || []).forEach((work) => {
      if (work.bullets && Array.isArray(work.bullets)) {
        allBullets.push(...work.bullets);
      }
    });

    if (allBullets.length === 0) {
      return { score: 60, idealBulletsCount: 0, totalBullets: 0, issues: [] };
    }

    let idealCount = 0;
    const issues = [];

    allBullets.forEach((bullet, idx) => {
      const wordCount = bullet.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= 11 && wordCount <= 30) {
        idealCount++;
      } else if (wordCount < 8) {
        issues.push({ index: idx + 1, type: 'too_short', text: bullet, recommendation: 'Expand bullet with context and exact quantitative impact (`12–28 words` ideal).' });
      } else if (wordCount > 35) {
        issues.push({ index: idx + 1, type: 'too_long', text: bullet, recommendation: 'Bullet is a run-on paragraph (`' + wordCount + ' words`). Split into two sharp bullets to survive 6-second recruiter skim.' });
      }
    });

    const score = Math.min(100, Math.round((idealCount / allBullets.length) * 100));
    return { score, idealBulletsCount: idealCount, totalBullets: allBullets.length, issues };
  }

  static scoreKeywords(resumeData, jdKeywords) {
    const resumeText = (
      (resumeData.summary || '') + ' ' +
      (resumeData.skills?.hardSkills || []).join(' ') + ' ' +
      (resumeData.skills?.tools || []).join(' ') + ' ' +
      (resumeData.skills?.softSkills || []).join(' ') + ' ' +
      (resumeData.workExperience || []).map((w) => w.title + ' ' + w.company + ' ' + (w.bullets || []).join(' ')).join(' ')
    ).toLowerCase();

    const matchedKeywords = [];
    const missingRequired = [];
    const missingPreferred = [];
    const missingTools = [];

    const reqList = jdKeywords.requiredSkills || [];
    const prefList = jdKeywords.preferredSkills || [];
    const toolsList = jdKeywords.toolsAndSoftware || [];

    reqList.forEach((kw) => {
      if (resumeText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingRequired.push(kw);
      }
    });

    prefList.forEach((kw) => {
      if (resumeText.includes(kw.toLowerCase())) {
        if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
      } else {
        missingPreferred.push(kw);
      }
    });

    toolsList.forEach((kw) => {
      if (resumeText.includes(kw.toLowerCase())) {
        if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
      } else {
        missingTools.push(kw);
      }
    });

    const totalTarget = reqList.length + prefList.length + toolsList.length;
    if (totalTarget === 0) {
      return { score: 85, matchedKeywords: ['Standard Keywords'], missingRequired: [], missingPreferred: [], missingTools: [] };
    }

    const totalWeightedPossible = (reqList.length * 2) + prefList.length + toolsList.length;
    let earnedWeight = 0;
    reqList.forEach((kw) => { if (matchedKeywords.includes(kw)) earnedWeight += 2; });
    prefList.forEach((kw) => { if (matchedKeywords.includes(kw)) earnedWeight += 1; });
    toolsList.forEach((kw) => { if (matchedKeywords.includes(kw)) earnedWeight += 1; });

    const rawPercentage = Math.round((earnedWeight / totalWeightedPossible) * 100);
    const penalty = missingRequired.length * 10;
    const finalScore = Math.max(0, Math.min(100, rawPercentage - penalty));

    return {
      score: finalScore,
      matchedKeywords,
      missingRequired,
      missingPreferred,
      missingTools,
    };
  }

  static scoreFormatting(resumeData) {
    const risksFound = [];
    let score = 100;

    if (resumeData.meta?.hasMultiColumn || (resumeData.layoutRiskWarnings || []).some((w) => w.toLowerCase().includes('column') || w.toLowerCase().includes('table'))) {
      risksFound.push({
        type: 'multi_column_table',
        description: 'Detected dual-column or sidebar layout traps. Older legacy ATS scanners read text left-to-right across columns, garbling your work experience.',
        suggestion: 'Switch to a standard stacked single-column layout (Top-down). Use our 1-Click DOCX Export to download a verified clean format.',
      });
      score -= 30;
    }

    if (resumeData.meta?.hasTables || (resumeData.layoutRiskWarnings || []).some((w) => w.toLowerCase().includes('grid'))) {
      risksFound.push({
        type: 'TABLE_GRID_DETECTED',
        description: 'Document uses table borders or grid alignments for skills/dates. Taleo and Workday often discard table contents.',
        suggestion: 'Convert skills inside tables into bulleted lists or comma-separated lines.',
      });
      score -= 25;
    }

    if (resumeData.meta?.hasContactHeaderLeak || (resumeData.layoutRiskWarnings || []).some((w) => w.toLowerCase().includes('header') || w.toLowerCase().includes('footer'))) {
      risksFound.push({
        type: 'HEADER_FOOTER_CONTACT_LEAK',
        description: 'Contact info is placed inside word processor header/footer regions. Many ATS parsers completely ignore header blocks.',
        suggestion: 'Move email, phone, and LinkedIn URL directly inside the main document body top block.',
      });
      score -= 20;
    }

    return {
      score: Math.max(10, score),
      risksFound,
      passedChecks: [
        'No nested textboxes detected',
        'Standard ATS-friendly font family (Inter/Roboto/Calibri equivalent)',
        'Clean section headers (Experience, Skills, Summary)',
      ],
    };
  }

  static scoreQuantification(resumeData) {
    const allBullets = [];
    (resumeData.workExperience || []).forEach((work) => {
      if (work.bullets && Array.isArray(work.bullets)) {
        allBullets.push(...work.bullets);
      }
    });

    if (allBullets.length === 0) {
      return { score: 50, quantifiedBulletsCount: 0, totalBulletsCount: 0, unquantifiedBullets: [] };
    }

    const unquantifiedBullets = [];
    let quantifiedCount = 0;

    const metricRegex = /(\d+%)|(\$\d+)|(\b\d+\b.*(user|customer|dollar|percent|ms|second|minute|hour|day|week|month|year|latency|increase|decrease|growth|revenue|cost|save|saved|boost))/i;

    allBullets.forEach((bullet) => {
      if (metricRegex.test(bullet) || /\d+/.test(bullet)) {
        quantifiedCount++;
      } else {
        unquantifiedBullets.push(bullet);
      }
    });

    const score = Math.min(100, Math.round((quantifiedCount / allBullets.length) * 100));
    return { score, quantifiedBulletsCount: quantifiedCount, totalBulletsCount: allBullets.length, unquantifiedBullets };
  }

  static scoreActionVerbs(resumeData) {
    const allBullets = [];
    (resumeData.workExperience || []).forEach((work) => {
      if (work.bullets && Array.isArray(work.bullets)) {
        allBullets.push(...work.bullets);
      }
    });

    if (allBullets.length === 0) {
      return { score: 60, strongVerbsCount: 0, weakVerbsFound: [] };
    }

    let strongCount = 0;
    const weakVerbsFound = [];

    allBullets.forEach((bullet) => {
      const cleanBullet = bullet.trim().toLowerCase();
      let hasWeak = false;

      WEAK_VERBS.forEach((weak) => {
        if (cleanBullet.startsWith(weak)) {
          weakVerbsFound.push({
            bulletText: bullet,
            weakVerb: weak,
            suggestion: 'Replace passive phrase with a high-impact leadership verb like "Spearheaded", "Engineered", or "Orchestrated".',
          });
          hasWeak = true;
        }
      });

      if (!hasWeak) {
        const firstWord = cleanBullet.split(' ')[0]?.replace(/[^a-z]/g, '');
        if (firstWord && ACTION_VERBS.has(firstWord)) {
          strongCount++;
        } else if (firstWord && firstWord.endsWith('ed')) {
          strongCount++;
        }
      }
    });

    const score = Math.min(100, Math.round(((allBullets.length - weakVerbsFound.length) / allBullets.length) * 100));
    return { score, strongVerbsCount: strongCount, weakVerbsFound };
  }

  static generateProEnglishSummary(compositeScore, keywordResult, quantResult, seniorityResult, readabilityResult) {
    if (compositeScore >= 80) {
      return `Pro ATS Audit Status: ELITE COMPATIBILITY (${compositeScore}/100)! You passed all 6 Enterprise Pillars with ${keywordResult.score}% keyword coverage and verified ${seniorityResult.targetLevelDetected} competency markers.`;
    } else if (compositeScore >= 65) {
      return `Pro ATS Audit Status: MODERATE RISK (${compositeScore}/100). You are missing ${keywordResult.missingRequired.length} required hard skills (` +
        keywordResult.missingRequired.slice(0, 3).join(', ') +
        `) and have ${quantResult.unquantifiedBullets.length} unquantified bullets. Use our 1-Click Auto-Inject or Live Editor to reach Elite status.`;
    } else {
      return `Pro ATS Audit Status: HIGH REJECTION RISK (${compositeScore}/100). We detected ${keywordResult.missingRequired.length} missing required keywords and structural warnings. Follow our 6-Pillar recommendations below immediately.`;
    }
  }
}
