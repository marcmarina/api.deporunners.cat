import { User } from '../models';
import { checkForErrors } from '../utils';
import { UserService } from '../services';

const userService = new UserService();

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await userService.getAllUsers());
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { email, password } = req.body;
    const { refreshToken, authToken } = await userService.loginWithEmail(
      email,
      password,
    );

    res.set({
      'x-refresh-token': refreshToken,
    });

    return res.status(200).json(authToken);
  } catch (ex) {
    next(ex);
  }
};

export const loginV2 = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { email, password } = req.body;
    const session = await userService.loginV2(email, password);

    if (!session) {
      return res.status(401).send('Invalid credentials');
    }

    res.set({
      'x-refresh-token': session.refreshToken,
      'x-auth-token': session.authToken,
    });

    return res.status(200).json(session);
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    const result = await userService.createUser(user);
    res.status(201).json(result);
  } catch (ex) {
    next(ex);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    res
      .status(200)
      .json(await userService.updatePassword(id, oldPassword, newPassword));
  } catch (ex) {
    next(ex);
  }
};

export const self = async (req, res, next) => {
  try {
    const userId = res.locals.user._id;

    res.status(200).json(await userService.findById(userId));
  } catch (ex) {
    next(ex);
  }
};
