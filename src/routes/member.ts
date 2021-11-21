import { Router } from 'express';

import * as MemberController from '../controllers/member';
import auth from '../middleware/auth';
import {
  createMember,
  memberLogin,
  updateMember,
} from '../validators/endpoint-validators';
import { MemberService } from '../services/member-service';

const service = new MemberService();

const router = Router();

router.post('/signup/pay', MemberController.signupPayment);
router.post('/login', memberLogin, MemberController.login);
router.post('', createMember, MemberController.create);
router.post('/expoPushToken', auth, MemberController.expoToken);

router.get('/excel', async (req, res, next) => {
  try {
    const buffer = await service.generateExcel();
    res.attachment('Socis.xlsx');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});
router.get('/signup/secret', MemberController.signupSecret);
router.get('/self', auth, MemberController.self);
router.get('', MemberController.index);
router.get('/:id', MemberController.find);

router.delete('/signup/failure/:id', MemberController.signupFailure);
router.delete('/:id', auth, MemberController.destroy);

router.patch('/changepassword', auth, MemberController.changePassword);

router.put('', auth, updateMember, MemberController.put);

export default router;
