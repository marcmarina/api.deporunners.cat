import { Router } from 'express';

import * as ClothingController from '../controllers/clothing';
import { fullClothing } from '../validators/EndpointValidators';

const router = Router();

router.get('/', ClothingController.index);
router.post('/', fullClothing, ClothingController.create);

export default router;
