import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkflow extends Document {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  nodes: any[];
  edges: any[];
  userId?: mongoose.Types.ObjectId;
  lastRun?: Date;
}

const workflowSchema = new Schema<IWorkflow>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
  nodes: { type: Schema.Types.Mixed, default: [] },
  edges: { type: Schema.Types.Mixed, default: [] },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  lastRun: { type: Date }
}, { timestamps: true });

export const Workflow = mongoose.model<IWorkflow>('Workflow', workflowSchema);
