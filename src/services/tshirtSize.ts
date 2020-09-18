import TShirtSize from '../models/TShirtSize';

export const getAllTShirtSizes = async () => {
  try {
    return await TShirtSize.find();
  } catch (ex) {
    throw ex;
  }
};
