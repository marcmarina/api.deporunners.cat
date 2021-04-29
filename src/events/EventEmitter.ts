import { EventEmitter } from 'events';
import { Schema } from 'mongoose';
import { IEvent } from '../models/Event';
import { sendNotification } from '../services/event';
import { MemberService } from '../services/MemberService';

const memberService = new MemberService();

const eventEmitter = new EventEmitter();

eventEmitter.on('memberSignup', (id: Schema.Types.ObjectId) => {
  try {
    memberService.sendSignupEmail(id);
  } catch (ex) {
    console.log(ex);
  }
});

eventEmitter.on('newEvent', (event: IEvent) => {
  sendNotification(event);
});

export default eventEmitter;
