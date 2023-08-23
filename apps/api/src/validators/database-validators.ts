import { check } from 'express-validator';
import { Model } from 'mongoose';

import { BaseError } from '@deporunners/errors';
import { Member } from '@deporunners/models';

export async function isModelIdValid(model: Model<any>, id: string) {
  const result = await model.findOne({ _id: id });
  if (!result) throw new BaseError(`The ${model.modelName} id is not valid`);
  return true;
}

export const validateModelId = (model: Model<any>, path: string) =>
  check(path).custom(async (value) => {
    return await isModelIdValid(model, value._id || value);
  });

export const existingMemberEmail = (path: string) =>
  check(path).custom(async (value) => {
    const existingEmail = await Member.findOne({
      email: value,
    });
    if (existingEmail)
      throw new BaseError('A member with that email address already exists');
    return true;
  });
