import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  searchTasks,
  getTaskHistory
} from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/search', protect, searchTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.patch('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);
router.get('/:id/history', protect, getTaskHistory);

export default router;
