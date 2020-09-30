import { Router } from 'express';

import * as EventController from '../controllers/event';
import { fullEvent } from '../validators/EndpointValidators';

const router = Router();

router.get('', EventController.index);

router.post('', fullEvent, EventController.create);

export default router;
