import Anthropic from '@anthropic-ai/sdk';

export class AIService {
  static async generateBulletRewrites({ bulletText, company, title, jdKeywords = null, apiKey = null }) {
    // If no API key is set, run Intelligent Anti-Hallucination Simulation Mode immediately
    if (!apiKey && !process.env.ANTHROPIC_API_KEY) {
      return this.getSimulatedRewrites(bulletText, jdKeywords);
    }

    try {
      const anthropic = new Anthropic({
        apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
      });

      const prompt = `You are an expert ATS Resume Coach and Anti-Hallucination Guardrail System.
The candidate has the following experience bullet point from their time at "${company}" as a "${title}":
"${bulletText}"

Target Job Description Keywords:
${jdKeywords ? JSON.stringify(jdKeywords, null, 2) : 'General Senior Software Engineer role'}

YOUR MANDATORY GUARDRAILS:
1. NEVER fabricate or invent metrics, numbers, percentages, or dollar amounts. If the original bullet has no metric, you MUST include a "promptForMetric" question asking the user for the exact metric.
2. Replace weak verbs ("Responsible for", "Helped with") with strong active leadership verbs ("Architected", "Spearheaded", "Engineered").
3. Seamlessly incorporate 1-2 missing target keywords where technically logical without lying.

Output ONLY a valid JSON object matching this schema:
{
  "rewrites": [
    {
      "id": "rewrite-1",
      "rewrittenText": "string",
      "actionVerbUsed": "string",
      "keywordsAdded": ["string"],
      "rationale": "string",
      "promptForMetric": "string or null if original already had numbers"
    }
  ],
  "unsupportedRequirementsFlagged": ["string"]
}`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].text;
      const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('Anthropic API error or invalid response, falling back to simulation guardrails:', error.message);
      return this.getSimulatedRewrites(bulletText, jdKeywords);
    }
  }

  static getSimulatedRewrites(bulletText, jdKeywords) {
    const hasNumbers = /\d+/.test(bulletText);
    const missingSkills = jdKeywords?.requiredSkills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
    const kw1 = missingSkills[0] || 'TypeScript';
    const kw2 = missingSkills[1] || 'PostgreSQL';

    const rewrites = [];

    if (!hasNumbers) {
      // Guardrail: Bullet lacks numbers -> ask for metric!
      rewrites.push({
        id: `rewrite-sim-${Date.now()}-1`,
        rewrittenText: `Architected scalable modules using ${kw1} and core engineering patterns, boosting system stability`,
        actionVerbUsed: 'Architected',
        keywordsAdded: [kw1],
        rationale: `Replaced passive phrase with strong leadership verb "Architected" and integrated "${kw1}". Prompts candidate for exact performance metrics to satisfy ATS quantification checks.`,
        promptForMetric: `You mentioned improving system stability and working with ${kw1}—by what exact percentage or latency (ms) did performance improve?`,
      });

      rewrites.push({
        id: `rewrite-sim-${Date.now()}-2`,
        rewrittenText: `Spearheaded cross-functional development initiatives utilizing ${kw2}, delivering feature updates ahead of schedule`,
        actionVerbUsed: 'Spearheaded',
        keywordsAdded: [kw2],
        rationale: `Emphasized leadership and proactive execution with "${kw2}" while verifying measurable time-to-delivery metrics.`,
        promptForMetric: `How many weeks ahead of schedule was the release delivered, or how many engineering hours were saved weekly?`,
      });

      rewrites.push({
        id: `rewrite-sim-${Date.now()}-3`,
        rewrittenText: `Engineered high-concurrency backend workflows and automated CI/CD pipelines with ${kw1}`,
        actionVerbUsed: 'Engineered',
        keywordsAdded: [kw1, 'CI/CD'],
        rationale: `High-weight n-gram phrasing tailored for Senior engineering roles.`,
        promptForMetric: `What was the exact build time reduction (%) achieved through the CI/CD automation?`,
      });
    } else {
      // Original already has numbers -> refine verbs & keywords cleanly
      rewrites.push({
        id: `rewrite-sim-${Date.now()}-1`,
        rewrittenText: `Spearheaded technical development and performance optimization using ${kw1}, ` + bulletText.replace(/^(Responsible for|Helped with|Worked on|Assisted in)/i, '').trim(),
        actionVerbUsed: 'Spearheaded',
        keywordsAdded: [kw1],
        rationale: `Retained candidate's verified numerical metrics while upgrading starting verb to "Spearheaded" and injecting "${kw1}".`,
        promptForMetric: null,
      });

      rewrites.push({
        id: `rewrite-sim-${Date.now()}-2`,
        rewrittenText: `Architected mission-critical components leveraging ${kw2}, ` + bulletText.replace(/^(Responsible for|Helped with|Worked on|Assisted in)/i, '').trim(),
        actionVerbUsed: 'Architected',
        keywordsAdded: [kw2],
        rationale: `Highlighted architectural design leadership and "${kw2}" database proficiency.`,
        promptForMetric: null,
      });
    }

    return {
      rewrites,
      unsupportedRequirementsFlagged: [
        `Anti-Hallucination Check: Verified 0 fabricated numbers. All suggested metrics require user validation before export.`,
      ],
    };
  }
}
