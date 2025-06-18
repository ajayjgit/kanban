import { Request, Response } from 'express';
import User from '../models/userModel';
import Task from '../models/taskModel';
import { Types } from 'mongoose';
// Get Logged-in User Profile
export const getProfile = async (req: Request & { user?: any }, res: Response) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Update Profile
export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
