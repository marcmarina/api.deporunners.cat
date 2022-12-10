import { Router } from 'express';

import { eventController } from '../controllers';
import auth from '../middleware/auth';
import { fullEvent } from '../validators/endpoint-validators';

const router = Router();

router.get('', auth, eventController.index);

router.get('/:id', eventController.show);

router.post('', auth, fullEvent, eventController.create);

router.put('', auth, fullEvent, eventController.update);

router.patch('/:id/attend', auth, eventController.attend);

router.delete('/:id', auth, eventController.destroy);

export default router;
