import { Router } from 'express';
import { check } from 'express-validator';

import * as MemberController from '../controllers/member';

const router = Router();

router.post(
  '',
  [
    check('firstName').isString().isLength({ min: 2 }),
    check('lastName').isString().isLength({ min: 2 }),
    check('email').trim().isEmail(),
    check('dni').isString(),
    check('address.streetAddress').isString(),
    check('address.postCode'),
    check('address.town').isString(),
  ],
  MemberController.create
);

export default router;
