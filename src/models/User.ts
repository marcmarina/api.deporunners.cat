import { Schema, Document, model } from 'mongoose';

import { Role } from './Role';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Schema.Types.ObjectId;
  refreshToken?: string;
  passwordResetToken?: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: Role,
  },
  refreshToken: String,
  passwordResetToken: String,
});

userSchema.pre(/^find/, function (next: any) {
  this.populate('role');
  next();
});

export const User = model<IUser>('User', userSchema);
