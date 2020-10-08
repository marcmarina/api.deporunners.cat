import {
  createEvent,
  getAllEvents,
  updateEvent,
  attendEvent,
  getById,
} from '../services/event';
import checkForErrors from '../utils/ErrorThrowing';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllEvents());
  } catch (ex) {
    next(ex);
  }
};

export const show = async (req, res, next) => {
  try {
    res.status(200).json(await getById(req.params.id));
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

export const update = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await updateEvent({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const attend = async (req, res, next) => {
  try {
    const userId = req.userId;
    const eventId = req.params.id;
    const attending = req.query.attending;
    res.status(201).json(await attendEvent(eventId, userId, attending));
  } catch (ex) {
    next(ex);
  }
};
