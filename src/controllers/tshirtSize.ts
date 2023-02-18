import { TShirtSizeService } from '../services';

const tshirtSizeService = new TShirtSizeService();

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await tshirtSizeService.getAll());
  } catch (ex) {
    next(ex);
  }
};
