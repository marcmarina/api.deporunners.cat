import { Router } from 'express';

import { getAllRoles } from '../services/role';
import * as RoleController from '../controllers/role';
import Role from '../models/Role';

const router = Router();

router.get('', async (req, res) => {
  const roles = await getAllRoles();
  res.status(200).json(roles);
});

router.post('', RoleController.create);

export default router;
