import { Schema, model, Document } from 'mongoose';

export interface ITown extends Document {
  name: string;
}

const townSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default model<ITown>('Town', townSchema);
