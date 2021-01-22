import { Router } from 'express';

import * as ClothingController from '../controllers/clothing';
import { fullClothing } from '../validators/EndpointValidators';

const router = Router();

router.get('/:id', ClothingController.show);
router.get('/', ClothingController.index);

router.post('/', fullClothing, ClothingController.create);

router.put('/:id/image', ClothingController.setImage);
router.put('/', ClothingController.update);

router.delete('/:id', ClothingController.destroy);

export default router;
