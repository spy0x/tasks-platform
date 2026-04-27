import mongoose from 'mongoose';

export const TASK_CATEGORIES = ['backlog', 'todo', 'in_progress', 'done'];
export const EISENHOWER_TAGS = ['do', 'schedule', 'delegate', 'eliminate', 'none'];

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      default: 'todo',
      index: true
    },
    eisenhowerTag: {
      type: String,
      enum: EISENHOWER_TAGS,
      default: 'none'
    },
    priority: {
      type: Number,
      default: 0
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

taskSchema.virtual('id').get(function id() {
  return this._id.toHexString();
});

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
  }
});

export const Task = mongoose.model('Task', taskSchema);
