import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema(
  {
    roleTitle: { type: String, default: 'Target Job Description' },
    companyName: { type: String, default: '' },
    rawText: { type: String, required: true },
    sourceUrl: { type: String, default: '' },
    extractedKeywordsJson: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.JobDescription || mongoose.model('JobDescription', jobDescriptionSchema);
