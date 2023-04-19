import { TShirtSize } from '@deporunners/models';

import { BaseService } from './base-service';

export class TShirtSizeService extends BaseService {
  async getAll() {
    return TShirtSize.find();
  }

  async findByIds(ids: string[]) {
    return TShirtSize.find().where('id').in([ids]);
  }

  async findById(id: string) {
    return this.findByIds([id]);
  }
}
