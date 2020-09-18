import { Router } from 'express';

import * as TShirtSizeController from '../controllers/tshirtSize';

const router = Router();

router.get('', TShirtSizeController.index);

export default router;
