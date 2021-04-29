import { ClothingService } from '../services/ClothingService';

import checkForErrors from '../utils/ErrorThrowing';

const service = new ClothingService();

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await service.getAllClothing());
  } catch (ex) {
    next(ex);
  }
};

export const show = async (req, res, next) => {
  try {
    const id = req.params.id;
    res.status(200).json(await service.findById(id));
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await service.createClothing({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const setImage = async (req, res, next) => {
  try {
    const clothingId = req.params.id;
    res
      .status(201)
      .json(
        await service.changeImage(`images/${req.file.filename}`, clothingId)
      );
  } catch (ex) {
    next(ex);
  }
};

export const update = async (req, res, next) => {
  try {
    res.status(201).json(await service.updateClothing({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    res.status(200).json(await service.deleteClothing(req.params.id));
  } catch (ex) {
    next(ex);
  }
};
