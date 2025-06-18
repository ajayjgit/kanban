import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  getComments,
  deleteComment,
  updateTaskStatus,
  searchTasks,
  getTaskHistory, assignTask, unassignTask
} from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/search', protect, searchTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', protect, getComments);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);
router.get('/:id/history', protect, getTaskHistory);
router.post('/:id/assign', protect, assignTask);
router.delete('/:id/assign', protect, unassignTask);

export default router;
