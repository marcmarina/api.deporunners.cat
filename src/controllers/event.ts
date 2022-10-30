import { IEvent } from '../models/Event';
import { EventService } from '../services/event-service';
import checkForErrors from '../utils/ErrorThrowing';

const service = new EventService();

export const index = async (req, res, next) => {
  try {
    let events: IEvent[];
    if (req.query.page) {
      events = await service.getPagedEvents(
        req.query.page,
        parseInt(req.query.limit),
      );
    } else {
      events = await service.getAllEvents();
    }
    res.status(200).json(events);
  } catch (ex) {
    next(ex);
  }
};

export const show = async (req, res, next) => {
  try {
    res.status(200).json(await service.getById(req.params.id));
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const event = await service.createEvent({ ...req.body });

    service.sendNotification(event);

    res.status(201).json(event);
  } catch (ex) {
    next(ex);
  }
};

export const update = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await service.updateEvent({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const attend = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const attending = req.query.attending === 'true';
    res.status(201).json(await service.attendEvent(eventId, attending));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    res.status(200).json(await service.deleteById(eventId));
  } catch (ex) {
    next(ex);
  }
};
