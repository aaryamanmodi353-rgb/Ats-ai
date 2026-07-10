import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    roleTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ['applied', 'interview', 'rejected', 'offer'],
      default: 'applied',
    },
    resumeVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      default: null,
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
