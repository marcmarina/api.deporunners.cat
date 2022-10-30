import { Router } from 'express';
import { check } from 'express-validator';

import * as UserController from '../controllers/user';
import auth from '../middleware/auth';
import { createUser } from '../validators/endpoint-validators';

const router = Router();

router.get('/self', auth, UserController.self);
router.get('', UserController.index);

router.post(
  '/login',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('password').trim().notEmpty().withMessage('The password is required'),
  ],
  UserController.login,
);

router.patch('/changePassword/:id', UserController.changePassword);

router.post('', auth, createUser, UserController.create);

export default router;
