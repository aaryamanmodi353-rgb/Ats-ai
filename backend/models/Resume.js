import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    originalFilename: { type: String, required: true },
    rawText: { type: String, default: '' },
    contactJson: { type: String, default: '{}' },
    layoutRisksJson: { type: String, default: '[]' },
  },
  { timestamps: true }
);

// Virtual relationship to versions
resumeSchema.virtual('versions', {
  ref: 'ResumeVersion',
  localField: '_id',
  foreignField: 'resumeId',
});

resumeSchema.set('toObject', { virtuals: true });
resumeSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
