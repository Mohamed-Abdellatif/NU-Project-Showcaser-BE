


import { Request, Response } from 'express';

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.status(200).send("login successful");
  } catch (error) {
    console.log("error")
  }
};
