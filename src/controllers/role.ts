import { Role } from '../models';
import { RoleService } from '../services';

const roleService = new RoleService();

export const create = async (req, res) => {
  const { name } = req.body;
  const result = await roleService.create(new Role({ name }));
  res.status(201).json(result);
};
