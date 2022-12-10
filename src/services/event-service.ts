import { Expo } from 'expo-server-sdk';
import { Types } from 'mongoose';

import { Event, IEvent } from '../models';
import { logger } from '../logger';
import { MemberService } from './member-service';

const memberService = new MemberService();

export class EventService {
  async getAllEvents() {
    return Event.find().sort({ createdAt: 'desc', name: 'asc' });
  }

  async getPagedEvents(page: number, perPage: number) {
    return Event.find()
      .sort({ createdAt: 'desc', name: 'asc' })
      .skip((page - 1) * perPage)
      .limit(perPage);
  }

  async getById(id: Types.ObjectId) {
    const event = await Event.findById(id);
    if (!event)
      throw {
        status: 404,
        msg: 'Event id not valid',
      };
    return event;
  }

  async createEvent(event: IEvent) {
    const newEvent = new Event({ ...event });
    return newEvent.save();
  }

  async updateEvent(event: IEvent) {
    return Event.updateOne({ _id: event._id }, event);
  }

  async attendEvent(userId: string, eventId: string, attending: boolean) {
    const event = await Event.findById(eventId);

    if (!event)
      throw {
        status: 404,
        msg: 'Event not found',
      };

    if (attending) {
      if (!event.members.includes(Types.ObjectId(userId)))
        event.members.push(Types.ObjectId(userId));
    } else {
      const index = event.members.indexOf(Types.ObjectId(userId));
      if (index > -1) {
        event.members.splice(index, 1);
      }
    }
    return event.save();
  }

  async sendNotification(event: IEvent) {
    try {
      const messages: any[] = [];
      const members = await memberService.getAllMembers();

      const expo = new Expo();

      members.forEach((member) => {
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
      logger.error(ex);
    }
  }

  async deleteById(id: Types.ObjectId) {
    const event = await Event.findById(id);
    if (!event)
      throw {
        status: 404,
        msg: 'The id is not valid',
      };

    return Event.findByIdAndDelete(id);
  }
}
