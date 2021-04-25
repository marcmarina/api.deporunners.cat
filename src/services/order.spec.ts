import Order from '../models/Order';
import Context from '../utils/Context';

import * as OrderService from './order';

jest.mock('../models/Order');

const mockedOrderModel = Order as jest.Mocked<typeof Order>;

mockedOrderModel.findById.mockResolvedValue({
  _id: 'asdasdasd',
  member: '123123123',
  price: 1499,
  items: [
    {
      size: 'asdasdasd',
      clothing: 'asdasdasd',
      amount: 1,
    },
  ],
  completed: false,
});

const sampleData = {
  userId: '123123123',
};

jest.mock('../utils/Context');

const mockedContext = Context as jest.Mocked<typeof Context>;
mockedContext.getUserId.mockReturnValue(sampleData.userId);

it('should return one order for a specific id', async () => {
  const result = await OrderService.findById('123123123');

  expect(result).toMatchObject({
    _id: 'asdasdasd',
    member: sampleData.userId,
    price: 1499,
    items: [
      {
        size: 'asdasdasd',
        clothing: 'asdasdasd',
        amount: 1,
      },
    ],
    completed: false,
  });
});

it('should throw if the current user id does not own the order', async () => {
  mockedContext.getUserId.mockReturnValueOnce('asdasdasd');

  await expect(OrderService.findById('123123123')).rejects.toBeDefined();
});
