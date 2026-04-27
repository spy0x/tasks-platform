import { Router } from 'express';
import {
  deleteTask,
  getTask,
  moveTaskCategory,
  updateTask
} from '../controllers/taskController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = Router();

router.get('/:id', asyncHandler(getTask));
router.put('/:id', asyncHandler(updateTask));
router.patch('/:id/category', asyncHandler(moveTaskCategory));
router.delete('/:id', asyncHandler(deleteTask));

export default router;
