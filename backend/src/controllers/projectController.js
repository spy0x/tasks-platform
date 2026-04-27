import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { httpError } from '../utils/httpError.js';

export async function listProjects(_req, res) {
  const projects = await Project.find().sort({ updatedAt: -1 });
  res.json(projects);
}

export async function getProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) throw httpError(404, 'Project not found');

  const taskCount = await Task.countDocuments({ project: project.id });
  res.json({ ...project.toJSON(), taskCount });
}

export async function createProject(req, res) {
  const { name, description = '' } = req.body;
  if (!name?.trim()) throw httpError(400, 'Project name is required');

  const created = await Project.create({ name, description });
  res.status(201).json(created);
}

export async function updateProject(req, res) {
  const { name, description } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) throw httpError(404, 'Project not found');

  if (typeof name === 'string') project.name = name;
  if (typeof description === 'string') project.description = description;

  await project.save();
  res.json(project);
}

export async function deleteProject(req, res) {
  const deleted = await Project.findOneAndDelete({ _id: req.params.id });
  if (!deleted) throw httpError(404, 'Project not found');

  res.status(204).send();
}
