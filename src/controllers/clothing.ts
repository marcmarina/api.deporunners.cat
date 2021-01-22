import {
  changeImage,
  createClothing,
  deleteClothing,
  findClothingById,
  getAllClothing,
  updateClothing,
} from '../services/clothing';
import checkForErrors from '../utils/ErrorThrowing';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllClothing());
  } catch (ex) {
    next(ex);
  }
};

export const show = async (req, res, next) => {
  try {
    const id = req.params.id;
    res.status(200).json(await findClothingById(id));
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await createClothing({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const setImage = async (req, res, next) => {
  try {
    const clothingId = req.params.id;
    res
      .status(201)
      .json(await changeImage(`images/${req.file.filename}`, clothingId));
  } catch (ex) {
    next(ex);
  }
};

export const update = async (req, res, next) => {
  try {
    res.status(201).json(await updateClothing({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    res.status(200).json(await deleteClothing(req.params.id));
  } catch (ex) {
    next(ex);
  }
};
