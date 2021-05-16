import { TShirtSize } from '../graphql/codegen-types';
import TShirtSizeModel from '../models/TShirtSize';

export const getAllTShirtSizes = async () => {
  return await TShirtSizeModel.find();
};

export const findByIds = async (ids: string[]) => {
  return await TShirtSizeModel.find().where('id').in([ids]);
};

export const findById = async (id: string): Promise<TShirtSize> => {
  return await TShirtSizeModel.findById(id);
};
