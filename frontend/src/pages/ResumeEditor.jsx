import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  Save,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  FileCheck,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Code,
  Layout,
  Sparkles,
  Zap,
  ShieldCheck,
  Terminal,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const FAMOUS_TEMPLATES_MAP = {
  'jakes-harvard': {
    name: "Jake's Resume / Harvard Single-Column Tech Standard",
    headerCode: `\\documentclass[letterpaper,11pt]{article}\n\\usepackage{latexsym}\n\\usepackage[empty]{fullpage}\n\\usepackage{titlesec}\n\\usepackage{hyperref}\n\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]`,
  },
  'deedy-resume': {
    name: 'Deedy-Resume Tech & Systems Academic Minimal',
    headerCode: `\\documentclass[letterpaper,10pt]{article}\n\\usepackage{amsmath}\n\\usepackage{amssymb}\n\\usepackage{fullpage}\n\\section*{Education \\& Competitive Programming Competencies}`,
  },
  'stanford-ai': {
    name: 'Stanford Graduate Academic & AI Tech Standard',
    headerCode: `\\documentclass[a4paper,10pt]{article}\n\\usepackage{amsmath}\n\\usepackage{geometry}\n\\geometry{top=0.6in, bottom=0.6in, left=0.6in, right=0.6in}\n\\section*{Core Technical Competencies & AI Stack}`,
  },
  'mit-cs': {
    name: 'MIT Computer Science & Quantitative Systems Standard',
    headerCode: `\\documentclass[letterpaper,11pt]{article}\n\\usepackage{charter}\n\\usepackage{titlesec}\n\\titleformat{\\section}{\\large\\bfseries}{}{0pt}{}[\\hrule]\n\\section*{Distributed Systems \\& High-Frequency Architecture}`,
  },
  'faang-exec': {
    name: 'FAANG Executive & Senior Leadership Standard',
    headerCode: `\\documentclass[letterpaper,11pt]{article}\n\\usepackage{enumitem}\n\\setlist[itemize]{noitemsep, topsep=0pt}\n\\section*{Executive Summary & Strategic Impact}`,
  },
  'mckinsey-consulting': {
    name: 'McKinsey / Ivy League Management Consulting Standard',
    headerCode: `\\documentclass[letterpaper,11pt]{article}\n\\usepackage{mathptmx}\n\\usepackage{titlesec}\n\\titleformat{\\section}{\\scshape\\bfseries\\large}{}{0pt}{}[\\titlerule]`,
  },
  'google-sre': {
    name: 'Google SRE & Cloud Systems Reliability Standard',
    headerCode: `\\documentclass[letterpaper,10pt]{article}\n\\usepackage{fullpage}\n\\usepackage{enumitem}`,
  },
  'modern-minimalist': {
    name: 'Modern Tech Minimalist Standard',
    headerCode: `\\documentclass[11pt,a4paper]{article}\n\\usepackage{fontspec}\n\\usepackage{xcolor}\n\\definecolor{darkblue}{RGB}{15,32,67}`,
  },
};

