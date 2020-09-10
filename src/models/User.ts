import { Schema, Document, model } from 'mongoose';

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
    ref: 'Role',
  },
  refreshToken: String,
  passwordResetToken: String,
});

const populateRole = function (this: IUser, next: any) {
  this.populate('role');
  next();
};

userSchema.pre('find', populateRole).pre('findOne', populateRole);

export default model<IUser>('User', userSchema);
