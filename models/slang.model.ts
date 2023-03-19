import { Schema, model } from 'mongoose';

const slangSchema = new Schema(
  {
    title: String,
    description: String,
    submittedById: String,
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    usage: [String],
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved'],
    },
    additionalInfo: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

slangSchema.virtual('submittedBy', {
  ref: 'User',
  localField: 'submittedById',
  foreignField: 'uid',
  justOne: true,
});

const Slang = model('Slang', slangSchema);

export default Slang;
