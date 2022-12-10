import { Router } from 'express';

import { roleService } from '../services';
import { roleController } from '../controllers';

const router = Router();

router.get('', async (req, res) => {
  const roles = await roleService.getAllRoles();
  res.status(200).json(roles);
});

router.post('', roleController.create);

export default router;
