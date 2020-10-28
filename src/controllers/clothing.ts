import { getAllClothing } from '../services/clothing';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllClothing());
  } catch (ex) {
    next(ex);
  }
};
