import Clothing from '../models/Clothing';
import { ClothingService } from './ClothingService';
import * as TShirtService from './tshirtSize';
import testing from '../utils/testing';

jest.mock('../models/Clothing');

const mockedClothing = Clothing as jest.Mocked<typeof Clothing>;

const singleClothing = {
  _id: '6085b02b6b4b295ab8ee93f0',
  sizes: [
    '6085b02b6b4b295ab8ee93e9',
    '6085b02b6b4b295ab8ee93ea',
    '6085b02b6b4b295ab8ee93eb',
    '6085b02b6b4b295ab8ee93ec',
    '6085b02b6b4b295ab8ee93ed',
    '6085b02b6b4b295ab8ee93ee',
  ],
  name: 'Test',
  ref: '123ABC',
  price: 15,
  image: 'test',
};

const clothesArray = [singleClothing, singleClothing, singleClothing];

const saveModel = jest.fn();

mockedClothing.find.mockReturnValue(clothesArray);
mockedClothing.create.mockImplementation(singleClothing => ({
  ...singleClothing,
  save: saveModel.mockReturnValue(singleClothing),
}));

jest.mock('../services/tshirtSize');

const mockedTShirt = TShirtService as jest.Mocked<typeof TShirtService>;

mockedTShirt.findByIds.mockResolvedValue(singleClothing.sizes);

const service = new ClothingService();
describe('getAllClothing', () => {
  it('returns a correct array of clothing', async () => {
    mockedClothing.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(clothesArray),
    });

    const result = await service.getAllClothing();

    expect(result).toMatchObject(clothesArray);
  });
});

describe('findClothingById', () => {
  it('returns a single clothing item for a specific id', async () => {
    mockedClothing.findById.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(singleClothing),
    });

    const result = await service.findById(testing.mongodbId());

    expect(result).toMatchObject(singleClothing);
  });

  it("throws an error if it can't find the item", async () => {
    mockedClothing.findById.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(undefined),
    });

    await expect(service.findById(testing.mongodbId())).rejects.toMatchObject({
      status: 404,
      msg: 'Clothing not found',
    });
  });
});

describe('createClothing', () => {
  it('returns a new item of clothing', async () => {
    const result = await service.createClothing(
      await Clothing.create(singleClothing)
    );

    expect(saveModel).toHaveBeenCalled();
    expect(result).toMatchObject(singleClothing);
  });

  it('throws if no sizes are provided', async () => {
    await expect(
      service.createClothing(
        await Clothing.create({
          ...singleClothing,
          sizes: [],
        })
      )
    ).rejects.toMatchObject({
      status: 400,
      errors: [
        {
          msg: 'No sizes provided',
          param: 'sizes',
        },
      ],
    });
  });

  it('throws if the sizes are not valid', async () => {
    mockedTShirt.findByIds.mockResolvedValueOnce([]);

    await expect(
      service.createClothing(
        await Clothing.create({
          ...singleClothing,
        })
      )
    ).rejects.toMatchObject({
      status: 400,
      errors: [
        {
          msg: 'The provides sizes are not valid',
          param: 'sizes',
        },
      ],
    });
  });
});
