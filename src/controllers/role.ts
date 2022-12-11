import { Role } from '../models';
import { roleService } from '../services';

export const create = async (req, res) => {
  const { name } = req.body;
  const result = await roleService.createRole(new Role({ name }));
  res.status(201).json(result);
};
