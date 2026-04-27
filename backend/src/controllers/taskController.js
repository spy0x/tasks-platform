import { Project } from '../models/Project.js';
import { Task, TASK_CATEGORIES, EISENHOWER_TAGS } from '../models/Task.js';
import { httpError } from '../utils/httpError.js';

async function assertProject(projectId) {
  const project = await Project.findById(projectId);
  if (!project) throw httpError(404, 'Project not found');
}

export async function listTasksByProject(req, res) {
  const { projectId } = req.params;
  await assertProject(projectId);

  const tasks = await Task.find({ project: projectId }).sort({ createdAt: 1 });
  res.json(tasks);
}

export async function createTask(req, res) {
  const { projectId } = req.params;
  await assertProject(projectId);

  const {
    title,
    description = '',
    category = 'todo',
    eisenhowerTag = 'none',
    priority = 0,
    dueDate = null
  } = req.body;

  if (!title?.trim()) throw httpError(400, 'Task title is required');
  if (!TASK_CATEGORIES.includes(category)) throw httpError(400, 'Invalid category');
  if (!EISENHOWER_TAGS.includes(eisenhowerTag)) throw httpError(400, 'Invalid eisenhowerTag');

  const task = await Task.create({
    project: projectId,
    title,
    description,
    category,
    eisenhowerTag,
    priority,
    dueDate
  });

  res.status(201).json(task);
}

export async function getTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) throw httpError(404, 'Task not found');
  res.json(task);
}

export async function updateTask(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) throw httpError(404, 'Task not found');

  const { title, description, category, eisenhowerTag, priority, dueDate } = req.body;

  if (typeof title === 'string') task.title = title;
  if (typeof description === 'string') task.description = description;

  if (typeof category === 'string') {
    if (!TASK_CATEGORIES.includes(category)) throw httpError(400, 'Invalid category');
    task.category = category;
  }

  if (typeof eisenhowerTag === 'string') {
    if (!EISENHOWER_TAGS.includes(eisenhowerTag)) throw httpError(400, 'Invalid eisenhowerTag');
    task.eisenhowerTag = eisenhowerTag;
  }

  if (typeof priority === 'number') task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();
  res.json(task);
}

export async function moveTaskCategory(req, res) {
  const task = await Task.findById(req.params.id);
  if (!task) throw httpError(404, 'Task not found');

  const { category } = req.body;
  if (!TASK_CATEGORIES.includes(category)) throw httpError(400, 'Invalid category');

  task.category = category;
  await task.save();
  res.json(task);
}

export async function deleteTask(req, res) {
  const deleted = await Task.findByIdAndDelete(req.params.id);
  if (!deleted) throw httpError(404, 'Task not found');
  res.status(204).send();
}
