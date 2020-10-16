import { EventEmitter } from 'events';
import { Router } from 'express';

import * as EventController from '../controllers/event';
import eventEmitter from '../events/EventEmitter';
import auth from '../middleware/auth';
import { fullEvent } from '../validators/EndpointValidators';

const router = Router();

router.get('', EventController.index);

router.get('/:id', EventController.show);

router.post('', auth, fullEvent, EventController.create);

router.put('', auth, fullEvent, EventController.update);

router.patch('/:id/attend', auth, EventController.attend);

export default router;
