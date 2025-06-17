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

// Assign Task to User
export const assignTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.assignedTo = userId;
  await task.save();

  res.json({ message: 'Task assigned successfully', task });
};

// Unassign Task from User
export const unassignTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.assignedTo = null;
  await task.save();

  res.json({ message: 'Task unassigned successfully', task });
};
