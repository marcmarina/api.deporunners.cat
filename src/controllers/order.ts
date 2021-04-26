import * as OrderService from '../services/order';
import checkForErrors from '../utils/ErrorThrowing';

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);

    return res.status(201).json(await OrderService.createOrder(req.body));
  } catch (ex) {
    next(ex);
  }
};

export const find = async (req, res, next) => {
  try {
    const order = await OrderService.findById(req.params.id);

    return res.status(200).json(order);
  } catch (ex) {
    next(ex);
  }
};
