import User from '../models/User';
import {
  createUser,
  getAllUsers,
  getSelfInfo,
  loginWithEmail,
  updatePassword,
} from '../services/user';
import Role from '../models/Role';
import checkForErrors from '../utils/ErrorThrowing';

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
    res.status(200).json(authToken);
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { name, email, password, role } = req.body;
    const foundRole = await Role.findById(role);
    if (!foundRole) {
      throw {
        status: 400,
        errors: [{ param: role, msg: 'The provided role is not valid.' }],
      };
    }
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
    const { userId } = req;
    res.status(200).json(await getSelfInfo(userId));
  } catch (ex) {
    next(ex);
  }
};
