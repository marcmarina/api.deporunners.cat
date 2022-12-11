import { Router } from 'express';

import { roleController } from '../controllers';
import { roleService } from '../services';

const router = Router();

router.get('', async (req, res) => {
  const roles = await roleService.getAllRoles();
  res.status(200).json(roles);
});

router.post('', roleController.create);

export default router;
