import { Router } from 'express';

import * as OrderController from '../controllers/order';
import { createOrder } from '../validators/EndpointValidators';

const router = Router();

router.post('/', createOrder, OrderController.create);

export default router;
