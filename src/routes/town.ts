import { Router } from 'express';

import { townController } from '../controllers';

const router = Router();

router.get('', townController.index);

export default router;
