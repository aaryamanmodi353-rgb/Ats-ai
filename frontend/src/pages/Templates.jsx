import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  Briefcase,
  Layers,
  Search,
  Code,
  Database,
  LineChart,
  Layout,
  Terminal,
  ShieldAlert,
  Smartphone,
  Cpu,
  Users,
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_RECOMMENDATIONS = [
  {
    id: 'fullstack',
    title: 'Senior Full-Stack Engineer',
    category: 'Software Engineering',
    icon: Code,
    badgeColor: 'from-blue-600 to-cyan-600',
    description: 'Targeted for Full-Stack, Frontend, and Backend engineering roles at high-growth tech companies and enterprise systems.',
    essentialSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS CI/CD', 'Microservices Architecture'],
    recommendedVerbs: ['Architected', 'Spearheaded', 'Engineered', 'Formulated', 'Orchestrated', 'Optimized', 'Deployed', 'Constructed'],
    mustHaveSections: ['Contact & GitHub/LinkedIn Links', 'Technical Skills & Tools Grid', 'Quantified Work Experience (with QPS/Latency metrics)', 'System Architecture & Open Source Projects', 'Education'],
    topTemplateId: 'jakes-harvard',
    atsAdvice: 'ATS algorithms for Full-Stack roles weigh backend scalability metrics heavily. Always include explicit QPS (queries per second), latency reduction (%), or AWS cost reduction metrics inside bullet #1 of your most recent work experience.',
  },
  {
    id: 'aiml',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence & Data',
    icon: Terminal,
    badgeColor: 'from-purple-600 to-indigo-600',
    description: 'Optimized for LLM Engineers, ML Researchers, AI Application Developers, and Data Systems Architects.',
    essentialSkills: ['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'Transformers', 'RAG Pipelines', 'Vector Databases (Pinecone/Milvus)', 'CUDA', 'Docker', 'MLflow', 'AWS Bedrock'],
    recommendedVerbs: ['Modelled', 'Fine-Tuned', 'Architected', 'Formulated', 'Synthesized', 'Deployed', 'Evaluated', 'Engineered'],
    mustHaveSections: ['Contact & GitHub/HF Profile Links', 'Core AI & Machine Learning Stack', 'Quantified Engineering Experience', 'AI Research / Open Source Model Contributions', 'Academic Credentials & Publications'],
    topTemplateId: 'stanford-ai',
    atsAdvice: 'Ensure you explicitly separate Model Training (PyTorch, GPU clusters) from Production Inference deployment (FastAPI, Docker, RAG pipelines). ATS filters specifically check for both algorithmic foundation and production deployment aptitude.',
  },
  {
    id: 'datascience',
    title: 'Data Scientist & Analytics Architect',
    category: 'Data Science & BI',
    icon: Database,
    badgeColor: 'from-emerald-600 to-teal-600',
    description: 'Designed for Data Scientists, Quantitative Analysts, BI Engineers, and Big Data Specialists.',
    essentialSkills: ['Python', 'SQL', 'R', 'Pandas', 'Scikit-Learn', 'Snowflake', 'Tableau', 'BigQuery', 'A/B Testing Frameworks', 'Statistical & Predictive Modeling'],
    recommendedVerbs: ['Analyzed', 'Quantified', 'Formulated', 'Extracted', 'Spearheaded', 'Modelled', 'Visualized', 'Synthesized'],
    mustHaveSections: ['Contact & Portfolio Links', 'Analytical Languages & BI Tools', 'Impact-Driven Work Experience', 'Case Study Projects & Predictive Models', 'Education & Certifications'],
    topTemplateId: 'stanford-ai',
    atsAdvice: 'Focus strictly on business revenue and cost impact derived from your models (e.g., "Identified $1.2M annual cost savings via predictive churn modeling"). Never list statistical models without connecting them to decision outcomes.',
  },
  {
    id: 'productmanager',
    title: 'Product Manager (Tech & AI)',
    category: 'Product & Leadership',
    icon: LineChart,
    badgeColor: 'from-amber-600 to-orange-600',
    description: 'Tailored for Product Managers, Technical PMs, Agile Product Owners, and Group Product Leads.',
    essentialSkills: ['Agile/Scrum', 'Product Strategy', 'Roadmap Execution', 'Jira', 'A/B Testing', 'User Research & Discovery', 'SQL & Analytics', 'KPI & OKR Tracking', 'Go-to-Market (GTM) Strategy'],
    recommendedVerbs: ['Spearheaded', 'Directed', 'Orchestrated', 'Formulated', 'Drove', 'Negotiated', 'Launched', 'Steered'],
    mustHaveSections: ['Contact & LinkedIn URL', 'Executive Summary & Core Competencies', 'Strategic Leadership Experience', 'Product Metrics & Key Results (KRs)', 'Education & Certifications'],
    topTemplateId: 'faang-exec',
    atsAdvice: 'ATS scanners for PMs search for cross-functional leadership and exact ARR/MAU growth percentages. Use bullet points structured as: [Action Verb] + [Product Initiative] + resulting in [X% MAU/Revenue lift across Y users].',
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Systems Architect',
    category: 'Cloud Infrastructure',
    icon: Layers,
    badgeColor: 'from-cyan-600 to-blue-600',
    description: 'Built for Site Reliability Engineers (SRE), Cloud Architects, Platform Engineers, and Kubernetes Specialists.',
    essentialSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS / GCP / Azure', 'GitHub Actions CI/CD', 'Prometheus & Grafana', 'Ansible', 'Linux Kernel Optimization', 'Go & Bash Scripting'],
    recommendedVerbs: ['Automated', 'Architected', 'Orchestrated', 'Deployed', 'Secured', 'Scaled', 'Streamlined', 'Engineered'],
    mustHaveSections: ['Contact & GitHub Links', 'Cloud Infrastructure & DevOps Stack', 'Mission-Critical Reliability Experience', 'Certifications (AWS Solutions Architect / CKA)'],
    topTemplateId: 'google-sre',
    atsAdvice: 'Zero tolerance for multi-column layouts or graphics. Enterprise DevOps ATS bots check for exact Infrastructure-as-Code terms (Terraform, K8s, GitOps) and strict 99.99% SLA availability metrics.',
  },
  {
    id: 'uiux',
    title: 'UI/UX & Product Designer',
    category: 'Design & Frontend',
    icon: Layout,
    badgeColor: 'from-rose-600 to-pink-600',
    description: 'Perfected for Product Designers, UI/UX Specialists, Design Systems Architects, and Creative Technologists.',
    essentialSkills: ['Figma', 'Design Systems Architecture', 'User Discovery & Research', 'Wireframing & Prototyping', 'Accessibility (WCAG 2.1)', 'HTML5 / CSS3 / Vanilla CSS', 'Micro-interactions & Animations'],
    recommendedVerbs: ['Architected', 'Crafted', 'Spearheaded', 'Redesigned', 'Synthesized', 'Validated', 'Prototyped', 'Formulated'],
    mustHaveSections: ['Contact & Portfolio/Figma Link', 'Design Systems & Prototyping Skills', 'Product Impact Work Experience', 'Case Studies & User Testing Results', 'Education'],
    topTemplateId: 'modern-minimalist',
    atsAdvice: 'While visual appeal matters for human recruiters, your PDF upload MUST remain single-column text without embedded raster images or hidden text tables so legacy workday parsers can read every Figma and UX competency cleanly.',
  },
  {
    id: 'cybersecurity',
    title: 'Offensive Security & Cloud Infosec Engineer',
    category: 'Cybersecurity & Security',
    icon: ShieldAlert,
    badgeColor: 'from-red-600 to-rose-600',
    description: 'Targeted for Security Engineers, Penetration Testers, SOC Analysts, and Cloud Infosec Specialists.',
    essentialSkills: ['Network Security', 'Penetration Testing (Burp Suite/Metasploit)', 'Cloud IAM & Zero Trust', 'SIEM (Splunk/CrowdStrike)', 'Vulnerability Remediation (CVEs)', 'ISO 27001 / SOC 2 Compliance', 'Python & Bash Scripting', 'OSINT & Threat Hunting'],
    recommendedVerbs: ['Secured', 'Architected', 'Remediated', 'Mitigated', 'Investigated', 'Orchestrated', 'Hardened', 'Formulated'],
    mustHaveSections: ['Contact & LinkedIn/GitHub', 'Security Clearance & Certifications (CISSP/OSCP/CEH)', 'Core Infosec & Penetration Stack', 'Quantified Incident Defense & Vulnerability Work Experience', 'Education'],
    topTemplateId: 'cyber-defense',
    atsAdvice: 'Security ATS bots scan for exact compliance frameworks (NIST, ISO 27001, SOC 2) alongside quantifiable attack surface reductions (e.g. "Mitigated 100% of P1/P2 vulnerabilities within 24 hours of disclosure").',
  },
  {
    id: 'mobiledev',
    title: 'Mobile Systems Architect (iOS/Android)',
    category: 'Mobile Engineering',
    icon: Smartphone,
    badgeColor: 'from-indigo-600 to-blue-600',
    description: 'Engineered for iOS Developers (Swift), Android Engineers (Kotlin), and React Native Cross-Platform Architects.',
    essentialSkills: ['Swift & SwiftUI', 'Kotlin & Jetpack Compose', 'React Native & Expo', 'Mobile CI/CD (Fastlane)', 'CoreData & Realm', 'Memory Optimization & Instruments', 'App Store / Play Store Deployment', 'GraphQL & REST APIs'],
    recommendedVerbs: ['Architected', 'Engineered', 'Spearheaded', 'Optimized', 'Deployed', 'Constructed', 'Orchestrated', 'Refactored'],
    mustHaveSections: ['Contact & App Store/Play Store Links', 'Mobile Tech Stack Grid', 'High-Scale Native App Experience', 'App Launch Metrics & Crash-Free Session Stats', 'Education'],
    topTemplateId: 'apple-mobile',
    atsAdvice: 'Highlight your crash-free user session rate (e.g. "Maintained 99.85% crash-free sessions across 1.2M daily active mobile users") and exact memory footprint reduction percentage in bullet #1.',
  },
  {
    id: 'dataengineer',
    title: 'Big Data & Distributed Systems Engineer',
    category: 'Data Engineering',
    icon: Cpu,
    badgeColor: 'from-teal-600 to-emerald-600',
    description: 'Tailored for Data Engineers, ETL/ELT Pipeline Architects, Snowflake Specialists, and Spark Engineers.',
    essentialSkills: ['Apache Spark & PySpark', 'Snowflake & BigQuery', 'Apache Kafka & Flink', 'Airflow & dbt', 'Python & Scala', 'PostgreSQL & NoSQL', 'Data Warehousing & Dimensional Modeling', 'AWS EMR & S3'],
    recommendedVerbs: ['Engineered', 'Architected', 'Orchestrated', 'Formulated', 'Streamlined', 'Constructed', 'Synthesized', 'Scaled'],
    mustHaveSections: ['Contact & GitHub Links', 'Distributed Data Stack & Warehouses', 'Petabyte-Scale Pipeline Work Experience', 'Data Pipeline Architecture Projects', 'Education'],
    topTemplateId: 'data-pipeline',
    atsAdvice: 'Always quantify data pipeline volume (e.g. "Engineered daily ETL pipelines processing 4.5 TB of real-time event telemetry with 0% data loss") to bypass enterprise data team filters.',
  },
  {
    id: 'engmanager',
    title: 'Engineering Manager & VP of Engineering',
    category: 'Executive Tech Leadership',
    icon: Users,
    badgeColor: 'from-orange-600 to-amber-600',
    description: 'Built for Engineering Managers (EM), Directors of Engineering, Principal Staff Engineers, and Tech Leads.',
    essentialSkills: ['Engineering Team Scaling (15-50+ engineers)', 'Technical Strategy & Roadmap', 'Agile & DORA Metrics', 'System Architecture Oversight', 'Budget & Vendor Management', 'Cross-functional Executive Mentorship', 'Hiring & Performance Reviews'],
    recommendedVerbs: ['Directed', 'Spearheaded', 'Orchestrated', 'Steered', 'Commanded', 'Formulated', 'Grew', 'Mentored'],
    mustHaveSections: ['Contact & LinkedIn URL', 'Executive Summary & Leadership Scope', 'Team Leadership & Strategic Work Experience', 'Quantified DORA & Velocity Improvements', 'Education & Patents'],
    topTemplateId: 'eng-leadership',
    atsAdvice: 'ATS engines for executive leadership scan for team size scaling numbers and DORA metrics (e.g. "Directed 35+ engineers across 5 cross-functional squads, cutting deployment cycle time by 55%").',
  },
];

const FAMOUS_TEMPLATES = [
  {
    id: 'jakes-harvard',
    name: "Jake's Resume / Harvard Single-Column Tech Standard",
    badge: '#1 Most Famous Overleaf Template',
    targetRoles: 'Software Engineers, Full-Stack Developers, DevOps & Technical Roles',
    atsScore: '100 / 100 ATS Parseability',
    description: 'The industry-standard, world-famous Overleaf single-column LaTeX resume template. Clean serif/sans-serif typography with distinct section dividers (`\\titlerule`), strict right-aligned date tabs, and zero table/box leaks.',
    previewFeatures: ['100% Single-Column Linear Parsing', 'Exact Overleaf Letterpaper Geometry', 'Strict N-Gram Keyword Prominence', 'Optimal 0.5-inch Margins'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{hyperref}
\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]`,
  },
  {
    id: 'deedy-resume',
    name: 'Deedy-Resume Tech & Systems Academic Minimal',
    badge: 'Famous CS Graduate Benchmark',
    targetRoles: 'CS Graduates, Systems Engineers, Competitive Programmers & Core Backend',
    atsScore: '100 / 100 ATS Parseability',
    description: 'The legendary Deedy format adapted into a 100% ATS-perfect single-column linear layout. Highly favored by university graduates and competitive algorithm developers targeting FAANG entry & mid-level roles.',
    previewFeatures: ['Linear Single-Column ATS Adaptation', 'Prominent Education & GPA Placement', 'Concise Technical Grid Highlighting', 'Crisp Minimalist Font Weighting'],
    latexSnippet: `\\documentclass[letterpaper,10pt]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{fullpage}
\\section*{Education \\& Competitive Programming Competencies}`,
  },
  {
    id: 'stanford-ai',
    name: 'Stanford Graduate Academic & AI Tech Standard',
    badge: 'Benchmark for AI/ML & Research',
    targetRoles: 'AI Engineers, Data Scientists, ML Researchers & Quantitative Analysts',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Emphasizes technical rigor, academic foundation, open-source model repositories, and quantitative modeling impact. Widely favored by top-tier tech labs (OpenAI, DeepMind, Anthropic, Google Research).',
    previewFeatures: ['Dedicated AI & Research Publications Section', 'Clean Technical Stack Categorization', 'Prominent Numerical Impact Bullets', 'Zero Graphic Artifacts'],
    latexSnippet: `\\documentclass[a4paper,10pt]{article}
\\usepackage{amsmath}
\\usepackage{geometry}
\\geometry{top=0.6in, bottom=0.6in, left=0.6in, right=0.6in}
\\section*{Core Technical Competencies & AI Stack}`,
  },
  {
    id: 'mit-cs',
    name: 'MIT Computer Science & Quantitative Systems Standard',
    badge: 'Elite Concurrency & Systems Standard',
    targetRoles: 'Backend Architects, High-Frequency Trading (HFT) Engineers & Core C++/Rust Developers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Designed for systems engineers who build distributed databases, kernel modules, and low-latency financial systems. Emphasizes microsecond latency optimization and multi-threading concurrency.',
    previewFeatures: ['Microsecond Latency Metric Prominence', 'Systems Language Grid (C++/Rust/Go)', 'High-Throughput Architectural Layout', 'Strict Single-Column Clean ATS Tabs'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{charter}
\\usepackage{titlesec}
\\titleformat{\\section}{\\large\\bfseries}{}{0pt}{}[\\hrule]
\\section*{Distributed Systems \\& High-Frequency Architecture}`,
  },
  {
    id: 'faang-exec',
    name: 'FAANG Executive & Senior Leadership Standard',
    badge: 'Best for PMs & Group Leads',
    targetRoles: 'Product Managers, Engineering Directors, Technical Program Managers (TPMs) & Senior Staff',
    atsScore: '99 / 100 ATS Parseability',
    description: 'Prioritizes executive summaries, quantifiable business outcomes ($/%), roadmap direction, and cross-functional leadership. Uses bold header accents and crisp executive spacing.',
    previewFeatures: ['Executive Competency Grid', 'Strategic KRs & Revenue Impact Focus', 'Leadership & Mentorship Highlights', 'Crisp Enterprise Scannability'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{enumitem}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\section*{Executive Summary & Strategic Impact}`,
  },
  {
    id: 'mckinsey-consulting',
    name: 'McKinsey / Ivy League Management Consulting Standard',
    badge: 'Top Strategy & Finance Benchmark',
    targetRoles: 'Business Analysts, Financial Analysts, Strategy Leads & Operations Managers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'The definitive serif/sans-serif linear format used by management consultants at McKinsey, BCG, and Bain. Highlights revenue generation ($), EBITDA expansion, and quantitative case study results.',
    previewFeatures: ['Classic Serif Executive Typography', 'Revenue & EBITDA Expansion Prominence', 'Strategic Framework Bullet Structure', '100% Linear Taleo/Workday Compatibility'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{mathptmx} % Garamond/Times Executive font
\\usepackage{titlesec}
\\titleformat{\\section}{\\scshape\\bfseries\\large}{}{0pt}{}[\\titlerule]
\\section*{Consulting Case Studies \\& Financial Outcomes}`,
  },
  {
    id: 'google-sre',
    name: 'Google SRE & Cloud Systems Reliability Standard',
    badge: 'Gold Standard for DevOps & SRE',
    targetRoles: 'Site Reliability Engineers (SRE), Cloud Systems Architects & Platform Engineers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Tailored strictly around Infrastructure-as-Code (`Terraform/Kubernetes`), 99.99% availability metrics, automated incident remediation, and multi-region AWS/GCP cloud deployments.',
    previewFeatures: ['99.99% Uptime & SLA Prominence', 'Infrastructure-as-Code Stack Groupings', 'Automated CI/CD Pipeline Blueprint', 'Strict Linear Parsing Geometry'],
    latexSnippet: `\\documentclass[letterpaper,10pt]{article}
\\usepackage{fullpage}
\\usepackage{enumitem}
\\section*{Cloud Infrastructure \\& Reliability Engineering}`,
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Tech Minimalist Standard',
    badge: 'Clean Typography & Hierarchy',
    targetRoles: 'Product Designers, UI/UX Specialists, Frontend Architects & Modern Developers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'A sleek, modern aesthetic that uses elegant font weights and clean spacing without violating ATS linear reading order. Perfect for creative technologists who demand visual polish alongside 100% Workday/Taleo compliance.',
    previewFeatures: ['Sleek Typography Hierarchy', 'ATS-Clean Linear Text Flow', 'Optimized Contact & Portfolio Header', 'High Visual Appeal without Tables'],
    latexSnippet: `\\documentclass[11pt,a4paper]{article}
\\usepackage{fontspec}
\\usepackage{xcolor}
\\definecolor{darkblue}{RGB}{15,32,67}
\\section*{\\color{darkblue}Professional Experience}`,
  },
  {
    id: 'cyber-defense',
    name: 'Offensive Security & Cyber Defense Standard',
    badge: 'Top InfoSec & SOC Benchmark',
    targetRoles: 'Security Engineers, Ethical Hackers, SOC Analysts & Penetration Testers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Structured around vulnerability mitigation (`CVEs`), penetration testing methodologies, Zero Trust cloud architectures, and strict SOC 2 / ISO 27001 regulatory compliance tracking.',
    previewFeatures: ['Security Clearance & Certification Header', 'Attack Surface Mitigation Prominence', 'Penetration & SIEM Tool Grid', 'Zero Table or Text-Box Leaks'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{titlesec}
\\usepackage{fullpage}
\\section*{Security Certifications \\& Cyber Defense Competencies}`,
  },
  {
    id: 'apple-mobile',
    name: 'Apple iOS & Android Mobile Systems Architect Standard',
    badge: 'Top Mobile & Native Benchmark',
    targetRoles: 'iOS Developers (Swift), Android Engineers (Kotlin) & React Native Architects',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Built specifically for high-scale mobile engineers. Emphasizes App Store / Google Play rating stability, crash-free session statistics (`99.8%+`), and native memory instrumentation.',
    previewFeatures: ['App Store Launch & MAU Metrics', 'Native Swift/Kotlin & Expo Stack Grid', 'Memory & Battery Optimization Focus', 'Clean Linear Single-Column Flow'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}
\\section*{Mobile Systems Architecture \\& App Store Achievements}`,
  },
  {
    id: 'data-pipeline',
    name: 'Data Systems & Big Data Engineering Standard',
    badge: 'Benchmark for Snowflake & Spark',
    targetRoles: 'Data Engineers, Big Data Pipeline Architects, ETL Specialists & BI Engineers',
    atsScore: '100 / 100 ATS Parseability',
    description: 'Optimized for petabyte-scale data engineering. Highlights real-time Spark/Kafka telemetry throughput, Snowflake schema optimization, and zero-data-loss pipeline reliability.',
    previewFeatures: ['Petabyte / Terabyte Throughput Metrics', 'Warehouse & Pipeline Stack Categorization', 'ETL/ELT Latency Reduction Focus', '100% Linear ATS Readability'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{fullpage}
\\section*{Distributed Data Architecture \\& Pipeline Engineering}`,
  },
  {
    id: 'eng-leadership',
    name: 'Engineering Manager & VP of Engineering Standard',
    badge: 'Top Executive Leadership Standard',
    targetRoles: 'Engineering Managers (EM), Directors of Engineering & Principal Staff Leads',
    atsScore: '99 / 100 ATS Parseability',
    description: 'Showcases cross-functional team scaling (`managed 35+ engineers`), DORA metrics acceleration, sprint cycle reduction (`-50%`), and multimillion-dollar cloud budget oversight.',
    previewFeatures: ['Team Scaling & Budget Management Scope', 'DORA Metric & Release Velocity Focus', 'Engineering Strategy & Roadmap Layout', 'Crisp Executive Section Dividers'],
    latexSnippet: `\\documentclass[letterpaper,11pt]{article}
\\usepackage{titlesec}
\\section*{Leadership Scope \\& Engineering Management Experience}`,
  },
];

export default function Templates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(ROLE_RECOMMENDATIONS[0]);
  const [downloadingTemplateId, setDownloadingTemplateId] = useState(null);
  const [creatingProfileId, setCreatingProfileId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(ROLE_RECOMMENDATIONS.map((r) => r.category)))];

  const filteredRoles = ROLE_RECOMMENDATIONS.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.essentialSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    return matchesQuery && matchesCat;
  });

  const handleDownloadLatexTemplate = (template) => {
    setDownloadingTemplateId(template.id);
    try {
      const targetRole = selectedRole || ROLE_RECOMMENDATIONS[0];
      const latexContent = `${template.latexSnippet}
% --------------------------------------------------------
% ${template.name} - Overleaf & ATS Source
% Target Career Role: ${targetRole.title}
% Generated by ResumeIQ MERN Intelligence
% --------------------------------------------------------
\\begin{document}

\\begin{center}
    {\\Huge \\scshape Your Full Name} \\\\[2pt]
    \\small +1-555-019-9832 $|$ \\href{mailto:you@example.com}{\\underline{you@example.com}} $|$ 
    \\href{https://linkedin.com/in/yourprofile}{\\underline{linkedin.com/in/yourprofile}} $|$
    \\href{https://github.com/yourprofile}{\\underline{github.com/yourprofile}}
\\end{center}

\\section{Professional Summary}
Results-driven ${targetRole.title} specializing in building high-concurrency, scalable systems and delivering data-driven solutions. Proven track record of spearheading cross-functional technical initiatives, optimizing architecture, and delivering verified measurable impact ahead of schedule.

\\section{Technical Skills \\& Tools}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Core Competencies}{: ${targetRole.essentialSkills.slice(0, 5).join(', ')}} \\\\[2pt]
     \\textbf{Systems \\& Frameworks}{: ${targetRole.essentialSkills.slice(5).join(', ') || 'Docker, Kubernetes, AWS CI/CD'}} \\\\[2pt]
     \\textbf{Action Leadership Verbs}{: ${targetRole.recommendedVerbs.slice(0, 6).join(', ')}}
    }}
\\end{itemize}

\\section{Professional Experience}
\\noindent
\\textbf{Senior ${targetRole.title}} \\hfill {Jan 2024 -- Present} \\\\[1pt]
\\textit{Enterprise Systems Corp} \\hfill {San Francisco, CA}
\\begin{itemize}[leftmargin=0.25in]
    \\item ${targetRole.recommendedVerbs[0] || 'Spearheaded'} the architectural design and deployment of core engineering infrastructure utilizing ${targetRole.essentialSkills[0] || 'React'} and ${targetRole.essentialSkills[1] || 'Node.js'}, reducing average response latency by 42\\%.
    \\item ${targetRole.recommendedVerbs[1] || 'Architected'} high-concurrency workflows and data pipelines with ${targetRole.essentialSkills[2] || 'PostgreSQL'}, scaling platform throughput to support over 150,000 daily requests during peak operations.
    \\item ${targetRole.recommendedVerbs[2] || 'Formulated'} automated testing and deployment pipelines via CI/CD, saving the engineering team 14 hours weekly and eliminating deployment rollback errors.
\\end{itemize}

\\noindent
\\textbf{Technical Specialist / Engineer} \\hfill {Jun 2021 -- Dec 2023} \\\\[1pt]
\\textit{CloudScale Technologies} \\hfill {New York, NY}
\\begin{itemize}[leftmargin=0.25in]
    \\item ${targetRole.recommendedVerbs[3] || 'Engineered'} interactive frontend dashboards and backend services using ${targetRole.essentialSkills[3] || 'TypeScript'}, boosting user engagement by 28\\% across 250,000 monthly active users.
    \\item Collaborated with product managers and cross-functional teams to launch real-time analytics features on time and 15\\% under budget.
\\end{itemize}

\\section{Education}
\\noindent
\\textbf{Bachelor of Science in Computer Science} \\hfill {2018 -- 2022} \\\\[1pt]
\\textit{University of Engineering \\& Technology} \\hfill {GPA: 3.9 / 4.0}

\\end{document}
`;
      const blob = new Blob([latexContent], { type: 'application/x-tex' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${template.id}_${targetRole.id}_ATS_Template.tex`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`📥 Downloaded Overleaf LaTeX (.tex) for ${template.name}!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to download template.');
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  const handleCreateProfileFromTemplate = async (template, roleData = null) => {
    if (!user) {
      toast.info('Please sign in first to create a live ATS resume profile!');
      navigate('/login');
      return;
    }

    setCreatingProfileId(template.id);
    try {
      const targetRole = roleData || selectedRole || ROLE_RECOMMENDATIONS[0];
      const initialResumeData = {
        contact: {
          fullName: user?.fullName || 'Your Name',
          email: user?.email || 'you@example.com',
          phone: '+1-555-019-9832',
          location: 'San Francisco, CA',
          linkedinUrl: 'https://linkedin.com/in/yourprofile',
          githubUrl: 'https://github.com/yourprofile',
        },
        summary: `Results-driven ${targetRole.title} with expertise in high-concurrency systems and quantifiable engineering impact. Proven track record of spearheading cross-functional initiatives, optimizing architecture, and delivering high-ROI outcomes.`,
        skills: {
          hardSkills: targetRole.essentialSkills.slice(0, 6),
          tools: targetRole.essentialSkills.slice(6),
          softSkills: ['Leadership', 'System Architecture', 'Cross-functional Collaboration', 'Agile Execution'],
        },
        workExperience: [
          {
            id: 'work-1',
            company: 'Tech Enterprise Corp',
            title: targetRole.title,
            startDate: 'Jan 2024',
            endDate: 'Present',
            current: true,
            bullets: [
              `${targetRole.recommendedVerbs[0] || 'Spearheaded'} the design and deployment of core engineering infrastructure utilizing ${targetRole.essentialSkills[0] || 'React'} and ${targetRole.essentialSkills[1] || 'Node.js'}, reducing system latency by 38%.`,
              `${targetRole.recommendedVerbs[1] || 'Architected'} high-concurrency workflows and data pipelines with ${targetRole.essentialSkills[2] || 'PostgreSQL'}, scaling platform throughput to support 150,000+ daily requests.`,
              `${targetRole.recommendedVerbs[2] || 'Formulated'} automated testing and deployment pipelines via CI/CD, saving the engineering team 14 hours weekly.`,
            ],
          },
          {
            id: 'work-2',
            company: 'CloudScale Technologies',
            title: `Junior / Mid ${targetRole.title.split(' ')[1] || 'Engineer'}`,
            startDate: 'Jun 2021',
            endDate: 'Dec 2023',
            current: false,
            bullets: [
              `${targetRole.recommendedVerbs[3] || 'Engineered'} scalable features and enterprise modules using ${targetRole.essentialSkills[3] || 'TypeScript'}, boosting customer satisfaction by 28%.`,
              `Collaborated across squads to deliver mission-critical software releases 2 weeks ahead of schedule.`,
            ],
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'University of Engineering',
            degree: 'Bachelor of Science in Computer Science',
            fieldOfStudy: 'Computer Science',
            startDate: '2018',
            endDate: '2022',
            gpa: '3.9',
          },
        ],
        projects: [
          {
            id: 'proj-1',
            name: `${targetRole.title.split(' ')[0]} High-Performance Architecture Project`,
            technologies: targetRole.essentialSkills.slice(0, 4).join(', '),
            description: `Engineered a full-stack real-time monitoring and analytics module leveraging ${targetRole.essentialSkills[0] || 'TypeScript'}, boosting operational visibility by 45%.`,
          },
        ],
      };

      const res = await axios.post('/api/resumes', {
        title: `${targetRole.title} (${template.badge.split(' ')[0]} Template)`,
        targetJobTitle: targetRole.title,
        contentJson: JSON.stringify(initialResumeData),
      });

      const targetId = res.data && (res.data._id || res.data.id || res.data.resumeId);
      if (targetId && targetId !== 'undefined') {
        toast.success(`⚡ Created fresh ${targetRole.title} profile! Opening Overleaf Code Studio...`);
        navigate(`/resume/${targetId}/editor?mode=overleaf&template=${template.id}`);
      } else {
        toast.success('Profile created!');
        navigate('/dashboard');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to create resume from template. Please try again.');
    } finally {
      setCreatingProfileId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Hero Banner */}
      <section className="relative py-16 sm:py-24 border-b border-border/60 overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[650px] h-[350px] bg-gradient-to-tr from-purple-600 via-blue-600 to-indigo-600 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-blue-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Famous 100% ATS-Verified Templates Library</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            World-Famous ATS Templates & <span className="gradient-text">Role-Based AI Guide</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create authentic Overleaf-ready LaTeX (`.tex`) resumes using 12+ industry-benchmark templates trusted by engineers at FAANG, Ivy League consultancies, and top AI labs. Explore exact hard skills, leadership verbs, and quantified metrics tailored for all 10 major career tracks.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* SECTION 1: ROLE-BASED RECOMMENDATION ENGINE */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Job Role Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Role-Based ATS Recommendations & Checklist ({ROLE_RECOMMENDATIONS.length} Roles)
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Select your target career path below to unlock recommended hard skills, elite action verbs, and section blueprints.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles or skills..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategoryFilter === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredRoles.map((role) => {
              const Icon = role.icon || Briefcase;
              const isSelected = selectedRole?.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-secondary/90 to-card border-blue-500/60 shadow-lg shadow-blue-500/10 scale-[1.02]'
                      : 'bg-card/60 hover:bg-card border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${role.badgeColor} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black leading-snug text-foreground">{role.title}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">{role.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Role Deep Breakdown Panel */}
          {selectedRole && (
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/40">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
                      {selectedRole.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified ATS Blueprint
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground">{selectedRole.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedRole.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleCreateProfileFromTemplate(FAMOUS_TEMPLATES[0], selectedRole)}
                    disabled={creatingProfileId !== null}
                    className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Edit {selectedRole.title.split(' ')[0]} Profile Now</span>
                  </button>
                </div>
              </div>

              {/* 3 Column Blueprint Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Essential Skills */}
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Essential Hard Skills
                    </h4>
                    <span className="text-[10px] font-bold text-muted-foreground">High ATS Weight</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.essentialSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold flex items-center gap-1"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                    Include these exact keywords inside your Skills grid and Work Experience bullets.
                  </p>
                </div>

                {/* 2. Action Verbs */}
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Recommended Action Verbs
                    </h4>
                    <span className="text-[10px] font-bold text-muted-foreground">Start Every Bullet</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRole.recommendedVerbs.map((verb, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold"
                      >
                        {verb}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                    Avoid passive starters like 'Responsible for' or 'Worked on'. Lead immediately with these verbs.
                  </p>
                </div>

                {/* 3. Must-Have Sections */}
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Required Sections Check
                    </h4>
                    <span className="text-[10px] font-bold text-muted-foreground">Pillar 3 Structure</span>
                  </div>
                  <ul className="space-y-2">
                    {selectedRole.mustHaveSections.map((sec, idx) => (
                      <li key={idx} className="text-xs text-foreground font-semibold flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Role ATS Expert Rationale Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-black text-lg">
                  💡
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                    ATS Scanner & Recruiter Secret for {selectedRole.title}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {selectedRole.atsAdvice}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: FAMOUS TEMPLATES GALLERY */}
        <section className="space-y-8 pt-4">
          <div className="border-b border-border/40 pb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
              <FileText className="w-4 h-4" />
              <span>Overleaf & ATS Benchmarks ({FAMOUS_TEMPLATES.length} World-Class Layouts)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Famous 100% ATS-Verified Templates Library
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select any of our 12 world-renowned templates below to instantly create and customize your live resume profile or download Overleaf `.tex` source code tailored to your target job role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FAMOUS_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xl flex flex-col justify-between gap-6 hover:border-blue-500/50 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                      {tpl.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> {tpl.atsScore}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-blue-400 transition-colors">
                    {tpl.name}
                  </h3>

                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Best For: {tpl.targetRoles}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {tpl.previewFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-foreground/90 bg-secondary/50 p-2.5 rounded-xl border border-border/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Code preview snippet */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-border/40 font-mono text-[11px] text-muted-foreground overflow-x-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1">
                      <Code className="w-3 h-3" /> Overleaf LaTeX Source Header (`.tex`)
                    </div>
                    <pre className="whitespace-pre-wrap text-emerald-400/90 leading-tight">
                      {tpl.latexSnippet}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/40">
                  <button
                    onClick={() => handleCreateProfileFromTemplate(tpl, selectedRole)}
                    disabled={creatingProfileId === tpl.id}
                    className="w-full sm:w-1/2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>⚡ Create & Edit With Template</span>
                  </button>

                  <button
                    onClick={() => handleDownloadLatexTemplate(tpl)}
                    disabled={downloadingTemplateId === tpl.id}
                    className="w-full sm:w-1/2 px-4 py-3.5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs border border-border/80 flex items-center justify-center gap-2 transition-all shadow-sm hover:border-purple-500/40"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Download Overleaf (`.tex`)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Box */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Run a Live 6-Pillar ATS Scan on Your New Template?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload your customized PDF or DOCX resume to get instant quantitative diagnostics, action verb scoring, and skill gap analysis against target job descriptions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/resume/new"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch ATS Scanner Now</span>
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-sm border border-border/80 transition-all"
            >
              <span>Go to Dashboard</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
