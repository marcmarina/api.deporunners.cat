import { Router } from 'express';

import * as MemberController from '../controllers/member';
import auth from '../middleware/auth';
import {
  createMember,
  memberLogin,
  updateMember,
} from '../validators/EndpointValidators';

const router = Router();

router.post('/login', memberLogin, MemberController.login);
router.post('', createMember, MemberController.create);
router.post('/expoPushToken', auth, MemberController.expoToken);

router.get('/signup/secret', MemberController.signupSecret);
router.get('/self', auth, MemberController.self);
router.get('', MemberController.index);
router.get('/:id', MemberController.find);

router.delete('/:id', auth, MemberController.destroy);

router.patch('/changepassword', auth, MemberController.changePassword);

router.put('', auth, updateMember, MemberController.put);

export default router;
