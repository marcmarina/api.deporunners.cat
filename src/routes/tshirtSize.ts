import { Router } from 'express';

import { tShirtSizeController } from '../controllers';

const router = Router();

router.get('', tShirtSizeController.index);

export default router;
