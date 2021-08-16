import * as UserService from '../services/user';
import { generateNewJWT } from './SessionManagement';

jest.mock('../services/user');
jest.mock('../services/member-service', () => {
  return {
    MemberService: jest.fn().mockReturnValue({
      findById: jest.fn().mockReturnValue(undefined),
    }),
  };
});

const mockedUser = UserService as jest.Mocked<typeof UserService>;

const sampleUser = {
  _id: '6085b02c6b4b295ab8ee9490',
  name: 'John Doe',
  password: '$2b$12$loWvov.mzq1Mr4lNLsbdXOqMcJFrflHHDUDLUGRhPBdfus2bnSaUS',
  email: 'john@doe.com',
  role: '6085b02b6b4b295ab8ee93ef',
  refreshToken:
    '9a1560c86f8bb8ee34d540574033bb9844331ca9af89be7f4f9f4271878656a92fce3936421037adaafd07d7a1f5d3f606b3bd6298327dbf11fc7695e616c4f9',
};

mockedUser.findUserById.mockResolvedValue(sampleUser as any);

it('returns a new JWT when given valid information', async () => {
  await expect(
    generateNewJWT(sampleUser._id, sampleUser.refreshToken, 'User')
  ).resolves.toBeDefined();
});

it('throws an error when wrong refresh token is given', async () => {
  await expect(
    generateNewJWT(sampleUser._id, 'invalid token', 'User')
  ).rejects.toEqual({
    status: 401,
    msg: 'Refresh token not valid',
  });
});

it('throws an error when wrong model name is given', async () => {
  await expect(
    generateNewJWT(sampleUser._id, sampleUser.refreshToken, 'Member')
  ).rejects.toEqual({
    status: 401,
    msg: 'Model id not valid',
  });
});
