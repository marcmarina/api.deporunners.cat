import { MemberService } from '../services/MemberService';
import { Resolvers } from './codegen-types';

const memberService = new MemberService();

export const resolvers: Resolvers = {
  Query: {
    async member(_, { id }) {
      return await memberService.findById(id);
    },
  },
};
