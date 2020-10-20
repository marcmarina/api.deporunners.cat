import Role, { IRole } from '../models/Role';

export const getAllRoles = async () => {
  return Role.find();
};

export const createRole = async (role: IRole) => {
  return role.save();
};
