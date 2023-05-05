import { Router } from 'express';

import { memberController } from '../controllers';
import { auth } from '../middleware';
import { MemberService } from '../services';
import { createMember, memberLogin, updateMember } from '../validators';

const service = new MemberService();

const router = Router();

router.post('/signup/pay', memberController.signupPayment);
router.post('/login', memberController.login);
router.post('/login/v2', memberLogin, memberController.loginV2);
router.post('', createMember, memberController.create);
router.post('/expoPushToken', auth, memberController.expoToken);

router.get('/excel', async (req, res, next) => {
  try {
    const buffer = await service.generateExcel();
    res.attachment('Socis.xlsx');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});
router.get('/signup/secret', memberController.signupSecret);
router.get('/self', auth, memberController.self);
router.get('', memberController.index);
router.get('/:id', memberController.find);

router.delete('/signup/failure/:id', memberController.signupFailure);
router.delete('/:id', auth, memberController.destroy);

router.patch('/changepassword', auth, memberController.changePassword);

router.put('', auth, updateMember, memberController.put);

export default router;
