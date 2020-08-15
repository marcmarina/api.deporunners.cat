import { Schema, Document, model } from 'mongoose';

export interface IMember extends Document {
  numMember: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dni: string;
  iban?: string;
  telephone?: string;
  tshirtSize: Schema.Types.ObjectId;
  address: IAddress;
  refreshToken?: string;
  passwordResetToken?: string;
}

export interface IAddress {
  streetAddress: string;
  postCode: string;
  town: Schema.Types.ObjectId;
}

const memberSchema = new Schema({
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
  telephone: String,
  tshirtSize: {
    type: Schema.Types.ObjectId,
    ref: 'TShirtSize',
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
      ref: 'Town',
    },
  },
  refreshToken: String,
  passwordResetToken: String,
});

export default model<IMember>('Member', memberSchema);
