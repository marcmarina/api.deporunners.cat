import { Schema, Document, model } from 'mongoose';

export interface IMember extends Document {
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
      ref: 'Town',
    },
  },
  refreshToken: String,
  passwordResetToken: String,
  expoPushToken: String,
});

const populateData = function (this: IMember, next: any) {
  this.populate('address.town');
  next();
};

memberSchema.pre('find', populateData).pre('findOne', populateData);

export default model<IMember>('Member', memberSchema);
