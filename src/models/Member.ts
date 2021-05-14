import { Schema, model } from 'mongoose';
import Town from './Town';

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

export default model('Member', memberSchema);
