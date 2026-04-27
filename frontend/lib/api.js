const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Request failed');
  }

  return data;
}

export const api = {
  listProjects: () => request('/projects'),
  createProject: (payload) => request('/projects', { method: 'POST', body: JSON.stringify(payload) }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  listTasks: (projectId) => request(`/projects/${projectId}/tasks`),
  createTask: (projectId, payload) =>
    request(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  moveTask: (id, category) =>
    request(`/tasks/${id}/category`, { method: 'PATCH', body: JSON.stringify({ category }) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};

export const taskCategories = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

export const eisenhowerOptions = [
  { key: 'none', label: 'Sin tag' },
  { key: 'do', label: 'Urgente + Importante' },
  { key: 'schedule', label: 'No urgente + Importante' },
  { key: 'delegate', label: 'Urgente + No importante' },
  { key: 'eliminate', label: 'No urgente + No importante' }
];
