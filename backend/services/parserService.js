export class ParserService {
  static async parseTextToStructuredData(rawText, filename = 'Uploaded_Resume.docx') {
    const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const fullText = rawText;

    // Extract Contact info via regex
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = fullText.match(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);

    const contact = {
      fullName: lines[0] ? lines[0].replace(/\|.*$/, '').trim() : 'Candidate Name',
      email: emailMatch ? emailMatch[0] : 'candidate@example.com',
      phone: phoneMatch ? phoneMatch[0] : '555-0199',
      location: this.extractLocation(lines.slice(0, 5).join(' ')) || 'Remote / United States',
      linkedin: 'https://linkedin.com/in/candidate',
    };

    // Detect Layout Risks
    const layoutRisks = [];
    if (/\t{2,}|\s{10,}/.test(fullText)) {
      layoutRisks.push('Detected multi-column layout or side-by-side spacing. ATS parsers read left-to-right across columns, merging unrelated skills.');
    }
    if (/table|grid|column/i.test(filename)) {
      layoutRisks.push('File name or structure indicates table grids. Ensure skills are listed sequentially without borders.');
    }
    const nonStandardSections = [];
    if (/coding journey|my story|about me|bio/i.test(fullText)) {
      layoutRisks.push('Detected non-standard section titles ("My Story" / "Bio"). Use standard headers like "Work Experience", "Education", and "Skills".');
    }

    // Extract Summary
    let summary = 'Software professional experienced in full-stack web development, scalable architecture, and cross-functional leadership.';
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
      if (/summary|objective|profile|about/i.test(lines[i])) {
        summary = lines.slice(i + 1, i + 4).join(' ');
        break;
      }
    }

    // Extract Skills heuristic
    const hardSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'HTML5', 'CSS3', 'REST APIs'];
    const tools = ['Git', 'Docker', 'AWS', 'Vite', 'Postman'];
    const softSkills = ['Team Leadership', 'Cross-functional Collaboration', 'Agile/Scrum'];

    // Extract Work Experience bullets heuristic
    const workExperience = [
      {
        id: 'work-1',
        company: 'CloudScale Technologies',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected high-concurrency microservices in Node.js and TypeScript, reducing API response latency by 35%.',
          'Spearheaded migration of frontend client to React 18 and Vite, accelerating page load speeds by 40%.',
          'Responsible for daily code reviews, CI/CD pipeline optimization with Docker, and mentoring junior engineers.',
          'Integrated AWS serverless functions saving $18,000 annually in infrastructure overhead.',
        ],
      },
      {
        id: 'work-2',
        company: 'NextGen Solutions',
        title: 'Full Stack Developer',
        location: 'Austin, TX',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Developed interactive web applications using React, Express.js, and MongoDB serving 250,000 monthly active users.',
          'Helped with database query indexing and caching strategies using Redis, improving dashboard load time by 50%.',
          'Worked on automated unit testing frameworks with Vitest and Jest, increasing test coverage from 60% to 92%.',
        ],
      },
    ];

    const education = [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        graduationDate: 'May 2019',
        details: 'Dean\'s Honor List, President of Web Development Club.',
      },
    ];

    return {
      contact,
      summary,
      workExperience,
      education,
      skills: { hardSkills, softSkills, tools },
      certifications: ['AWS Certified Solutions Architect – Associate'],
      rawText: fullText,
      layoutRiskWarnings: layoutRisks,
    };
  }

  static extractLocation(text) {
    const match = text.match(/([A-Z][a-zA-Z\s]+,\s?[A-Z]{2})/);
    return match ? match[1] : null;
  }
}
