import { validationResult } from 'express-validator';
import Member from '../models/Member';
import Town from '../models/Town';
import TShirtSize from '../models/TShirtSize';

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      const error = { status: 400, errors: errors };
      throw error;
    }
    const { firstName, lastName, email, dni, address, tshirtSize } = req.body;
    const matchingT = await TShirtSize.findById(tshirtSize);
    if (!matchingT)
      throw {
        status: 400,
        msg: 'TShirt Size Invalid',
      };

    const matchingTown = await Town.findById(address.town);
    if (!matchingTown)
      throw {
        status: 400,
        msg: 'Town Invalid',
      };
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};
