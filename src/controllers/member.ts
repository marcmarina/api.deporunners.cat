import { validationResult } from 'express-validator';
import Member from '../models/Member';
import Town from '../models/Town';
import TShirtSize from '../models/TShirtSize';
import {
  createMember,
  getAllMembers,
  findMemberById,
  deleteById,
} from '../services/member';

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      const error = { status: 400, errors: errors };
      throw error;
    }
    const { firstName, lastName, email, dni, address, tshirtSize } = req.body;
    const matchingT = await TShirtSize.findById(tshirtSize);
    if (!matchingT)
      throw {
        status: 400,
        msg: 'TShirt Size Invalid',
      };

    const matchingTown = await Town.findById(address.town);
    if (!matchingTown)
      throw {
        status: 400,
        msg: 'Town Invalid',
      };

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
