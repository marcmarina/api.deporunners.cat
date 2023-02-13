import { Expo } from 'expo-server-sdk';
import { Types } from 'mongoose';

import { logger } from '../logger';
import { Event, IEvent } from '../models';

import { BaseService } from './base-service';
import { MemberService } from './member-service';

const memberService = new MemberService();

export class EventService extends BaseService {
  async getAll() {
    return Event.find().sort({ createdAt: 'desc', name: 'asc' });
  }

  async getPaged(page: number, perPage: number) {
    return Event.find()
      .sort({ createdAt: 'desc', name: 'asc' })
      .skip((page - 1) * perPage)
      .limit(perPage);
  }

  async getById(id: string): Promise<IEvent | null> {
    return Event.findById(id);
  }

  async create(event: IEvent) {
    const newEvent = new Event({ ...event });
    return newEvent.save();
  }

  async update(event: IEvent) {
    return Event.updateOne({ _id: event._id }, event);
  }

  async attend(userId: string, eventId: string, attending: boolean) {
    const event = await this.getById(eventId);

    if (!event) return;

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
      const members = await memberService.getAll();

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
    return Event.findByIdAndDelete(id);
  }
}
