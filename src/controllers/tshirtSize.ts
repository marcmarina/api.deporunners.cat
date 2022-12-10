import { tshirtSizeService } from '../services';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await tshirtSizeService.getAllTShirtSizes());
  } catch (ex) {
    next(ex);
  }
};
