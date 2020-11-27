import { Schema } from 'mongoose';
import { Expo } from 'expo-server-sdk';

import Event, { IEvent } from '../models/Event';
import { getAllMembers } from './member';

export const getAllEvents = async () => {
  return Event.find().sort({ createdAt: 'desc', name: 'asc' });
};

export const getPagedEvents = async (page: number, perPage: number) => {
  return Event.find()
    .sort({ createdAt: 'desc', name: 'asc' })
    .skip((page - 1) * perPage)
    .limit(perPage);
};

export const getById = async (id: Schema.Types.ObjectId) => {
  const event = await Event.findById(id);
  if (!event)
    throw {
      status: 404,
      message: 'Event id not valid',
    };
  return event;
};

export const createEvent = async (event: IEvent) => {
  const newEvent = new Event({ ...event });
  return newEvent.save();
};

export const updateEvent = async (event: IEvent) => {
  return Event.updateOne({ _id: event._id }, event);
};

export const attendEvent = async (
  eventId: string,
  userId: Schema.Types.ObjectId,
  attending: boolean
) => {
  const event = await Event.findById(eventId);
  if (attending) {
    if (!event.members.includes(userId)) event.members.push(userId);
  } else {
    const index = event.members.indexOf(userId);
    if (index > -1) {
      event.members.splice(index, 1);
    }
  }
  return event.save();
};

export const sendNotification = async (event: IEvent) => {
  try {
    const messages = [];
    const members = await getAllMembers();

    const expo = new Expo();

    members.forEach(member => {
      if (member.expoPushToken) {
        messages.push({
          to: member.expoPushToken,
          sound: 'default',
          title: "S'ha publicat un nou event!",
          body: event.name,
          data: {
            route: 'Events',
            params: {
              screen: 'EventDetails',
              params: {
                event: event,
              },
            },
          },
        });
      }
    });

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  } catch (ex) {
    console.log('Error sending notifications!', ex);
  }
};

export const deleteById = async (id: Schema.Types.ObjectId) => {
  const event = await Event.findById(id);
  if (!event)
    throw {
      status: 404,
      msg: 'The id is not valid',
    };

  return Event.findByIdAndDelete(id);
};
