import { EventEmitter } from 'events';
import { Schema } from 'mongoose';
import { IEvent } from '../models/Event';
import { sendNotification } from '../services/event';
import { sendSignupEmail, sendSignupEmailInternal } from '../services/member';

const eventEmitter = new EventEmitter();

eventEmitter.on('memberSignup', (id: Schema.Types.ObjectId) => {
  try {
    sendSignupEmail(id);
    sendSignupEmailInternal(id);
  } catch (ex) {
    console.log(ex);
  }
});

eventEmitter.on('newEvent', (event: IEvent) => {
  sendNotification(event);
});

export default eventEmitter;
