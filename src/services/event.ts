import { Schema } from 'mongoose';

import Event, { IEvent } from '../models/Event';

export const getAllEvents = async () => {
  try {
    return await Event.find();
  } catch (ex) {
    throw ex;
  }
};

export const getPagedEvents = async (page: number, perPage: number) => {
  try {
    return await Event.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
  } catch (ex) {
    throw ex;
  }
};

export const getById = async (id: Schema.Types.ObjectId) => {
  try {
    return await Event.findById(id);
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

export const updateEvent = async (event: IEvent) => {
  try {
    return await Event.updateOne({ _id: event._id }, event);
  } catch (ex) {
    throw ex;
  }
};

export const attendEvent = async (
  eventId: string,
  userId: Schema.Types.ObjectId,
  attending: boolean
) => {
  try {
    const event = await Event.findById(eventId);
    if (attending) {
      if (!event.members.includes(userId)) event.members.push(userId);
    } else {
      const index = event.members.indexOf(userId);
      if (index > -1) {
        event.members.splice(index, 1);
      }
    }
    return await event.save();
  } catch (ex) {
    throw ex;
  }
};
