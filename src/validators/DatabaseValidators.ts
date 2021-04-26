import { check } from 'express-validator';
import { Model } from 'mongoose';
import Member from '../models/Member';

export const validateModelId = (model: Model<any>, path: string) =>
  check(path).custom(async value => {
    const result = await model.findOne({ _id: value._id || value });
    if (!result) throw new Error(`The ${model.modelName} id is not valid`);
    return true;
  });

export const existingMemberEmail = (path: string) =>
  check(path).custom(async value => {
    const existingEmail = await Member.findOne({
      email: value,
    });
    if (existingEmail)
      throw new Error('A member with that email address already exists');
    return true;
  });
