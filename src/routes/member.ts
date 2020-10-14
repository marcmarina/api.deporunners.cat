import { Router } from 'express';

import * as MemberController from '../controllers/member';
import auth from '../middleware/auth';
import { fullMember, memberLogin } from '../validators/EndpointValidators';

const router = Router();

router.post('/login', memberLogin, MemberController.login);

router.get('/signup/secret', MemberController.signupSecret);

router.post('/signup/:id/email', MemberController.signupEmail);

router.post('', fullMember, MemberController.create);

router.get('', MemberController.index);

router.get('/:id', MemberController.find);

router.delete('/:id', auth, MemberController.destroy);

router.patch('/changePassword/:id', auth, MemberController.changePassword);

router.put('', auth, fullMember, MemberController.put);

export default router;
