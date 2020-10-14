import dayjs from 'dayjs';

import { check } from 'express-validator';
import { existingMemberEmail, validTown } from './DatabaseValidators';

export const fullMember = [
  check('firstName')
    .isLength({ min: 2 })
    .withMessage('The firstName has to be at least 2 characters long')
    .trim(),
  check('lastName')
    .isLength({ min: 2 })
    .withMessage('The lastName has to be at least 2 characters long')
    .trim(),
  check('email').trim().isEmail(),
  existingMemberEmail('email'),
  check('dni').isString(),
  check('address').notEmpty(),
  check('address.streetAddress').isString(),
  check('address.postCode').isString(),
  check('address.town').notEmpty(),
  validTown('address.town'),
];

export const memberLogin = [
  check('username').isString().trim(),
  check('password').isString().trim(),
];

export const fullEvent = [
  check('name')
    .isLength({ min: 4 })
    .withMessage('The name has to be at least 4 characters long')
    .trim(),
  check('dateTime').custom(value => {
    if (dayjs(value).isValid()) return true;
    return false;
  }),
  check('coordinates').isString().isLatLong(),
];
