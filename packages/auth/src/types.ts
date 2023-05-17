import { MakeNullable } from '@deporunners/utils';

export type Session = {
  authToken: string;
  refreshToken: string;
  user: any;
};

export type PartialSession = MakeNullable<
  Session,
  'authToken' | 'refreshToken'
>;
