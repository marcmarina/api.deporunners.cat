import { signJWT } from '../authentication';
import { User, IUser } from '../models';
import { compareHash, generateToken, hashString } from '../utils';

type Session = {
  authToken: string;
  refreshToken: string;
};

export async function getAllUsers(): Promise<IUser[]> {
  return User.find();
}

export async function findById(id: string) {
  return await User.findById(id);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<IUser> {
  const hashedPassword = await hashString(input.password);

  return await User.create({
    ...input,
    password: hashedPassword,
  });
}

export async function login(
  email: string,
  password: string,
): Promise<Session | null> {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await compareHash(password, user.password);
  if (!isPasswordValid) return null;

  const session = await createSession(user);

  user.refreshToken = session.refreshToken;
  await user.save();

  return session;
}

async function createSession(user: IUser) {
  return {
    authToken: signJWT(user.toObject()),
    refreshToken: user.refreshToken ?? generateToken(32),
  };
}

export async function updatePassword(
  id: string,
  oldPassword: string,
  newPassword: string,
) {
  const user = await User.findById(id);
  if (!user)
    throw {
      status: 400,
      msg: 'The user id is not valid',
    };

  const validPassword = await compareHash(oldPassword, user.password);
  if (!validPassword)
    throw {
      status: 400,
      msg: 'The old password is not valid',
    };

  user.password = await hashString(newPassword);
  return user.save();
}

export async function createSessionToken(user: IUser) {
  const refreshToken = generateToken(64);
  user.refreshToken = refreshToken;
  return await user.save();
}
