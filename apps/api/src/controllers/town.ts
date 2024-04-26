import { Town } from '@deporunners/models';

export const index = async (req, res, next) => {
  try {
    return res.status(200).json(await Town.find());
  } catch (ex) {
    next(ex);
  }
};
