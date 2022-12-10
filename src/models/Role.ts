import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
}

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Role = model<IRole>('Role', roleSchema);
