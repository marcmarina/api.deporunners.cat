import { Router } from 'express';
import { check } from 'express-validator';

import * as AuthController from '../controllers/auth';

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
  AuthController.login
);

export default router;
