import { Router } from 'express';

import * as EventController from '../controllers/event';
import auth from '../middleware/auth';
import { fullEvent } from '../validators/EndpointValidators';

const router = Router();

router.get('', EventController.index);

router.post('', auth, fullEvent, EventController.create);

router.put('', auth, fullEvent, EventController.update);

export default router;
