import { Role, IRole } from '../models';

import { BaseService } from './base-service';

export class RoleService extends BaseService {
  async getAllRoles(): Promise<IRole[]> {
    return Role.find();
  }

  async create(role: IRole) {
    return role.save();
  }
}
