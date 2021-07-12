import { Types } from 'mongoose';

import { generateToken } from '../utils/Utils';

const mongodbId = () => Types.ObjectId(generateToken(12));

export default {
  mongodbId,
};
