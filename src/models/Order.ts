import { Schema, Document, model } from 'mongoose';

export interface IOrder extends Document {
  member: Schema.Types.ObjectId;
  items: IOrderItem[];
  price: number;
  completed: boolean;
}

export interface IOrderItem {
  clothing: Schema.Types.ObjectId;
  amount: number;
  size: Schema.Types.ObjectId;
}

const clothingSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    items: [
      {
        size: {
          type: Schema.Types.ObjectId,
          ref: 'TShirtSize',
          required: true,
        },
        clothing: {
          type: Schema.Types.ObjectId,
          ref: 'Clothing',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    completed: Boolean,
  },
  {
    timestamps: true,
  }
);

export default model<IOrder>('Clothing', clothingSchema);
