import Role, { IRole } from '../models/Role';

export const getAllRoles = async (): Promise<IRole[]> => {
  try {
    return await Role.find();
  } catch (ex) {
    console.log('Get Roles', ex);
  }
};

export const createRole = async (role: IRole): Promise<IRole> => {
  try {
    return await role.save();
  } catch (ex) {
    console.log(ex);
  }
};
