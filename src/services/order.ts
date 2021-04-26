import Order, { IOrder } from '../models/Order';

export const findById = async (id: string) => await Order.findById(id);

export const createOrder = async (order: IOrder) => {
  const newOrder = await Order.create(order);

  return await newOrder.save();
};
