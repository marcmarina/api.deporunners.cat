import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {}

const userSchema = new Schema({});

export default model<IUser>('User', userSchema);
