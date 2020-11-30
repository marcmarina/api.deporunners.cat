import { Schema } from 'mongoose';
import Clothing, { IClothing } from '../models/Clothing';
import TShirtSize from '../models/TShirtSize';

export const getAllClothing = async () => {
  return Clothing.find().populate('sizes');
};

export const createClothing = async (clothing: IClothing) => {
  const newClothing = new Clothing(clothing);

  if (newClothing.sizes.length === 0) {
    throw {
      status: 400,
      errors: [
        {
          msg: 'The provides sizes are not valid',
          param: 'sizes',
        },
      ],
    };
  }

  for (const size of newClothing.sizes) {
    if (!(await TShirtSize.findById(size))) {
      throw {
        status: 400,
        errors: [
          {
            msg: 'The provides sizes are not valid',
            param: 'sizes',
          },
        ],
      };
    }
  }

  return newClothing.save();
};

export const changeImage = async (
  imagePath: string,
  id: Schema.Types.ObjectId
) => {
  const clothing = await Clothing.findById(id);

  if (!clothing)
    throw {
      status: 404,
      msg: 'Clothing not found',
    };

  clothing.image = imagePath;
  return clothing.save();
};
