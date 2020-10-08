import { Schema, Document, model } from 'mongoose';
import { IMember } from './Member';

export interface IEvent extends Document {
  name: string;
  description: string;
  dateTime: Date;
  coordinates: string;
  members: Schema.Types.ObjectId[];
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
        type: Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IEvent>('Event', eventSchema);
