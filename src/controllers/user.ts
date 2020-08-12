import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { createUser, loginWithEmail } from '../services/user';

export const login = async (req, res) => {
  const errors = validationResult(req);

  try {
    const { email, password } = req.body;
    const result = await loginWithEmail(email, password);
    console.log('1');

    res.status(200).json(result);
  } catch (ex) {}
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });
  const result = await createUser(user);
  res.status(201).json(result);
};
