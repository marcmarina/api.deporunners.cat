import Order from '../models/Order';
import Context from '../utils/Context';
import testing from '../utils/testing';

import * as OrderService from './order';

const sampleUserId = testing.mongodbId();

const sampleData = {
  singleOrder: {
    _id: testing.mongodbId(),
    member: sampleUserId,
    price: 1499,
    items: [
      {
        size: testing.mongodbId(),
        clothing: testing.mongodbId(),
        amount: 1,
      },
    ],
    completed: false,
  },
};

const saveModel = jest.fn();

jest.mock('../models/Order');

const mockedOrder = Order as jest.Mocked<typeof Order>;

mockedOrder.findById.mockResolvedValue(sampleData.singleOrder);

mockedOrder.create.mockImplementation(order => ({
  ...order,
  save: saveModel.mockReturnValue(order),
}));

jest.mock('../utils/Context');

const mockedContext = Context as jest.Mocked<typeof Context>;
mockedContext.getUserId.mockReturnValue(`${sampleUserId}`);

describe('findById', () => {
  it('should return one order for a specific id', async () => {
    const result = await OrderService.findById('123123123');

    expect(result).toMatchObject(sampleData.singleOrder);
  });

  it('should throw if the current user id does not own the order', async () => {
    mockedContext.getUserId.mockReturnValueOnce('asdasdasd');

    await expect(OrderService.findById('123123123')).rejects.toBeDefined();
  });
});

describe('createOrder', () => {
  it('should return a newly created order', async () => {
    const result = await OrderService.createOrder(
      await Order.create(sampleData.singleOrder)
    );

    expect(saveModel).toHaveBeenCalled();
    expect(result).toMatchObject(sampleData.singleOrder);
  });
});
