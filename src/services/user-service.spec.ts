import { UserService } from './user-service';
import { User } from '../models';
import { AuthError } from '../errors';

jest.mock('../models');

const mockedUser = User as jest.Mocked<typeof User>;

const sampleUser = {
  _id: '6085b02c6b4b295ab8ee9490',
  name: 'John Doe',
  password: '$2b$12$loWvov.mzq1Mr4lNLsbdXOqMcJFrflHHDUDLUGRhPBdfus2bnSaUS',
  email: 'john@doe.com',
  role: '6085b02b6b4b295ab8ee93ef',
  refreshToken:
    '9a1560c86f8bb8ee34d540574033bb9844331ca9af89be7f4f9f4271878656a92fce3936421037adaafd07d7a1f5d3f606b3bd6298327dbf11fc7695e616c4f9',
};

mockedUser.findOne.mockResolvedValue(sampleUser as any);
mockedUser.findById.mockResolvedValue(sampleUser as any);

const userService = new UserService();

describe('findUserById', () => {
  it('returns a user for a specific id', async () => {
    const result = await userService.findById('123123123');

    expect(result).toMatchObject(sampleUser);
  });

  it('returns null if a user is not found', async () => {
    mockedUser.findById.mockResolvedValueOnce(null);

    const result = await userService.findById('123123123');

    expect(result).toBeNull();
  });
});

describe('loginWithEmail', () => {
  it('gives a JWT if valid credentials are provided', async () => {
    await expect(
      userService.loginWithEmail('john@doe.com', '123456'),
    ).resolves.toBeDefined();
  });

  it('throws an error when a non valid password is provided', async () => {
    await expect(
      userService.loginWithEmail('john@doe.com', 'wrongpassword'),
    ).rejects.toEqual(new AuthError('These credentials are invalid.'));
  });

  it('throws an error when non email is provided', async () => {
    await expect(
      userService.loginWithEmail('wrong@email.com', 'wrongpassword'),
    ).rejects.toEqual(new AuthError('These credentials are invalid.'));
  });
});
