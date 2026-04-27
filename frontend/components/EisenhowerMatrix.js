'use client';

import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

const quadrants = [
  { key: 'do', title: 'Urgente + Importante' },
  { key: 'schedule', title: 'No urgente + Importante' },
  { key: 'delegate', title: 'Urgente + No importante' },
  { key: 'eliminate', title: 'No urgente + No importante' }
];

export function EisenhowerMatrix({ tasks, onDeleteTask, onUpdateTask }) {
  return (
    <DndContext>
      <div className="matrix">
        {quadrants.map((quadrant) => {
          const items = tasks.filter((task) => task.eisenhowerTag === quadrant.key);

          return (
            <section key={quadrant.key} className="quadrant">
              <div className="spread" style={{ marginBottom: 8 }}>
                <strong>{quadrant.title}</strong>
                <span className="badge">{items.length}</span>
              </div>

              <SortableContext items={items.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                {items.map((task) => (
                  <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onUpdate={onUpdateTask} compact />
                ))}
              </SortableContext>
            </section>
          );
        })}
      </div>
    </DndContext>
  );
}
