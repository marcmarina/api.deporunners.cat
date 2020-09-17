import { Router } from 'express';

import * as MemberController from '../controllers/member';
import { memberCreate, memberLogin } from '../validators/EndpointValidators';

const router = Router();

router.post('/login', memberLogin, MemberController.login);

router.post('', memberCreate, MemberController.create);

router.get('', MemberController.index);

router.get('/:id', MemberController.find);

router.delete('/:id', MemberController.destroy);

router.patch('/changePassword/:id', MemberController.changePassword);

router.put('', MemberController.put);

export default router;
