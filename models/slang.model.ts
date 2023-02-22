import { Schema, model } from 'mongoose';

const slangSchema = new Schema(
  {
    title: String,
    description: String,
    submittedById: String
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
})

const Slang = model('Slang', slangSchema);

export default Slang;