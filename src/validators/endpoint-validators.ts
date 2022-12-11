import dayjs from 'dayjs';
import { check } from 'express-validator';

import { Town, Role } from '../models';

import { existingMemberEmail, validateModelId } from './database-validators';

export const createMember = [
  check('member.firstName')
    .isLength({ min: 2 })
    .withMessage('The firstName has to be at least 2 characters long')
    .trim(),
  check('member.lastName')
    .isLength({ min: 2 })
    .withMessage('The lastName has to be at least 2 characters long')
    .trim(),
  check('member.email').trim().isEmail(),
  existingMemberEmail('member.email'),
  check('member.dni').isString(),
  check('member.address').notEmpty(),
  check('member.address.streetAddress').isString(),
  check('member.address.postCode').isString(),
  check('member.address.town').notEmpty(),
  validateModelId(Town, 'member.address.town'),
];

export const updateMember = [
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
  check('address').notEmpty(),
  check('address.streetAddress').isString(),
  check('address.postCode').isString(),
  check('address.town').notEmpty(),
  validateModelId(Town, 'address.town'),
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
  check('dateTime').custom((value) => {
    if (dayjs(value).isValid()) return true;
    return false;
  }),
  check('coordinates').isString().isLatLong(),
];

export const createUser = [
  check('email').trim().isEmail().withMessage('Please provide a valid email.'),
  check('password').trim().notEmpty().withMessage('The password is required'),
  validateModelId(Role, 'role'),
];
