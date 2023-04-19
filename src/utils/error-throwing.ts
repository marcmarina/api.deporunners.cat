import { InputError } from '@deporunners/errors';
import { validationResult } from 'express-validator';

export const checkForErrors = (req) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) throw new InputError(errors);
};
