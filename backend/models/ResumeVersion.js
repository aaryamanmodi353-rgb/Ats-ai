import mongoose from 'mongoose';

const resumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    versionLabel: { type: String, default: 'v1.0 - Initial Upload' },
    contentJson: { type: String, required: true },
    atsScore: { type: Number, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeVersionSchema.virtual('scoreReports', {
  ref: 'ScoreReport',
  localField: '_id',
  foreignField: 'resumeVersionId',
});

resumeVersionSchema.set('toObject', { virtuals: true });
resumeVersionSchema.set('toJSON', { virtuals: true });

export default mongoose.models.ResumeVersion || mongoose.model('ResumeVersion', resumeVersionSchema);
