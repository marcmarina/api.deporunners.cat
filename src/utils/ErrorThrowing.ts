import { validationResult } from 'express-validator';
import { InputError } from '../errors';

const checkForErrors = (req) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) throw new InputError(errors);
};

export default checkForErrors;
