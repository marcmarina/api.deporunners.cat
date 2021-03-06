import { Router } from 'express';

import * as EventController from '../controllers/event';
import auth from '../middleware/auth';
import { fullEvent } from '../validators/endpoint-validators';

const router = Router();

router.get('', auth, EventController.index);

router.get('/:id', EventController.show);

router.post('', auth, fullEvent, EventController.create);

router.put('', auth, fullEvent, EventController.update);

router.patch('/:id/attend', auth, EventController.attend);

router.delete('/:id', auth, EventController.destroy);

export default router;
