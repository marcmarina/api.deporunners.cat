import { check } from 'express-validator';
import { validTown, validTShirtSize } from './DatabaseValidators';

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
  check('dni').isString(),
  check('tshirtSize').notEmpty().withMessage('Required'),
  validTShirtSize('tshirtSize'),
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
