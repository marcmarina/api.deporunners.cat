import Order, { IOrder } from '../models/Order';
import Context from '../utils/Context';

export const findById = async (id: string) => {
  const order = await Order.findById(id);

  if (`${order.member}` !== Context.getUserId())
    throw {
      status: 403,
      msg: 'Not Authorized',
    };

  return order;
};

export const createOrder = async (order: IOrder) => {
  const newOrder = await Order.create(order);

  return await newOrder.save();
};
