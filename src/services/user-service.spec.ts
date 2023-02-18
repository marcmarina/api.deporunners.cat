import { User } from '../models';
import { compareHash, hashString } from '../utils';

import { UserService } from './user-service';

jest.mock('../models');
jest.mock('../utils');

const mockedUser = User as jest.Mocked<typeof User>;

const userService = new UserService();

describe('user service', () => {
  const sampleUser = {
    _id: '6085b02c6b4b295ab8ee9490',
    name: 'John Doe',
    password: 'hashedPassword',
    email: 'john@doe.com',
    role: '6085b02b6b4b295ab8ee93ef',
    refreshToken:
      '9a1560c86f8bb8ee34d540574033bb9844331ca9af89be7f4f9f4271878656a92fce3936421037adaafd07d7a1f5d3f606b3bd6298327dbf11fc7695e616c4f9',
    toObject: jest.fn(),
    save: jest.fn(),
  } as any;

  const mockedHashString = hashString as jest.Mock;
  const mockedCompareHash = compareHash as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('returns all users', async () => {
      mockedUser.find.mockResolvedValueOnce([sampleUser]);

      await expect(userService.getAllUsers()).resolves.toEqual([sampleUser]);
    });
  });

  describe('findById', () => {
    it('returns a user for a specific id', async () => {
      mockedUser.findById.mockResolvedValueOnce(sampleUser);

      await expect(userService.findById('123123123')).resolves.toEqual(
        sampleUser,
      );
    });

    it("returns null if it can't find a user", async () => {
      mockedUser.findById.mockResolvedValueOnce(null);

      await expect(userService.findById('123123123')).resolves.toBeNull();
    });
  });

  describe('createUser', () => {
    it('creates a user with a hashed password', async () => {
      mockedUser.create.mockImplementationOnce((user) => {
        return user;
      });
      mockedHashString.mockResolvedValueOnce('hashedPassword');

      await expect(userService.createUser(sampleUser)).resolves.toEqual(
        sampleUser,
      );
    });
  });

  describe('login', () => {
    it("returns a session if the user's credentials are valid", async () => {
      mockedUser.findOne.mockResolvedValueOnce(sampleUser);
      mockedCompareHash.mockResolvedValueOnce(true);

      await expect(
        userService.login(sampleUser.email, sampleUser.password),
      ).resolves.toMatchObject({
        authToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it("returns null if the user's email is not valid", async () => {
      mockedUser.findOne.mockResolvedValueOnce(null);

      await expect(
        userService.login(sampleUser.email, sampleUser.password),
      ).resolves.toBeNull();
    });

    it("returns null if the user's password is not valid", async () => {
      mockedUser.findOne.mockResolvedValueOnce(sampleUser);
      mockedCompareHash.mockResolvedValueOnce(false);

      await expect(
        userService.login(sampleUser.email, sampleUser.password),
      ).resolves.toBeNull();
    });
  });
});
