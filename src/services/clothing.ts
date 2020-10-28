import Clothing from '../models/Clothing';

export const getAllClothing = async () => {
  return Clothing.find().populate('sizes');
};
