import { Request } from 'express';
import { validationResult } from 'express-validator';

import { InputError } from './errors';

/**
 * Checks for express-validator errors and throws an InputError if any are found.
 * @param req Request object
 */
export function checkForErrors(req: Request) {
  const errors = validationResult(req);
  if (errors.array().length > 0) throw new InputError(errors);
}
