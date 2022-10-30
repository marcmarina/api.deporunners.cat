import { TShirtSize } from '../models';
import { withServiceErrors } from '../errors/with-service-errors';

const getAllTShirtSizes = async () => {
  return await TShirtSize.find();
};

const findByIds = async (ids: string[]) => {
  return await TShirtSize.find().where('id').in([ids]);
};

const tshirtSizeService = {
  getAllTShirtSizes,
  findByIds,
};

export default withServiceErrors<typeof tshirtSizeService>(
  tshirtSizeService,
  'TShirtSizeService',
);
