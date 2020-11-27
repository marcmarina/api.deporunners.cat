import { Schema, model, Document } from 'mongoose';

import TShirtSize from './TShirtSize';

export interface IClothing extends Document {
  ref: string;
  name: string;
  sizes: Schema.Types.ObjectId[];
  image?: string;
  price: number;
}

const clothingSchema = new Schema({
  ref: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sizes: [
    {
      type: Schema.Types.ObjectId,
      ref: TShirtSize,
      required: true,
    },
  ],
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default model<IClothing>('Clothing', clothingSchema, 'clothes');
