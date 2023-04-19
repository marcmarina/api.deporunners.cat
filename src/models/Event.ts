import { Document, model, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  dateTime: Date;
  coordinates: string;
  members: Types.ObjectId[];
}

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    coordinates: {
      type: String,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: 'Member',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Event = model<IEvent>('Event', eventSchema);
