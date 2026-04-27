import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    }
  },
  { timestamps: true }
);

projectSchema.virtual('id').get(function id() {
  return this._id.toHexString();
});

projectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  }
});

projectSchema.pre('findOneAndDelete', async function cleanupTasks(next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const { Task } = await import('./Task.js');
    await Task.deleteMany({ project: doc._id });
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
