import { EventEmitter } from 'events';
import { Schema } from 'mongoose';
import { IEvent } from '../models/Event';
import { sendNotification } from '../services/event';
import { sendSignupEmail } from '../services/member';

const eventEmitter = new EventEmitter();

eventEmitter.on('memberSignup', (id: Schema.Types.ObjectId) => {
  sendSignupEmail(id);
});

eventEmitter.on('newEvent', (event: IEvent) => {
  sendNotification(event);
});

export default eventEmitter;