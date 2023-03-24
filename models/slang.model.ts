import { Schema, model } from 'mongoose';

const slangSchema = new Schema(
  {
    title: String,
    description: String,
    submittedById: String,
    usage: [String],
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved'],
    },
    likedByIds: [String],
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

slangSchema.virtual('likedBy', {
  ref: 'User',
  localField: 'likedByIds',
  foreignField: 'uid',
  justOne: false,
});

const Slang = model('Slang', slangSchema);

export default Slang;
