import { Schema, model } from 'mongoose';

import TShirtSize from './TShirtSize';

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

export default model('Clothing', clothingSchema, 'clothes');
