import { createRole } from '../services/role';
import Role from '../models/Role';

export const create = async (req, res) => {
  const { name } = req.body;
  const result = await createRole(new Role({ name }));
  res.status(201).json(result);
};
