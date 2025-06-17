import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
};

const token = generateToken(user._id.toString()); // ✅ Fixes the error

  res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: any = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  res.json({ token });
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ message: 'Logout handled client-side by token deletion' });
};
