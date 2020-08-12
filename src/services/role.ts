import Role, { IRole } from '../models/Role';

export const getAllRoles = async (): Promise<IRole[]> => {
  try {
    const roles = await Role.find();
    return roles;
  } catch (ex) {
    console.log('Get Roles', ex);
  }
};

export const createRole = async (role: IRole): Promise<IRole> => {
  try {
    const result = await role.save();
    return result;
  } catch (ex) {
    console.log(ex);
  }
};
