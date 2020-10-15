import e, { Router } from 'express';

import * as EventController from '../controllers/event';
import Event from '../models/Event';
import auth from '../middleware/auth';
import { sendNotification } from '../services/event';
import { fullEvent } from '../validators/EndpointValidators';

const router = Router();

router.get('', EventController.index);
router.get('/:id', EventController.show);

router.post('', auth, fullEvent, EventController.create);

router.put('', auth, fullEvent, EventController.update);

router.patch('/:id/attend', auth, EventController.attend);

export default router;
