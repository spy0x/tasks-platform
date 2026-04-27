'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { eisenhowerOptions, taskCategories } from '../lib/api';

export function TaskCard({ task, onDelete, onUpdate, compact = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };

  const editTask = () => {
    const title = window.prompt('Nuevo título', task.title);
    if (!title) return;
    const description = window.prompt('Nueva descripción', task.description || '') ?? task.description;
    onUpdate(task.id, { title, description });
  };

  return (
    <article ref={setNodeRef} style={style} className={clsx('task-card', compact && 'compact')}>
      <div className="spread" {...attributes} {...listeners}>
        <strong>{task.title}</strong>
        <span className="badge">drag</span>
      </div>

      {task.description ? <p className="muted" style={{ marginTop: 8 }}>{task.description}</p> : null}

      <div className="row" style={{ marginTop: 10 }}>
        <select
          className="select"
          value={task.category}
          onChange={(e) => onUpdate(task.id, { category: e.target.value })}
        >
          {taskCategories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <select
          className="select"
          value={task.eisenhowerTag || 'none'}
          onChange={(e) => onUpdate(task.id, { eisenhowerTag: e.target.value })}
        >
          {eisenhowerOptions.map((tag) => (
            <option key={tag.key} value={tag.key}>
              {tag.label}
            </option>
          ))}
        </select>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn secondary" onClick={editTask}>Editar</button>
        <button className="btn danger" onClick={() => onDelete(task.id)}>Eliminar</button>
      </div>
    </article>
  );
}
