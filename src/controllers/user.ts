import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { createUser, loginWithEmail } from '../services/user';

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      const error = { status: 400, errors: errors };
      throw error;
    }

    const { email, password } = req.body;
    const result = await loginWithEmail(email, password);
    res.status(200).json(result);
  } catch (ex) {
    next(ex);
  }
};

export const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      const error = { status: 400, errors: errors };
      throw error;
    }
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    const result = await createUser(user);
    res.status(201).json(result);
  } catch (ex) {
    next(ex);
  }
};
