import * as OrderService from '../services/order';
import checkForErrors from '../utils/ErrorThrowing';

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);

    return res.status(200).json(await OrderService.createOrder(req.body));
  } catch (ex) {
    next(ex);
  }
};
