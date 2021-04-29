import { Types } from 'mongoose';
import Clothing, { IClothing } from '../models/Clothing';
import * as TShirtSizeService from './tshirtSize';

export class ClothingService {
  async getAllClothing() {
    return Clothing.find().populate('sizes');
  }

  async findById(id: Types.ObjectId) {
    const clothing = await Clothing.findById(id).populate('sizes');

    if (!clothing)
      throw {
        status: 404,
        msg: 'Clothing not found',
      };

    return clothing;
  }

  async createClothing(clothing: IClothing) {
    const newClothing = await Clothing.create(clothing);

    if (newClothing.sizes.length === 0) {
      throw {
        status: 400,
        errors: [
          {
            msg: 'No sizes provided',
            param: 'sizes',
          },
        ],
      };
    }

    const validatedSizes = await TShirtSizeService.findByIds(
      newClothing.sizes.map(id => `${id}`)
    );

    if (validatedSizes.length === 0)
      throw {
        status: 400,
        errors: [
          {
            msg: 'The provides sizes are not valid',
            param: 'sizes',
          },
        ],
      };

    return newClothing.save();
  }

  async changeImage(imagePath: string, id: Types.ObjectId) {
    const clothing = await Clothing.findById(id);

    if (!clothing)
      throw {
        status: 404,
        msg: 'Clothing not found',
      };

    clothing.image = imagePath;
    return clothing.save();
  }

  async updateClothing(clothing: IClothing) {
    if (clothing.sizes.length === 0) {
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

    const validatedSizes = await TShirtSizeService.findByIds(
      clothing.sizes.map(id => `${id}`)
    );

    if (validatedSizes.length === 0)
      throw {
        status: 400,
        errors: [
          {
            msg: 'The provides sizes are not valid',
            param: 'sizes',
          },
        ],
      };

    return Clothing.updateOne({ _id: clothing._id }, clothing);
  }

  async deleteClothing(id: Types.ObjectId) {
    return Clothing.findByIdAndDelete(id);
  }
}
