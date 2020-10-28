import { Router } from 'express';

import * as ClothingController from '../controllers/clothing';

const router = Router();

router.get('/', ClothingController.index);

export default router;
