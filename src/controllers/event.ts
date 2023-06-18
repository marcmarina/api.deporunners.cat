import { checkForErrors } from '@deporunners/errors';
import { IEvent } from '@deporunners/models';

import { EventService, MemberService } from '../services';

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
  const eventService = new EventService();
  const memberService = new MemberService();

  try {
    checkForErrors(req);

    const [event, members] = await Promise.all([
      eventService.create({ ...req.body }),
      memberService.getAll(),
    ]);

    eventService.sendNotification(event, members);

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
