import dayjs from 'dayjs';
import { createEvent, getAllEvents } from '../services/event';
import checkForErrors from '../utils/ErrorThrowing';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllEvents());
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await createEvent({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};
