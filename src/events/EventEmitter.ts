import { EventEmitter } from 'events';
import { IEvent } from '../models/Event';
import { EventService } from '../services/event-service';

const eventService = new EventService();

const eventEmitter = new EventEmitter();

eventEmitter.on('newEvent', (event: IEvent) => {
  eventService.sendNotification(event);
});

export default eventEmitter;
