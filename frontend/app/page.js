'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { KanbanBoard } from '../components/KanbanBoard';
import { EisenhowerMatrix } from '../components/EisenhowerMatrix';

const initialTaskForm = {
  title: '',
  description: '',
  category: 'todo',
  eisenhowerTag: 'none'
};

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('kanban');

  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const loadProjects = async () => {
    const data = await api.listProjects();
    setProjects(data);
    if (!selectedProjectId && data[0]) setSelectedProjectId(data[0].id);
  };

  const loadTasks = async (projectId) => {
    if (!projectId) return setTasks([]);
    const data = await api.listTasks(projectId);
    setTasks(data);
  };

  useEffect(() => {
    setLoading(true);
    loadProjects()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTasks(selectedProjectId).catch((err) => setError(err.message));
  }, [selectedProjectId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    try {
      const created = await api.createProject(projectForm);
      setProjects((prev) => [created, ...prev]);
      setSelectedProjectId(created.id);
      setProjectForm({ name: '', description: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    if (!window.confirm(`Eliminar proyecto "${selectedProject.name}" y sus tareas?`)) return;

    await api.deleteProject(selectedProject.id);
    const updated = projects.filter((p) => p.id !== selectedProject.id);
    setProjects(updated);
    setSelectedProjectId(updated[0]?.id || '');
    setTasks([]);
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;

    const name = window.prompt('Nuevo nombre del proyecto', selectedProject.name);
    if (!name) return;
    const description =
      window.prompt('Nueva descripción del proyecto', selectedProject.description || '') ??
      selectedProject.description;

    const updated = await api.updateProject(selectedProject.id, { name, description });
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !taskForm.title.trim()) return;

    const created = await api.createTask(selectedProjectId, taskForm);
    setTasks((prev) => [...prev, created]);
    setTaskForm(initialTaskForm);
  };

  const handleUpdateTask = async (taskId, patch) => {
    const updated = await api.updateTask(taskId, patch);
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Eliminar tarea?')) return;
    await api.deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleMoveTask = async (taskId, category) => {
    const updated = await api.moveTask(taskId, category);
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updated : task)));
  };

  return (
    <main className="page">
      <aside className="panel sidebar">
        <div>
          <div className="brand">Tasks Platform</div>
          <small className="muted">CRUD + Kanban + Eisenhower</small>
        </div>

        <form onSubmit={handleCreateProject}>
          <input
            className="input"
            placeholder="Nuevo proyecto"
            value={projectForm.name}
            onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <textarea
            className="textarea"
            placeholder="Descripción"
            value={projectForm.description}
            onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
            style={{ marginTop: 8 }}
          />
          <button className="btn" style={{ marginTop: 8, width: '100%' }} type="submit">
            Crear proyecto
          </button>
        </form>

        <div>
          <small className="muted">Proyectos</small>
          <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-item ${selectedProjectId === project.id ? 'active' : ''}`}
                onClick={() => setSelectedProjectId(project.id)}
              >
                <strong>{project.name}</strong>
                {project.description ? (
                  <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                    {project.description}
                  </div>
                ) : null}
              </div>
            ))}
            {!projects.length && <div className="muted">No hay proyectos todavía.</div>}
          </div>
        </div>
      </aside>

      <section className="panel main">
        <div className="spread">
          <div>
            <h2 style={{ margin: 0 }}>{selectedProject?.name || 'Selecciona un proyecto'}</h2>
            <small className="muted">{selectedProject?.description || 'Crea uno nuevo en el panel izquierdo.'}</small>
          </div>
          <div className="row">
            <button className="btn secondary" onClick={() => setViewMode('kanban')}>
              Kanban
            </button>
            <button className="btn secondary" onClick={() => setViewMode('matrix')}>
              Matriz Eisenhower
            </button>
            <button className="btn secondary" onClick={handleEditProject} disabled={!selectedProject}>
              Editar proyecto
            </button>
            <button className="btn danger" onClick={handleDeleteProject} disabled={!selectedProject}>
              Eliminar proyecto
            </button>
          </div>
        </div>

        {selectedProject ? (
          <form onSubmit={handleCreateTask} className="panel" style={{ padding: 12 }}>
            <div className="row" style={{ alignItems: 'stretch' }}>
              <input
                className="input"
                placeholder="Título tarea"
                value={taskForm.title}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                className="input"
                placeholder="Descripción"
                value={taskForm.description}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <button className="btn" type="submit">
                Crear tarea
              </button>
            </div>
          </form>
        ) : null}

        {loading ? <div className="muted">Cargando...</div> : null}
        {error ? <div className="muted" style={{ color: '#ffd4dc' }}>{error}</div> : null}

        {selectedProject ? (
          viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={tasks}
              onMoveTask={handleMoveTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ) : (
            <EisenhowerMatrix tasks={tasks} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} />
          )
        ) : (
          <div className="muted">Crea o selecciona un proyecto para empezar.</div>
        )}
      </section>
    </main>
  );
}
