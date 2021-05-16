import { MemberService } from '../services/MemberService';
import { findById } from '../services/tshirtSize';
import { Resolvers } from './codegen-types';

const memberService = new MemberService();

export const resolvers: Resolvers = {
  Query: {
    async member(_, { id }) {
      return await memberService.findById(id);
    },
  },

  Member: {
    async tshirtSize(parent) {
      if (typeof parent.tshirtSize === 'string') {
        return await findById(parent.tshirtSize);
      } else {
        return parent.tshirtSize;
      }
    },
  },
};
