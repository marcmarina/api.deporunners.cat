import eventEmitter from '../events/EventEmitter';
import { IEvent } from '../models/Event';
import {
  createEvent,
  getAllEvents,
  updateEvent,
  attendEvent,
  getById,
  getPagedEvents,
} from '../services/event';

import checkForErrors from '../utils/ErrorThrowing';

export const index = async (req, res, next) => {
  try {
    let events: IEvent[];
    if (req.query.page) {
      events = await getPagedEvents(
        req.query.page,
        parseInt(req.query.limit)
      );
    } else {
      events = await getAllEvents();
    }
    res.status(200).json(events);
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
    const event = await createEvent({ ...req.body });

    eventEmitter.emit('newEvent', event);

    res.status(201).json(event);
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
    const attending = req.query.attending === 'true';
    res.status(201).json(await attendEvent(eventId, userId, attending));
  } catch (ex) {
    next(ex);
  }
};
