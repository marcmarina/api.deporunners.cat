import { Expo } from 'expo-server-sdk';
import { Types } from 'mongoose';

import { logger } from '@deporunners/logger';
import { Event, IEvent, IMember } from '@deporunners/models';
import { Maybe, uniqueArray } from '@deporunners/utils';

import { BaseService } from './base-service';

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

  async findById(id: string): Promise<Maybe<IEvent>> {
    return Event.findOne({
      _id: id,
    });
  }

  async create(event: IEvent) {
    const newEvent = new Event({ ...event });
    return newEvent.save();
  }

  async update(event: IEvent) {
    return Event.updateOne({ _id: event._id }, event);
  }

  async attend(event: IEvent, userId: string, attending: boolean) {
    if (attending) {
      event.members = uniqueArray([...event.members, Types.ObjectId(userId)]);
    } else {
      event.members = event.members.filter(
        (member) => member.toString() !== userId,
      );
    }

    return event.save();
  }

  async sendNotification(event: IEvent, members: IMember[]) {
    try {
      const messages: any[] = [];

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
