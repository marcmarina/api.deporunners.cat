import { check } from 'express-validator';

import Town from '../models/Town';
import TShirtSize from '../models/TShirtSize';

export const validTown = (path: string) =>
  check(path).custom(async value => {
    const town = await Town.findOne({ _id: value._id || value });
    if (!town) throw new Error('The town id is not valid');
    return true;
  });

export const validTShirtSize = (path: string) =>
  check(path).custom(async value => {
    const tShirtSize = await TShirtSize.findOne({ _id: value._id || value });
    if (!tShirtSize) throw new Error('The TShirt Size id is not valid');
    return true;
  });
