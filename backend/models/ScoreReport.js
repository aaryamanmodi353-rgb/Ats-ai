import mongoose from 'mongoose';

const scoreReportSchema = new mongoose.Schema(
  {
    resumeVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      required: true,
    },
    jobDescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDescription',
      required: true,
    },
    keywordScore: { type: Number, required: true },
    formatScore: { type: Number, required: true },
    quantificationScore: { type: Number, required: true },
    actionVerbScore: { type: Number, required: true },
    seniorityScore: { type: Number, default: 80 },
    readabilityScore: { type: Number, default: 85 },
    compositeScore: { type: Number, required: true },
    breakdownJson: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ScoreReport || mongoose.model('ScoreReport', scoreReportSchema);
