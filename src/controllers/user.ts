import { User } from '../models';
import {
  createUser,
  getAllUsers,
  findUserById,
  loginWithEmail,
  updatePassword,
} from '../services/user';
import checkForErrors from '../utils/ErrorThrowing';
import Context from '../utils/Context';

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllUsers());
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    checkForErrors(req);

    const { email, password } = req.body;
    const { refreshToken, authToken } = await loginWithEmail(email, password);

    res.set({
      'x-refresh-token': refreshToken,
    });

    return res.status(200).json(authToken);
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    const result = await createUser(user);
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

    res.status(200).json(await updatePassword(id, oldPassword, newPassword));
  } catch (ex) {
    next(ex);
  }
};

export const self = async (req, res, next) => {
  try {
    res.status(200).json(await findUserById(Context.getUserId()));
  } catch (ex) {
    next(ex);
  }
};
