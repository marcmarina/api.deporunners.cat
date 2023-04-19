import { Document, model, Schema } from 'mongoose';

export interface ITown extends Document {
  name: string;
}

const townSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Town = model<ITown>('Town', townSchema);
