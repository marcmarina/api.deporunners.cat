import { Request } from 'express';
import { validationResult } from 'express-validator';
import Member from '../models/Member';
import Town from '../models/Town';
import TShirtSize from '../models/TShirtSize';
import {
  createMember,
  getAllMembers,
  findMemberById,
  deleteById,
  update,
  loginCredentials,
  updatePassword,
} from '../services/member';
import checkForErrors from '../utils/ErrorThrowing';

export const create = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { firstName, lastName, email, dni, address, tshirtSize } = req.body;

    const member = new Member({
      firstName,
      lastName,
      email,
      address,
      dni,
      tshirtSize,
    });

    const result = await createMember(member);
    res.status(200).json(result);
  } catch (ex) {
    next(ex);
  }
};

export const index = async (req, res, next) => {
  try {
    res.status(200).json(await getAllMembers());
  } catch (ex) {
    next(ex);
  }
};

export const find = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await findMemberById(id));
  } catch (ex) {
    next(ex);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json(await deleteById(id));
  } catch (ex) {
    next(ex);
  }
};

export const put = async (req, res, next) => {
  try {
    checkForErrors(req);
    const member = req.body;
    res.status(200).json(await update(member));
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    checkForErrors(req);
    const { username, password } = req.body;
    res.status(200).json(await loginCredentials(username, password));
  } catch (ex) {
    next(ex);
  }
};

export const changePassword = async (req: Request, res, next) => {
  try {
    checkForErrors(req);

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    res.status(200).json(await updatePassword(id, oldPassword, newPassword));
  } catch (ex) {
    next(ex);
  }
};
