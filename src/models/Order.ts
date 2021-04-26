import { Schema, Types, Document, model } from 'mongoose';

export interface IOrder {
  member: Types.ObjectId;
  items: IOrderItem[];
  price: number;
  completed: boolean;
}
export interface IOrderItem {
  clothing: Types.ObjectId;
  amount: number;
  size: Types.ObjectId;
}

const clothingSchema = new Schema(
  {
    member: {
      type: Types.ObjectId,
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
          type: Types.ObjectId,
          ref: 'TShirtSize',
          required: true,
        },
        clothing: {
          type: Types.ObjectId,
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

export default model<Document<IOrder>>('Clothing', clothingSchema);
