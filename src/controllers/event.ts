import { checkForErrors } from '@deporunners/errors';

import { IEvent } from '../models';
import { EventService } from '../services';

const eventService = new EventService();

export const index = async (req, res, next) => {
  try {
    let events: IEvent[];
    if (req.query.page) {
      events = await eventService.getPaged(
        req.query.page,
        parseInt(req.query.limit),
      );
    } else {
      events = await eventService.getAll();
    }
    res.status(200).json(events);
  } catch (ex) {
    next(ex);
  }
};

export const show = async (req, res, next) => {
  try {
    res.status(200).json(await eventService.findById(req.params.id));
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const event = await eventService.create({ ...req.body });

    eventService.sendNotification(event);

    res.status(201).json(event);
  } catch (ex) {
    next(ex);
  }
};

export const update = async (req, res, next) => {
  try {
    checkForErrors(req);
    res.status(201).json(await eventService.update({ ...req.body }));
  } catch (ex) {
    next(ex);
  }
};

export const attend = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const eventId = req.params.id;
    const attending = req.query.attending === 'true';

    const event = await eventService.findById(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    res.status(201).json(await eventService.attend(event, userId, attending));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await eventService.findById(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    res.status(200).json(await eventService.deleteById(event._id));
  } catch (ex) {
    next(ex);
  }
};
