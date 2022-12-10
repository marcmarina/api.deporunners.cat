import { Schema, Document, model } from 'mongoose';
import { Town } from './Town';
import { ITShirtSize } from './TShirtSize';

export interface IMember extends Document {
  stripeId?: string;
  numMember: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dni: string;
  iban?: string;
  telephone: string;
  address: IAddress;
  refreshToken?: string;
  passwordResetToken?: string;
  expoPushToken?: string;
  tshirtSize: ITShirtSize | string;
}

export interface IAddress {
  streetAddress: string;
  postCode: string;
  town: Schema.Types.ObjectId;
}

const memberSchema = new Schema({
  stripeId: {
    type: String,
  },
  numMember: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
  },
  iban: String,
  telephone: {
    type: String,
    required: true,
  },
  address: {
    streetAddress: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    town: {
      type: Schema.Types.ObjectId,
      ref: Town,
    },
  },
  tshirtSize: {
    type: Schema.Types.ObjectId,
    ref: 'TShirtSize',
  },
  refreshToken: String,
  passwordResetToken: String,
  expoPushToken: String,
});

memberSchema.pre(/^find/, function (next: any) {
  this.populate('address.town');
  this.populate('tshirtSize');
  next();
});

export const Member = model<IMember>('Member', memberSchema);
