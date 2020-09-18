import { getAllTShirtSizes } from '../services/tshirtSize';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllTShirtSizes());
  } catch (ex) {
    next(ex);
  }
};
