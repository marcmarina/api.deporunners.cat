import { TShirtSize } from '../models';

export const getAllTShirtSizes = async () => {
  return await TShirtSize.find();
};

export const findByIds = async (ids: string[]) => {
  return await TShirtSize.find().where('id').in([ids]);
};
