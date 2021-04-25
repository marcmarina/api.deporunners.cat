import Order from '../models/Order';
import Context from '../utils/Context';

export const findById = async (id: string) => {
  const order = await Order.findById(id);

  if (order.member !== Context.getUserId())
    throw {
      status: 403,
      msg: 'Not Authorized',
    };

  return order;
};
