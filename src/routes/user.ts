import { Router } from 'express';
import { check } from 'express-validator';

import * as UserController from '../controllers/user';

const router = Router();

router.post(
  '/login',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('password').trim().notEmpty().withMessage('The password is required'),
  ],
  UserController.login
);

router.post('', UserController.create);

export default router;
