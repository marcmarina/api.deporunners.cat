import { Router } from 'express';

import * as TownController from '../controllers/town';

const router = Router();

router.get('', TownController.index);

export default router;
