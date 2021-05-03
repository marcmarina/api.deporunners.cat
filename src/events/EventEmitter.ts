import { EventEmitter } from 'events';
import { Schema } from 'mongoose';
import { IEvent } from '../models/Event';
import { EventService } from '../services/EventService';
import { MemberService } from '../services/MemberService';

const memberService = new MemberService();
const eventService = new EventService();

const eventEmitter = new EventEmitter();

eventEmitter.on('memberSignup', (id: Schema.Types.ObjectId) => {
  try {
    memberService.sendSignupEmail(id);
  } catch (ex) {
    console.log(ex);
  }
});

eventEmitter.on('newEvent', (event: IEvent) => {
  eventService.sendNotification(event);
});

export default eventEmitter;
