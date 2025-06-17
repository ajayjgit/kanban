import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: Date;
  status?: 'To Do' | 'In Progress' | 'Done';
  assignedTo: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  history: { status: string; changedAt: Date }[]; // ✅ Not optional
  comments: { user: Types.ObjectId; text: string; createdAt: Date }[]; // ✅ Not optional
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // ✅ allow null for unassigned
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    history: {
      type: [
        {
          status: { type: String, required: true },
          changedAt: { type: Date, required: true },
        },
      ],
      default: [], // ✅ ensures history is never undefined
    },
    comments: {
      type: [
        {
          user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [], // ✅ ensures comments is never undefined
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>('Task', taskSchema);
