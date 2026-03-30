import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String }, // Optional for dummy/guest flows
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
