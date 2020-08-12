import { Router } from 'express';

import { getAllRoles, createRole } from '../services/role';
import Role from '../models/Role';

const router = Router();

router.get('', async (req, res) => {
  const roles = await getAllRoles();
  res.status(200).json(roles);
});

router.post('', async (req, res) => {
  const { name } = req.body;
  const result = await createRole(new Role({ name }));
  res.status(201).json(result);
});

export default router;
