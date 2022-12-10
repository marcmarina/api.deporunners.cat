import { Router } from 'express';

import { getAllRoles } from '../services/role';
import { roleController } from '../controllers';

const router = Router();

router.get('', async (req, res) => {
  const roles = await getAllRoles();
  res.status(200).json(roles);
});

router.post('', roleController.create);

export default router;
