import bcrypt from 'bcrypt';
import { signJWT } from '../authentication';
import { AuthError } from '../errors';
import { IUser, User } from '../models';
import { generateToken } from '../utils';
import { BaseService } from './base-service';

type Session = {
  authToken: string;
  refreshToken: string;
};

export class UserService extends BaseService {
  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async createUser(user: IUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;

    return user.save();
  }

  async loginWithEmail(email: string, password: string) {
    let user = await User.findOne({ email });

    if (!user) {
      throw new AuthError('These credentials are invalid.');
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AuthError('These credentials are invalid.');
    }

    if (!user.refreshToken) {
      user = await this.createSessionToken(user);
    }

    const token = signJWT({ _id: user._id });

    return {
      authToken: token,
      refreshToken: user.refreshToken,
    };
  }

  async loginV2(email: string, password: string): Promise<Session | null> {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) return null;

    const session = await this.createSession(user);

    user.refreshToken = session.refreshToken;
    await user.save();

    return session;
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(password, hash);
  }

  private async createSession(user: IUser) {
    return {
      authToken: signJWT(user),
      refreshToken: user.refreshToken ?? generateToken(32),
    };
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(id);
    if (!user)
      throw {
        status: 400,
        msg: 'The user id is not valid',
      };

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword)
      throw {
        status: 400,
        msg: 'The old password is not valid',
      };

    user.password = await bcrypt.hash(newPassword, 12);
    return user.save();
  }

  async generateNewJWT(id, refreshToken) {
    const user = await this.findById(id);

    if (!user) {
      throw {
        status: 401,
        msg: 'Model id not valid',
      };
    }

    if (refreshToken && user.refreshToken === refreshToken) {
      return signJWT({ _id: user._id });
    } else {
      throw {
        status: 401,
        msg: 'Refresh token not valid',
      };
    }
  }

  private async createSessionToken(user: IUser) {
    const refreshToken = generateToken(64);
    user.refreshToken = refreshToken;
    return await user.save();
  }
}