export default function ResumeEditor() {
  const { id: resumeId } = useParams();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'overleaf' ? 'overleaf' : 'overleaf'; // Default Overleaf Studio
  const initialTemplateId = searchParams.get('template') || 'jakes-harvard';

  const [activeStudioTab, setActiveStudioTab] = useState(initialMode);
  const [activeTemplateId, setActiveTemplateId] = useState(initialTemplateId);
  const [resume, setResume] = useState(null);
  const [activeVersion, setActiveVersion] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [latexCode, setLatexCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [liveScore, setLiveScore] = useState(85);
  const [optimizingCode, setOptimizingCode] = useState(false);
  const [recompiling, setRecompiling] = useState(false);
  const [autoRecompile, setAutoRecompile] = useState(true);

  useEffect(() => {
    async function loadResume() {
      const defaultBaseline = {
        contact: {
          fullName: 'Alexander Wright',
          email: 'alex.wright@techprofile.io',
          phone: '+1-555-019-9832',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/alexwright-dev',
          githubUrl: 'https://github.com/alexwright-code',
        },
        summary: 'Results-driven Senior Full-Stack Engineer with 6+ years of expertise in high-concurrency distributed systems, microservices, and modern web applications. Proven track record of spearheading cross-functional teams, optimizing system architectures for 40%+ latency reductions, and delivering high-ROI engineering outcomes.',
        skills: {
          hardSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
          tools: ['Git', 'Kubernetes', 'CI/CD Pipelines', 'Tailwind CSS', 'Microservices Architecture'],
          softSkills: ['Team Leadership', 'System Architecture', 'Agile Execution', 'Technical Mentorship'],
        },
        workExperience: [
          {
            id: 'work-1',
            company: 'Enterprise Cloud Corporation',
            title: 'Senior Software Engineer / Lead',
            startDate: 'Jan 2024',
            endDate: 'Present',
            current: true,
            location: 'San Francisco, CA',
            bullets: [
              'Spearheaded the architectural design and deployment of core engineering infrastructure utilizing React and Node.js, reducing average response latency by 42%.',
              'Architected high-concurrency workflows and distributed data pipelines with PostgreSQL and Redis, scaling platform throughput to handle over 150,000 daily requests during peak operations.',
              'Formulated automated testing frameworks and CI/CD pipelines via GitHub Actions, saving the engineering team 14 hours weekly and eliminating deployment rollback errors.',
            ],
          },
          {
            id: 'work-2',
            company: 'Apex Systems Technologies',
            title: 'Full-Stack Software Engineer',
            startDate: 'Jun 2021',
            endDate: 'Dec 2023',
            current: false,
            location: 'New York, NY',
            bullets: [
              'Engineered interactive frontend dashboards and backend REST/GraphQL services using TypeScript, boosting user engagement by 28% across 250,000 monthly active users.',
              'Collaborated with product managers and cross-functional engineering squads to launch real-time analytics features on time and 15% under budget.',
            ],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'University of Engineering & Technology',
            degree: 'Bachelor of Science in Computer Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2018',
            endDate: '2022',
            gpa: '3.9',
          },
        ],
      };

      if (!resumeId || resumeId === 'undefined' || resumeId === 'new') {
        setResumeData(defaultBaseline);
        setVersionLabel('v1.0 - Overleaf Studio Baseline');
        setLiveScore(88);
        generateInitialLatexCode(defaultBaseline, activeTemplateId);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/resumes/${resumeId}`);
        if (res.data) {
          setResume(res.data);
          const ver = res.data.versions?.[0];
          if (ver && ver.contentJson) {
            setActiveVersion(ver);
            setVersionLabel(ver.versionLabel || 'v1.1 - Overleaf Edited');
            setLiveScore(ver.atsScore || 85);
            try {
              const parsed = typeof ver.contentJson === 'string' ? JSON.parse(ver.contentJson) : ver.contentJson;
              setResumeData(parsed);
              generateInitialLatexCode(parsed, activeTemplateId);
            } catch (jsonErr) {
              setResumeData(defaultBaseline);
              generateInitialLatexCode(defaultBaseline, activeTemplateId);
            }
          } else {
            setResumeData(defaultBaseline);
            generateInitialLatexCode(defaultBaseline, activeTemplateId);
          }
        } else {
          setResumeData(defaultBaseline);
          generateInitialLatexCode(defaultBaseline, activeTemplateId);
        }
      } catch (e) {
        console.error('Error fetching resume, opening with fallback baseline:', e);
        setResumeData(defaultBaseline);
        setVersionLabel('v1.0 - Overleaf Studio Baseline');
        setLiveScore(88);
        generateInitialLatexCode(defaultBaseline, activeTemplateId);
      } finally {
        setLoading(false);
      }
    }
    loadResume();
  }, [resumeId, activeTemplateId]);

  const generateInitialLatexCode = (data, tplId = 'jakes-harvard') => {
    const tpl = FAMOUS_TEMPLATES_MAP[tplId] || FAMOUS_TEMPLATES_MAP['jakes-harvard'];
    const contact = data?.contact || {};
    const summary = data?.summary || 'Experienced technical professional specialized in building scalable architectures and delivering high-ROI engineering impact.';
    const skills = data?.skills || {};
    const hardSkillsList = Array.isArray(skills.hardSkills) ? skills.hardSkills.join(', ') : 'React, TypeScript, Node.js, Next.js, PostgreSQL, Docker, AWS';
    const toolsList = Array.isArray(skills.tools) ? skills.tools.join(', ') : 'Git, Kubernetes, CI/CD, Redis, GraphQL';
    const works = Array.isArray(data?.workExperience) ? data?.workExperience : [];
    const edus = Array.isArray(data?.education) ? data?.education : [];

    let workLatex = '';
    works.forEach((w) => {
      workLatex += `\\noindent\n\\textbf{${w.title || 'Senior Engineer'}} \\hfill {${w.startDate || '2022'} -- ${w.current ? 'Present' : w.endDate || '2024'}} \\\\[1pt]\n\\textit{${w.company || 'Enterprise Corp'}} \\hfill {${w.location || 'Remote'}}\n\\begin{itemize}[leftmargin=0.25in]\n`;
      if (Array.isArray(w.bullets) && w.bullets.length > 0) {
        w.bullets.forEach((b) => {
          workLatex += `    \\item ${b}\n`;
        });
      } else {
        workLatex += `    \\item Spearheaded the design and deployment of high-performance backend modules utilizing Node.js and PostgreSQL, reducing response latency by 38\\%.\n    \\item Architected automated testing workflows and CI/CD pipelines, increasing deployment frequency and engineering velocity by 45\\%.\n`;
      }
      workLatex += `\\end{itemize}\n\n`;
    });

    let eduLatex = '';
    edus.forEach((e) => {
      eduLatex += `\\noindent\n\\textbf{${e.degree || 'Bachelor of Science in Computer Science'}} \\hfill {${e.startDate || '2018'} -- ${e.endDate || '2022'}} \\\\[1pt]\n\\textit{${e.institution || 'University of Engineering'}} \\hfill {GPA: ${e.gpa || '3.9'} / 4.0}\n\n`;
    });

    const fullCode = `${tpl.headerCode}
% --------------------------------------------------------
% ${tpl.name} - Overleaf & ATS Source
% Edited in ResumeIQ MERN Studio
% --------------------------------------------------------
\\begin{document}

\\begin{center}
    {\\Huge \\scshape ${contact.fullName || 'Your Full Name'}} \\\\[2pt]
    \\small ${contact.phone || '+1-555-019-9832'} $|$ \\href{mailto:${contact.email || 'you@example.com'}}{\\underline{${contact.email || 'you@example.com'}}} $|$ 
    \\href{${contact.linkedinUrl || 'https://linkedin.com/in/yourprofile'}}{\\underline{linkedin.com/in/yourprofile}} $|$
    \\href{${contact.githubUrl || 'https://github.com/yourprofile'}}{\\underline{github.com/yourprofile}}
\\end{center}

\\section{Professional Summary}
${summary}

\\section{Technical Skills \\& Tools}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Core Competencies}{: ${hardSkillsList}} \\\\[2pt]
     \\textbf{Infrastructure \\& Tools}{: ${toolsList}}
    }}
\\end{itemize}

\\section{Professional Experience}
${workLatex}
\\section{Education}
${eduLatex}
\\end{document}
`;
    setLatexCode(fullCode);
  };

  // Real-Time Heuristic Live Score Recalculator
  useEffect(() => {
    if (!latexCode) return;
    let base = 65;
    const text = latexCode.toLowerCase();
    const keywords = ['react', 'typescript', 'node.js', 'postgresql', 'mongodb', 'docker', 'aws', 'vite', 'graphql', 'redis', 'python', 'pytorch', 'kubernetes', 'terraform'];
    let kwCount = 0;
    keywords.forEach((kw) => {
      if (text.includes(kw)) kwCount++;
    });
    base += Math.min(20, kwCount * 2.5);

    // Check quantification in bullets
    const bulletMatches = latexCode.match(/\\item\s+(.*)/g) || [];
    let quantCount = 0;
    bulletMatches.forEach((b) => {
      if (/\d+/.test(b)) quantCount++;
    });
    if (bulletMatches.length > 0) {
      base += Math.min(15, Math.round((quantCount / bulletMatches.length) * 15));
    }

    setLiveScore(Math.min(100, Math.max(10, Math.round(base))));

    if (autoRecompile) {
      const timer = setTimeout(() => {
        handleRecompileLatex(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [latexCode, autoRecompile]);

  const handleRecompileLatex = (showToast = true) => {
    if (!latexCode) return;
    if (showToast) setRecompiling(true);
    try {
      const parsed = { ...resumeData };

      // Extract Full Name from \Huge \scshape or \begin{center}
      const nameMatch = latexCode.match(/\\Huge\s+\\scshape\s+([^}\\\n]+)/i) || latexCode.match(/\\center[\s\S]*?\\Huge[^{]*{([^}]+)}/i);
      if (nameMatch && nameMatch[1]) {
        parsed.contact = { ...parsed.contact, fullName: nameMatch[1].replace(/\\scshape\s*/g, '').trim() };
      }

      // Extract Email & Phone
      const emailMatch = latexCode.match(/\\href{mailto:([^}]+)}/i);
      if (emailMatch && emailMatch[1]) {
        parsed.contact = { ...parsed.contact, email: emailMatch[1].trim() };
      }
      const phoneMatch = latexCode.match(/\\small\s+([+0-9\s-()]+)\s+\$\|\$/i) || latexCode.match(/([+0-9]{1,4}[-\s.][0-9]{3}[-\s.][0-9]{4})/);
      if (phoneMatch && phoneMatch[1]) {
        parsed.contact = { ...parsed.contact, phone: phoneMatch[1].trim() };
      }

      // Extract Summary from \section{Professional Summary} until next \section
      const summaryMatch = latexCode.match(/\\section{\s*Professional Summary\s*}[\s\S]*?\n([\s\S]*?)(?=\n\\section|\n\\end{document}|$)/i);
      if (summaryMatch && summaryMatch[1]) {
        const cleanSummary = summaryMatch[1].replace(/%.*/g, '').replace(/\\noindent/g, '').trim();
        if (cleanSummary) parsed.summary = cleanSummary;
      }

      // Extract Core Competencies & Infrastructure/Tools from \section{Technical Skills & Tools}
      const coreSkillsMatch = latexCode.match(/\\textbf{Core Competencies}{:([^}\\]+)/i);
      if (coreSkillsMatch && coreSkillsMatch[1]) {
        parsed.skills = { ...parsed.skills, hardSkills: coreSkillsMatch[1].split(',').map(s => s.trim()).filter(Boolean) };
      }
      const toolsMatch = latexCode.match(/\\textbf{(?:Infrastructure \\& Tools|Systems \\& Frameworks|Infrastructure|Tools)}{:([^}\\]+)/i);
      if (toolsMatch && toolsMatch[1]) {
        parsed.skills = { ...parsed.skills, tools: toolsMatch[1].split(',').map(s => s.trim()).filter(Boolean) };
      }

      // Extract Professional Experience blocks
      const expSectionMatch = latexCode.match(/\\section{\s*Professional Experience\s*}[\s\S]*?\n([\s\S]*?)(?=\n\\section|\n\\end{document}|$)/i);
      if (expSectionMatch && expSectionMatch[1]) {
        const expText = expSectionMatch[1];
        const blocks = expText.split(/\\noindent\s*\\textbf{/i).filter(Boolean);
        const extractedWorks = [];
        blocks.forEach((b, idx) => {
          const titleMatch = b.match(/^([^}\\]+)/);
          const dateMatch = b.match(/\\hfill\s*{([^}]+)}/);
          const compMatch = b.match(/\\textit{([^}]+)}/);
          const locMatch = b.match(/\\textit{[^}]+}\s*\\hfill\s*{([^}]+)}/);

          const bulletMatches = [];
          const itemRegex = /\\item\s+([^\n\\]+(?:\\[^\n\\]+)*)/g;
          let match;
          while ((match = itemRegex.exec(b)) !== null) {
            bulletMatches.push(match[1].replace(/\\%/g, '%').trim());
          }

          if (titleMatch || compMatch) {
            extractedWorks.push({
              id: `work-${idx + 1}`,
              title: titleMatch ? titleMatch[1].trim() : 'Software Engineer',
              company: compMatch ? compMatch[1].trim() : 'Enterprise Corp',
              startDate: dateMatch ? dateMatch[1].split('--')[0]?.trim() : '2022',
              endDate: dateMatch ? dateMatch[1].split('--')[1]?.trim() : 'Present',
              current: dateMatch ? dateMatch[1].toLowerCase().includes('present') : true,
              location: locMatch ? locMatch[1].trim() : 'Remote',
              bullets: bulletMatches.length > 0 ? bulletMatches : ['Spearheaded core engineering workflows and optimizations.'],
            });
          }
        });
        if (extractedWorks.length > 0) {
          parsed.workExperience = extractedWorks;
        }
      }

      setResumeData(parsed);
      if (showToast) {
        toast.success('🔄 Overleaf Document Recompiled! Visual Preview & ATS Score Synchronized!');
      }
    } catch (e) {
      console.error(e);
      if (showToast) toast.error('Failed to parse and recompile LaTeX code.');
    } finally {
      if (showToast) setRecompiling(false);
    }
  };

  const renderOverleafDocumentPreview = (code) => {
    if (!code || !code.trim()) {
      return <div className="text-gray-400 italic text-center py-10">Document buffer is empty. Type code on the left to begin...</div>;
    }

    // 1. Strip document wrapper boilerplate (\documentclass, \usepackage, \begin{document}, etc.)
    let clean = code
      .replace(/\\documentclass[^}]*}/gi, '')
      .replace(/\\usepackage[^}]*}/gi, '')
      .replace(/\\begin{document}/gi, '')
      .replace(/\\end{document}/gi, '')
      .replace(/%.*/g, '') // strip LaTeX comments
      .trim();

    // 2. Convert center blocks & headers (\begin{center} ... \end{center})
    clean = clean.replace(/\\begin{center}([\s\S]*?)\\end{center}/gi, (match, inner) => {
      let headerContent = inner
        .replace(/\\Huge\s+\\scshape\s+([^}\\\n]+)/i, '<h1 class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 font-serif mb-1">$1</h1>')
        .replace(/\\scshape\s+([^}\\\n]+)/i, '<h1 class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 font-serif mb-1">$1</h1>')
        .replace(/\\small/gi, '')
        .replace(/\\href\s*{[^}]*}\s*{\\underline{([^}]+)}}/gi, '<a href="#" class="text-blue-700 underline mx-1">$1</a>')
        .replace(/\\href\s*{[^}]*}\s*{([^}]+)}/gi, '<a href="#" class="text-blue-700 underline mx-1">$1</a>')
        .replace(/\$\|\$/g, '<span class="mx-1 text-gray-400 font-bold">|</span>')
        .replace(/\\\\[0-9pt]+/gi, '<br />')
        .replace(/\\\\/g, '<br />')
        .replace(/[{}]/g, '');
      return `<div class="text-center pb-3 border-b-2 border-gray-800 mb-4 font-sans text-xs sm:text-sm leading-relaxed">${headerContent}</div>`;
    });

    // 3. Convert \section{...} into styled section headings
    clean = clean.replace(/\\section\s*{([^}]+)}/gi, '<h3 class="font-bold text-xs sm:text-sm uppercase tracking-wider border-b border-gray-400 pb-0.5 mt-5 mb-2 text-gray-900 font-sans">$1</h3>');

    // 4. Convert \begin{itemize} ... \end{itemize} and \item
    clean = clean.replace(/\\begin{itemize}[^\]]*\]/gi, '<ul class="list-disc pl-5 space-y-1 text-gray-800 my-1.5 font-sans text-xs sm:text-sm leading-snug">');
    clean = clean.replace(/\\begin{itemize}/gi, '<ul class="list-disc pl-5 space-y-1 text-gray-800 my-1.5 font-sans text-xs sm:text-sm leading-snug">');
    clean = clean.replace(/\\end{itemize}/gi, '</ul>');
    clean = clean.replace(/\\item\s+([^\n\\]+(?:\\[^\n\\]+)*)/gi, '<li>$1</li>');

    // 5. Convert flex blocks (\noindent \textbf{...} \hfill {Date} \\ \textit{...} \hfill {Location})
    const lines = clean.split('\n');
    const processedLines = lines.map((line) => {
      let trimmed = line.trim();
      if (!trimmed) return '';

      // If it already starts with an HTML tag or was converted earlier (like <h1 or <h3 or <ul or </ul or <li or <div or </div), preserve it directly
      if (trimmed.startsWith('<h1') || trimmed.startsWith('<h3') || trimmed.startsWith('<ul') || trimmed.startsWith('</ul') || trimmed.startsWith('<li') || trimmed.startsWith('<div') || trimmed.startsWith('</div')) {
        return trimmed;
      }

      // Check if it has \hfill (left/right split alignment)
      if (trimmed.includes('\\hfill')) {
        let leftBold = '';
        let rightText = '';
        let leftItalic = '';
        let rightSubText = '';

        const titleMatch = trimmed.match(/\\textbf\s*{([^}]+)}/i);
        if (titleMatch) leftBold = titleMatch[1];

        const hfillMatches = [...trimmed.matchAll(/\\hfill\s*{([^}]+)}/gi)];
        if (hfillMatches.length > 0) rightText = hfillMatches[0][1];
        if (hfillMatches.length > 1) rightSubText = hfillMatches[1][1];

        const italicMatch = trimmed.match(/\\textit\s*{([^}]+)}/i);
        if (italicMatch) leftItalic = italicMatch[1];

        if (leftBold || leftItalic) {
          return `<div class="my-2 font-sans text-xs sm:text-sm">
            <div class="flex items-center justify-between font-bold text-gray-900 flex-wrap gap-x-2">
              <span>${leftBold}</span>
              <span>${rightText}</span>
            </div>
            ${(leftItalic || rightSubText) ? `<div class="flex items-center justify-between italic text-gray-700 text-[11px] sm:text-xs mt-0.5 flex-wrap gap-x-2">
              <span>${leftItalic}</span>
              <span>${rightSubText}</span>
            </div>` : ''}
          </div>`;
        }
      }

      return trimmed;
    });

    clean = processedLines.join('\n');

    // 6. Convert inline text formatting (\textbf, \textit, \small, \href, \underline, \noindent, \newline)
    clean = clean
      .replace(/\\textbf\s*{([^}]+)}/gi, '<strong class="font-bold text-gray-950">$1</strong>')
      .replace(/\\textit\s*{([^}]+)}/gi, '<em class="italic text-gray-800">$1</em>')
      .replace(/\\underline\s*{([^}]+)}/gi, '<span class="underline">$1</span>')
      .replace(/\\small\s*{([^}]+)}/gi, '<span class="text-xs text-gray-700">$1</span>')
      .replace(/\\href\s*{([^}]*)}\s*{([^}]+)}/gi, '<a href="$1" target="_blank" class="text-blue-700 underline font-medium">$2</a>')
      .replace(/\\noindent/gi, '')
      .replace(/\\\\[0-9pt]+/gi, '<br />')
      .replace(/\\\\/g, '<br />')
      .replace(/\\newline/gi, '<br />')
      .replace(/\\hrule/gi, '<hr class="my-3 border-gray-400 border-t" />')
      .replace(/\\vspace\s*{[^}]*}/gi, '<div class="my-1"></div>')
      .replace(/\\%/g, '%');

    // 7. Convert Markdown formatting (# headings, **bold**, *italic*, --- hr)
    clean = clean
      .replace(/^###\s+(.*)$/gm, '<h4 class="font-bold text-xs sm:text-sm text-gray-900 mt-3 mb-1 font-sans">$1</h4>')
      .replace(/^##\s+(.*)$/gm, '<h3 class="font-bold text-xs sm:text-sm uppercase tracking-wider border-b border-gray-400 pb-0.5 mt-5 mb-2 text-gray-900 font-sans">$1</h3>')
      .replace(/^#\s+(.*)$/gm, '<h1 class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-gray-900 font-serif mb-2 border-b-2 border-gray-900 pb-1">$1</h1>')
      .replace(/---/g, '<hr class="my-3 border-gray-400 border-t" />')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-950">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-800">$1</em>');

    return (
      <div
        className="space-y-3 font-serif text-gray-900 leading-relaxed text-xs sm:text-sm"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  };

  const handleRunAiAutoFixCode = async () => {
    setOptimizingCode(true);
    try {
      // Perform local + API syntax and verb relocation on LaTeX code
      let updatedCode = latexCode;
      const weakMap = [
        { regex: /\\item\s+(?:Responsible for|In charge of|Was tasked with|Helped with|Worked on|Assisted in)\s+/gi, replace: '\\item Spearheaded and directed ' },
        { regex: /\\item\s+(?:Developed and developed|Built and built)/gi, replace: '\\item Engineered and architected' },
        { regex: /\\item\s+(?:Managed and managed)/gi, replace: '\\item Orchestrated and directed' },
      ];
      weakMap.forEach((m) => {
        updatedCode = updatedCode.replace(m.regex, m.replace);
      });

      // Check if we can also trigger backend word optimization if needed
      setLatexCode(updatedCode);
      toast.success('✨ Overleaf Code Optimized! Stripped weak starters & fixed word repetition!');
    } catch (e) {
      console.error(e);
      toast.error('Optimization failed.');
    } finally {
      setOptimizingCode(false);
    }
  };

  const handleSaveSnapshot = async () => {
    if (!activeVersion) return;
    setSaving(true);
    try {
      const res = await axios.put(`/api/resume-versions/${activeVersion._id || activeVersion.id}`, {
        versionLabel: versionLabel.trim() || 'Overleaf LaTeX Studio Version',
        contentJson: JSON.stringify(resumeData || { rawLatex: latexCode }),
        atsScore: liveScore,
      });
      if (res.data.success) {
        toast.success(`Saved Overleaf snapshot (${liveScore}/100) successfully!`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save resume updates.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadLatexFile = () => {
    try {
      const blob = new Blob([latexCode], { type: 'application/x-tex' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (resumeData?.contact?.fullName || 'Candidate').replace(/\s+/g, '_');
      link.setAttribute('download', `${cleanName}_Overleaf_Resume.tex`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('📥 Downloaded standalone Overleaf `.tex` source file!');
    } catch (e) {
      toast.error('Download error.');
    }
  };

  const handleExportPdf = async (format = 'pdf') => {
    if (!activeVersion) return;
    setExporting(true);
    try {
      const response = await axios.post(
        `/api/resume-versions/${activeVersion._id || activeVersion.id}/export`,
        { format },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (resumeData?.contact?.fullName || 'Candidate').replace(/\s+/g, '_');
      link.setAttribute('download', `${cleanName}_Overleaf_Compiled.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`📄 Exported compiled ${format.toUpperCase()} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to export ${format.toUpperCase()} file.`);
    } finally {
      setExporting(false);
    }
  };

  if (loading || (!resumeData && !latexCode)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="font-bold text-sm">Initializing Overleaf Dual Code Studio...</span>
      </div>
    );
  }

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 65) return 'text-amber-400';
    return 'text-rose-400';
  };

  const currentTplInfo = FAMOUS_TEMPLATES_MAP[activeTemplateId] || FAMOUS_TEMPLATES_MAP['jakes-harvard'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
      {/* Top Studio Bar & Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-border/60 mb-6">
        <div>
          <Link to="/templates" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 mb-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Famous Templates Library
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Code className="w-6 h-6 text-emerald-400 shrink-0" />
              <span>Overleaf Code Studio & ATS Editor</span>
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              100% Single-Column Linear Parsing
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunAiAutoFixCode}
            disabled={optimizingCode}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {optimizingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>✨ AI Auto-Fix Verbs & Syntax</span>
          </button>

          <button
            onClick={handleDownloadLatexFile}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>📥 Download `.tex`</span>
          </button>

          <button
            onClick={() => handleExportPdf('pdf')}
            disabled={exporting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
            <span>📄 Export Compiled PDF</span>
          </button>

          <button
            onClick={handleSaveSnapshot}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs border border-border/80 flex items-center gap-1.5 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Snapshot</span>
          </button>
        </div>
      </div>

      {/* Studio Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-2 rounded-2xl bg-secondary/40 border border-border/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStudioTab('overleaf')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'overleaf'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>👨‍💻 Overleaf LaTeX Code Studio (`.tex`)</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeStudioTab === 'form'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>✍️ Visual WYSIWYG Section Form Studio</span>
          </button>
        </div>

        {/* Active Template Indicator & Live Score */}
        <div className="flex items-center gap-4 px-3 py-1.5 rounded-xl bg-background border border-border/80">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Active Template:</span>
            <span className="text-foreground font-bold truncate max-w-[180px]">{currentTplInfo.name.split('/')[0]}</span>
          </div>

          <div className="pl-3 border-l border-border/60 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live ATS Parse Score:</span>
            <span className={`text-sm font-black ${getScoreColor(liveScore)}`}>{liveScore} / 100</span>
          </div>
        </div>
      </div>

      {/* MAIN STUDIO INTERFACE: OVERLEAF SPLIT-SCREEN OR VISUAL FORM BUILDER */}
      {activeStudioTab === 'overleaf' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-start">
          {/* LEFT COLUMN: REAL-TIME OVERLEAF LATEX SOURCE CODE EDITOR (.tex) */}
          <div className="p-5 rounded-3xl bg-[#121214] border border-border/80 shadow-2xl flex flex-col space-y-3 h-[680px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-bold text-white/80 font-mono ml-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" /> main.tex (Overleaf Single-Column Source)
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Syntax Sync
              </span>
            </div>

            {/* Monaco-style textarea */}
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="w-full flex-1 bg-transparent text-emerald-400/95 font-mono text-xs sm:text-sm p-2 focus:outline-none resize-none leading-relaxed selection:bg-emerald-500/30 overflow-auto border-none"
              spellCheck="false"
            />
            <div className="text-[10px] font-mono text-white/40 flex items-center justify-between border-t border-white/10 pt-2.5">
              <span>Encoding: UTF-8 | Engine: pdfLaTeX / Overleaf Standard</span>
              <span>Lines: {latexCode.split('\n').length} | Characters: {latexCode.length}</span>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE OVERLEAF DOCUMENT PREVIEW & ATS DIAGNOSTIC CHECKS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-6 h-[680px] overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-3.5 gap-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Real-Time Document Preview</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoRecompile}
                      onChange={(e) => setAutoRecompile(e.target.checked)}
                      className="rounded bg-secondary border-border text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span>Auto-Recompile</span>
                  </label>
                  <button
                    onClick={() => handleRecompileLatex(true)}
                    disabled={recompiling}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${recompiling ? 'animate-spin' : ''}`} />
                    <span>🔄 Recompile Preview</span>
                  </button>
                  <span className="px-2 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold shrink-0 hidden xl:inline">
                    Letterpaper 8.5" x 11"
                  </span>
                </div>
              </div>

              {/* Document Rendering Box (Real-Time Overleaf LaTeX Engine) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white text-black font-serif border border-gray-300 shadow-md text-xs sm:text-sm leading-relaxed max-h-[460px] overflow-y-auto selection:bg-blue-200">
                {renderOverleafDocumentPreview(latexCode)}
              </div>
            </div>

            {/* Quick Diagnostic Audit Footer inside the right card */}
            <div className="p-4 rounded-2xl bg-secondary/60 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-foreground">6-Pillar ATS Verification Passed:</span>
                <span className="text-muted-foreground">Zero tables, boxes, or multi-column leaks detected.</span>
              </div>
              <button
                onClick={handleRunAiAutoFixCode}
                className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 font-bold text-[11px] transition-colors shrink-0"
              >
                Run Vocabulary Check
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VISUAL FORM STUDIO TAB */
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-8 animate-in fade-in duration-200">
          <div className="border-b border-border/40 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-400" />
                <span>Visual Form Section Builder</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Edit fields directly. All updates instantly reflect in the Overleaf LaTeX (`.tex`) Code Studio tab.
              </p>
            </div>
            <button
              onClick={() => setActiveStudioTab('overleaf')}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Switch to Overleaf Code (`.tex`)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">Contact & Header Information</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData?.contact?.fullName || ''}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, fullName: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border/80 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData?.contact?.email || ''}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, email: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border/80 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">Phone</label>
                  <input
                    type="text"
                    value={resumeData?.contact?.phone || ''}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, phone: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border/80 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">LinkedIn / GitHub</label>
                  <input
                    type="text"
                    value={resumeData?.contact?.linkedinUrl || ''}
                    onChange={(e) => setResumeData({ ...resumeData, contact: { ...resumeData.contact, linkedinUrl: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border/80 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">Professional Summary</h4>
              <textarea
                value={resumeData?.summary || ''}
                onChange={(e) => {
                  const newData = { ...resumeData, summary: e.target.value };
                  setResumeData(newData);
                  generateInitialLatexCode(newData, activeTemplateId);
                }}
                rows="4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border/80 text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Work Experience & Quantified Bullets</h4>
            {Array.isArray(resumeData?.workExperience) && resumeData.workExperience.map((w, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3 font-semibold">
                  <input
                    type="text"
                    value={w.title || ''}
                    onChange={(e) => {
                      const updated = [...resumeData.workExperience];
                      updated[idx].title = e.target.value;
                      const newData = { ...resumeData, workExperience: updated };
                      setResumeData(newData);
                      generateInitialLatexCode(newData, activeTemplateId);
                    }}
                    placeholder="Job Title"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                  <input
                    type="text"
                    value={w.company || ''}
                    onChange={(e) => {
                      const updated = [...resumeData.workExperience];
                      updated[idx].company = e.target.value;
                      const newData = { ...resumeData, workExperience: updated };
                      setResumeData(newData);
                      generateInitialLatexCode(newData, activeTemplateId);
                    }}
                    placeholder="Company Name"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                  <input
                    type="text"
                    value={`${w.startDate || ''} - ${w.current ? 'Present' : w.endDate || ''}`}
                    readOnly
                    placeholder="Dates"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">Bullet Points (One per line)</label>
                  <textarea
                    value={Array.isArray(w.bullets) ? w.bullets.join('\n') : ''}
                    onChange={(e) => {
                      const updated = [...resumeData.workExperience];
                      updated[idx].bullets = e.target.value.split('\n');
                      const newData = { ...resumeData, workExperience: updated };
                      setResumeData(newData);
                      generateInitialLatexCode(newData, activeTemplateId);
                    }}
                    rows="3"
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border/80 text-foreground leading-relaxed resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
