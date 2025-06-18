import { Request, Response } from 'express';
import Task from '../models/taskModel';

// Create Task
export const createTask = async (req: Request & { user?: any }, res: Response) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    createdBy: req.user.id,
    status: 'To Do',
    history: [{ status: 'To Do', changedAt: new Date() }]
  });

  res.status(201).json(task);
};

// Get All Tasks (optional filter, pagination)
export const getTasks = async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter: any = status ? { status } : {};

  const tasks = await Task.find(filter)
    .skip((+page - 1) * +limit)
    .limit(+limit);

  res.json(tasks);
};

// Get Task By ID
export const getTaskById = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};

// Update Task Status
export const updateTaskStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  type TaskStatus = 'To Do' | 'In Progress' | 'Done';

const validTransitions: Record<TaskStatus, TaskStatus> = {
  'To Do': 'In Progress',
  'In Progress': 'Done',
  'Done': 'To Do'
};

if (!task.status || !(task.status in validTransitions)) {
  return res.status(400).json({ message: 'Invalid current status' });
}

if (status !== validTransitions[task.status as TaskStatus]) {
  return res.status(400).json({
    message: `Invalid status transition from '${task.status}' to '${status}'`,
  });
}

  task.status = status;
  task.history.push({ status, changedAt: new Date() });
  await task.save();
  res.json(task);
};

// Search Task by Title or Description
export const searchTasks = async (req: Request, res: Response) => {
  const { query } = req.query;
  const regex = new RegExp(query as string, 'i');

  const tasks = await Task.find({
    $or: [{ title: regex }, { description: regex }]
  });

  res.json(tasks);
};

// Get Task History
export const getTaskHistory = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task.history);
};


// Add Comment
export const addComment = async (req: Request & { user?: any }, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const comment = {
    user: req.user.id,
    text: req.body.text,
    createdAt: new Date()
  };

  task.comments.push(comment);
  await task.save();

  res.status(201).json({ message: 'Comment added', comment });
};

// Get Comments
export const getComments = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id).populate('comments.user', 'name email');
  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.json(task.comments);
};

// Delete Comment
export const deleteComment = async (req: Request & { user?: any }, res: Response) => {
  const { id, commentId } = req.params;

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const commentIndex = task.comments.findIndex((c: any) => c._id.toString() === commentId);

  if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });

  const comment = task.comments[commentIndex];
  const isOwner = comment.user.toString() === req.user.id;

  if (!isOwner) return res.status(403).json({ message: 'Not authorized to delete this comment' });

  task.comments.splice(commentIndex, 1);
  await task.save();

  res.json({ message: 'Comment deleted' });
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
