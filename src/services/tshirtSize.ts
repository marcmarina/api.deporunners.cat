import TShirtSize from '../models/TShirtSize';

export const getAllTShirtSizes = async () => {
  return TShirtSize.find();
};
