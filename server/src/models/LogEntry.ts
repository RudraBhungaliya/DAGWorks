import mongoose, { Document, Schema } from 'mongoose';

export interface ILogEntry extends Document {
  workflowId: mongoose.Types.ObjectId | string;
  node: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  payload?: any;
}

const logEntrySchema = new Schema<ILogEntry>({
  workflowId: { type: Schema.Types.Mixed, required: true }, // Mixed because it could be mock ID or ObjectId
  node: { type: String, required: true },
  level: { type: String, enum: ['info', 'warn', 'error', 'debug'], default: 'info' },
  message: { type: String, required: true },
  payload: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const LogEntry = mongoose.model<ILogEntry>('LogEntry', logEntrySchema);
