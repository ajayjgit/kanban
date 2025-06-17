import express from 'express';
import { getProfile, updateProfile, assignTask, unassignTask } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.post('/tasks/:id/assign', protect, assignTask);
router.delete('/tasks/:id/assign', protect, unassignTask);

export default router;
