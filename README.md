# 🚀 ATS-AI (`ResumeIQ`) — Enterprise 6-Pillar Deterministic MERN ATS Optimization Platform

[![MIT License](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-blue.svg)](https://nodejs.org/)
[![Vite + React](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-indigo.svg)](https://vitejs.dev/)
[![Express + MongoDB](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-emerald.svg)](https://expressjs.com/)

**ATS-AI (`ResumeIQ`)** is a full-stack MERN platform designed to demystify Applicant Tracking Systems (Workday, Taleo, Greenhouse, iCIMS). Unlike generic AI wrappers that hallucinate skills or output unparseable layouts, **ATS-AI** uses a **Deterministic 6-Pillar Scoring Engine** combined with N-gram keyword extraction, structural parseability audits, and anti-fabrication bullet rewrite guardrails.

---

## ✨ Key Features

### 🔍 1. Deterministic 6-Pillar ATS Audit Engine
Our proprietary algorithm calculates a composite compatibility score (`0-100`) weighted across six foundational resume dimensions:
1. **Exact N-Gram Keyword Match Rate (30% Weight)**: Evaluates required hard skills, preferred credentials, and software tools against target job descriptions with double penalties for missing mandatory competencies.
2. **Formatting & Parseability Audit (15% Weight)**: Automatically detects structural traps—such as multi-column sidebars, table grids, non-standard section headers, and contact information leaks—that cause left-to-right ATS parser failures.
3. **Quantification & Impact Breakdown (15% Weight)**: Scans every work experience bullet for concrete metrics (`%`, `$`, multiplier numbers) to reward quantifiable achievements over vague responsibilities.
4. **Action-Verb Power Score (15% Weight)**: Rewards strong leadership and technical action verbs (`Architected`, `Spearheaded`, `Engineered`) while flagging weak passive phrases (`Responsible for`, `Assisted with`).
5. **Seniority & Competency Alignment (15% Weight)**: Matches candidate vocabulary against detected job seniority levels (`Junior/Entry`, `Mid-Level`, `Senior/Staff`, or `Leadership/Manager`).
6. **Readability & Skim-ability Audit (10% Weight)**: Validates bullet lengths against the optimal 12–28 word skim density window for recruiter review.

### ⚡ 2. One-Click Auto-Skill Injection & Recalculation
- **Instant Keyword Optimization**: Click **⚡ Auto-Inject Missing Skills** on the score report to safely merge exact missing hard skills and tool credentials into your profile.
- **Snapshot Versioning**: Automatically generates version snapshots (`v1.0 + Pro Keywords`) and dynamically recalculates your composite ATS score in real time.

### ✍️ 3. AI Bullet Rewrite Coach & Anti-Fabrication Guardrails
- **Granular Bullet-by-Bullet Review**: Inspect every experience bullet with real-time highlights for weak verbs and missing numbers.
- **Anti-Fabrication Suggestions**: Generate high-impact, quantifiable rewrite suggestions tailored to the specific target job description while preserving factual integrity.

### 🛠️ 4. Live Heuristic Resume Editor & Clean Export
- **Real-Time Live Scoring**: Edit candidate summaries, hard skills, and experience bullets in our interactive editor while watching your live ATS compatibility heuristic update instantaneously.
- **Clean Single-Column Exporter**: Export fully optimized profiles directly to clean, single-column **`.docx`** or **`.txt`** formats guaranteed to parse seamlessly through enterprise ATS systems without table or column errors.

### 📊 5. Integrated Job Application Kanban Tracker
- Keep track of targeted roles (`Applied`, `Interviewing`, `Offer`, `Rejected`) alongside your tailored resume version snapshots.

---

## 🏗️ System Architecture & Tech Stack

```mermaid
graph TD
    Client[React 18 + Vite + Tailwind CSS] -->|REST / Axios| API[Express + Node.js API Gateway]
    API -->|In-Memory Buffer| Multer[Multer Document Ingester]
    Multer --> Parser[ParserService: Text Extraction & Layout Trap Detector]
    API --> Scoring[ScoringService: 6-Pillar Pro Formula & TF-IDF Engine]
    API --> Exporter[ExportService: Clean DOCX & Stream Generator]
    Parser & Scoring & Exporter -->|Mongoose ORM| DB[(MongoDB / Mongoose Storage)]
```

### **Frontend**
- **Framework**: React 18 with Vite for lightning-fast HMR and building.
- **Styling**: Tailwind CSS with custom glassmorphic cards, gradients, and modern dark-theme aesthetics.
- **Icons & UI**: `lucide-react` icons and `sonner` for crisp toast notifications.
- **Routing**: React Router v6 (`LandingPage`, `Dashboard`, `NewScan`, `ScoreReport`, `ResumeEditor`, `Applications`, `Settings`).

### **Backend**
- **Runtime & Server**: Node.js (v18+) with Express.js.
- **Database**: MongoDB with Mongoose ORM (`Resume`, `ResumeVersion`, `JobDescription`, `ScoreReport`, `Application` models).
- **Document Processing**: `multer` memory storage for secure in-memory ingestion (`.pdf`, `.docx`, `.txt` support).
- **Core Services**: Modular business logic separated cleanly into `ParserService`, `ScoringService`, `ExportService`, and `AiService`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/ats-ai`) or MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/aaryamanmodi353-rgb/Ats-ai.git
cd Ats-ai
```

### 2. Environment Setup
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ats-ai
NODE_ENV=development
```

### 3. Install Dependencies & Start Development Servers

#### Option A: Concurrent Run from Root (if root scripts configured) or Dual Terminal

**Terminal 1 — Backend API Server (`http://localhost:5000`)**:
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend Vite Application (`http://localhost:5173`)**:
```bash
cd frontend
npm install
npm run dev
```

Once both servers are running, open your browser to **[http://localhost:5173](http://localhost:5173)** to launch the platform.

---

## 📖 How to Use the Platform

1. **Upload or Paste Candidate Resume**:
   - Navigate to **New Scan** (`/resume/new`).
   - Drag and drop your `.pdf` / `.docx` / `.txt` file or paste your raw resume text directly.
2. **Provide Target Job Description**:
   - Paste the full job posting requirements or provide a job URL to run N-gram exact keyword extraction.
3. **Run Instant 4-Pillar ATS Audit**:
   - Click **Run Instant 4-Pillar ATS Audit** to trigger deterministic N-gram parsing and layout trap checks.
4. **Inspect Score & Auto-Inject Missing Keywords**:
   - Review your `0-100` composite score and the 6-pillar breakdowns (`Keywords`, `Format`, `Metrics`, `Action Verbs`, `Seniority`, `Readability`).
   - Click **⚡ Auto-Inject Missing Skills** to immediately add missing exact hard skills to your resume snapshot and recalculate your compatibility rating.
5. **Edit & Export Clean Single-Column Documents**:
   - Open your snapshot inside the **Live Editor** (`/resume/:id/editor`).
   - Polish bullets using the **AI Bullet Coach** and click **Export DOCX** or **Export TXT** to download your ATS-ready resume!

---

## 🔒 Security & Privacy

- **Local Processing**: By default, resumes and job descriptions are parsed in-memory and stored in your isolated database.
- **Zero PII Leakage**: Candidates can clear cached snapshots and personal identifiable information (PII) at any time from the **Settings** (`/settings`) panel (`Purge PII & Cache`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/aaryamanmodi353-rgb/Ats-ai/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](https://opensource.org/licenses/MIT) file for details.
