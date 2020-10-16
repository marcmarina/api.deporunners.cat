import { validationResult } from 'express-validator';

const checkForErrors = req => {
  const errors = validationResult(req);
  if (errors.array().length > 0) throw { status: 400, ...errors };
};

export default checkForErrors;
