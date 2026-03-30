import mongoose, { Document, Schema } from 'mongoose';

export interface IIntegration extends Document {
  name: string;
  description: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: Date;
  userId?: mongoose.Types.ObjectId;
}

const integrationSchema = new Schema<IIntegration>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, required: true },
  status: { type: String, enum: ['connected', 'disconnected', 'error'], default: 'disconnected' },
  lastSynced: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Integration = mongoose.model<IIntegration>('Integration', integrationSchema);
