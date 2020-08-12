import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  try {
    const { email, password } = req.body;
  } catch (ex) {}
};
