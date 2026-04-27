import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from '../controllers/projectController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { createTask, listTasksByProject } from '../controllers/taskController.js';

const router = Router();

router.get('/', asyncHandler(listProjects));
router.post('/', asyncHandler(createProject));
router.get('/:id', asyncHandler(getProject));
router.put('/:id', asyncHandler(updateProject));
router.delete('/:id', asyncHandler(deleteProject));

router.get('/:projectId/tasks', asyncHandler(listTasksByProject));
router.post('/:projectId/tasks', asyncHandler(createTask));

export default router;
