import { Schema, model, Document } from 'mongoose';

import TShirtSize from './TShirtSize';

export interface IClothing extends Document {
  name: string;
  sizes: Schema.Types.ObjectId[];
  image: string;
  price: number;
}

const clothingSchema = new Schema({
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
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default model<IClothing>('Clothing', clothingSchema, 'clothes');
