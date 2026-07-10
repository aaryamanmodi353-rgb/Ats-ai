import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import resumeRoutes from './routes/resumes.js';
import jdRoutes from './routes/jobDescriptions.js';
import scoreRoutes from './routes/score.js';
import aiRoutes from './routes/ai.js';
import appRoutes from './routes/applications.js';
import authRoutes from './routes/auth.js';

import Resume from './models/Resume.js';
import ResumeVersion from './models/ResumeVersion.js';
import JobDescription from './models/JobDescription.js';
import ScoreReport from './models/ScoreReport.js';
import Application from './models/Application.js';
import User from './models/User.js';
import { ScoringService } from './services/scoringService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API Routes
app.use('/api', resumeRoutes);
app.use('/api', jdRoutes);
app.use('/api', scoreRoutes);
app.use('/api', aiRoutes);
app.use('/api', appRoutes);
app.use('/api', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Welcome endpoint for root /
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 60px auto; padding: 40px; border-radius: 16px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; text-align: center;">
      <h1 style="color: #38bdf8; margin-bottom: 16px;">🚀 ResumeIQ Backend API Running</h1>
      <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">You have connected to the Express.js + MongoDB API server on Port <strong>5000</strong>.</p>
      <div style="margin: 30px 0; padding: 20px; border-radius: 12px; background: #1e293b; border: 1px solid #475569;">
        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">To access the visual candidate platform and live editor, open the React UI at:</p>
        <a href="http://localhost:5173" style="display: inline-block; margin-top: 12px; font-size: 18px; font-weight: bold; color: #38bdf8; text-decoration: none;">👉 http://localhost:5173</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">API endpoints are mounted at <code>/api/*</code></p>
    </div>
  `);
});

async function connectDBAndSeed() {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI found in .env. Starting zero-config in-memory MongoDB instance via mongodb-memory-server...');
      const mongod = await MongoMemoryServer.create({
        instance: { port: 27017, dbName: 'resumeiq' },
      });
      mongoUri = mongod.getUri();
      console.log(`In-Memory MongoDB Started at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB database successfully.');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial Alex Morgan demo user account...');
      await User.create({
        fullName: 'Alex Morgan',
        email: 'alex.morgan@dev-portfolio.com',
        password: 'password123',
      });
    }

    // Auto-seed demo data if empty
    const resumeCount = await Resume.countDocuments();
    if (resumeCount === 0) {
      console.log('Seeding initial Alex Morgan demo candidate data and job descriptions...');
      
      const alexContact = {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@dev-portfolio.com',
        phone: '(555) 019-2834',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alex-morgan-dev',
      };

      const alexSummary = 'Senior Software Engineer with 6+ years of experience architecting high-concurrency cloud systems and responsive web applications. Proven track record in TypeScript, Node.js, and modern React ecosystems.';

      const alexExperience = [
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

      const alexSkills = {
        hardSkills: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
        softSkills: ['Technical Leadership', 'Agile/Scrum', 'Cross-functional Collaboration', 'Mentorship'],
        tools: ['Git', 'Docker', 'AWS', 'Vite', 'Postman', 'Redis', 'Kubernetes'],
      };

      const alexData = {
        contact: alexContact,
        summary: alexSummary,
        workExperience: alexExperience,
        education: [
          {
            id: 'edu-1',
            institution: 'University of California, Berkeley',
            degree: 'B.S. in Computer Science',
            graduationDate: 'May 2019',
            details: 'Dean\'s Honor List, President of Web Development Club.',
          },
        ],
        skills: alexSkills,
        certifications: ['AWS Certified Solutions Architect – Associate'],
        rawText: 'Alex Morgan React TypeScript Node.js Express.js MongoDB PostgreSQL Docker AWS Redis',
        layoutRiskWarnings: ['Detected 2-column sidebar formatting in original PDF header.'],
      };

      const resume = await Resume.create({
        originalFilename: 'Alex_Morgan_Senior_FullStack_Resume.pdf',
        rawText: alexData.rawText,
        contactJson: JSON.stringify(alexContact),
        layoutRisksJson: JSON.stringify(alexData.layoutRiskWarnings),
      });

      const version = await ResumeVersion.create({
        resumeId: resume._id,
        versionLabel: 'v1.0 - Baseline Scan',
        contentJson: JSON.stringify(alexData),
        atsScore: 68,
      });

      // Target Job Description Seed
      const jdKeywords = {
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
        preferredSkills: ['Redis', 'Next.js', 'GraphQL'],
        toolsAndSoftware: ['Git', 'Docker', 'Kubernetes'],
        certifications: ['AWS Certified Solutions Architect'],
        softSkills: ['Communication', 'Technical Leadership'],
        highWeightPhrases: ['scalable web applications', 'microservices architecture', 'high-concurrency APIs'],
      };

      const jd = await JobDescription.create({
        roleTitle: 'Senior Full Stack Engineer',
        companyName: 'Stripe / Tech Corp',
        rawText: `Looking for a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, and PostgreSQL to build scalable web applications. Must have experience with Docker and AWS.`,
        sourceUrl: 'https://careers.example.com/senior-engineer',
        extractedKeywordsJson: JSON.stringify(jdKeywords),
      });

      // Initial Score calculation & report seed
      const scoreCalc = ScoringService.calculateCompositeScore(alexData, jdKeywords);
      await ScoreReport.create({
        resumeVersionId: version._id,
        jobDescriptionId: jd._id,
        keywordScore: scoreCalc.keywordScore,
        formatScore: scoreCalc.formatScore,
        quantificationScore: scoreCalc.quantificationScore,
        actionVerbScore: scoreCalc.actionVerbScore,
        compositeScore: scoreCalc.compositeScore,
        breakdownJson: JSON.stringify(scoreCalc.breakdown),
      });

      // Seed Kanban Application tracking items
      await Application.create([
        { companyName: 'Stripe', roleTitle: 'Senior Full Stack Engineer', status: 'interview', resumeVersionId: version._id },
        { companyName: 'AirBnB', roleTitle: 'Staff Frontend Engineer', status: 'applied', resumeVersionId: version._id },
        { companyName: 'Netflix', roleTitle: 'Node.js Backend Systems Engineer', status: 'offer', resumeVersionId: version._id },
        { companyName: 'Legacy Bank Corp', roleTitle: 'Java & Oracle Specialist', status: 'rejected', resumeVersionId: version._id },
      ]);

      console.log('Demo database seeded successfully!');
    }
  } catch (error) {
    console.error('Database connection or seeding error:', error);
  }
}

app.listen(PORT, async () => {
  console.log(`ResumeIQ Express.js Backend running on http://localhost:${PORT}`);
  await connectDBAndSeed();
});

export default app;
