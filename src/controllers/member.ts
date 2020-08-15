import { validationResult } from 'express-validator';
import Member from '../models/Member';

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      const error = { status: 400, errors: errors };
      throw error;
    }
  } catch (ex) {
    next(ex);
  }
};
