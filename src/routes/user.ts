import { Router } from 'express';
import { check } from 'express-validator';

import { userController } from '../controllers';
import { auth } from '../middleware';
import { createUser } from '../validators/endpoint-validators';

const router = Router();

router.get('/self', auth, userController.self);
router.get('', userController.index);

router.post(
  '/login',
  [
    check('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('password').trim().notEmpty().withMessage('The password is required'),
  ],
  userController.login,
);

router.patch('/changePassword/:id', userController.changePassword);

router.post('', auth, createUser, userController.create);

export default router;
