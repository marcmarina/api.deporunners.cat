import { createClothing, getAllClothing } from '../services/clothing';
import checkForErrors from '../utils/ErrorThrowing';
import { deleteFile } from '../utils/Utils';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllClothing());
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const image = req.file;
    res
      .status(201)
      .json(await createClothing({ ...req.body, image: image.filename }));
  } catch (ex) {
    deleteFile(req.file.path);
    next(ex);
  }
};
