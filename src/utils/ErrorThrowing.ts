import { validationResult } from 'express-validator';

const checkForErrors = req => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    const error = { status: 400, errors: errors };
    throw error;
  }
};

export default checkForErrors;
