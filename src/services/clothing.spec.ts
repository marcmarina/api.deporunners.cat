import Clothing from '../models/Clothing';
import * as ClothingService from '../services/clothing';

jest.mock('../models/Clothing');

const mockedClothing = Clothing as jest.Mocked<typeof Clothing>;

const clothesArray = [
  {
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
  },
  {
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
  },
  {
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
  },
];

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

mockedClothing.find.mockReturnValue(clothesArray);

describe('getAllClothing', () => {
  it('returns a correct array of clothing', async () => {
    mockedClothing.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(clothesArray),
    });

    const result = await ClothingService.getAllClothing();

    expect(result).toMatchObject(clothesArray);
  });
});

describe('findClothingById', () => {
  it('returns a single clothing item for a specific id', async () => {
    mockedClothing.findById.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(singleClothing),
    });

    const result = await ClothingService.findClothingById('123123123');

    expect(result).toMatchObject(singleClothing);
  });

  it("throws an error if it can't find the item", async () => {
    mockedClothing.findById.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue(undefined),
    });

    await expect(
      ClothingService.findClothingById('123123123')
    ).rejects.toBeDefined();
  });
});

// it('updates the clothing record', async () => {
//   const clothing = await Clothing.findOne();
//   clothing.name = 'Test';
//   clothing.price = 15;

//   const res = await updateClothing(clothing);
//   expect(res.ok).toBe(1);
// });

// it('throws error on non valid data', async () => {
//   const clothing = await Clothing.findOne();
//   clothing.sizes = [];

//   await expect(updateClothing(clothing)).rejects.toBeDefined();
// });
