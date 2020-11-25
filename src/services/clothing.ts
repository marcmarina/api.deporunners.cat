import Clothing, { IClothing } from '../models/Clothing';

export const getAllClothing = async () => {
  return Clothing.find().populate('sizes');
};

export const createClothing = async (clothing: IClothing) => {
  const newClothing = new Clothing(clothing);
  newClothing.image = `images/${newClothing.image}`;
  return newClothing.save();
};
