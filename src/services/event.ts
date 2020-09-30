import Event, { IEvent } from '../models/Event';

export const getAllEvents = async () => {
  try {
    return await Event.find();
  } catch (ex) {
    throw ex;
  }
};

export const createEvent = async (event: IEvent) => {
  try {
    const newEvent = new Event({ ...event });
    return await newEvent.save();
  } catch (ex) {
    throw ex;
  }
};
