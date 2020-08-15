import { Document, model, Schema } from 'mongoose';

export interface ITShirtSize extends Document {
  name: string;
  orderNum: number;
}

const tshirtSizeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orderNum: {
    type: Number,
    required: true,
  },
});

export default model<ITShirtSize>('TShirtSize', tshirtSizeSchema);
