'use client';

import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { taskCategories } from '../lib/api';

function Column({ category, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: category.key, data: { type: 'column', category: category.key } });

  return (
    <section ref={setNodeRef} className="column" style={{ outline: isOver ? '1px solid #7c9cff' : 'none' }}>
      <div className="spread" style={{ marginBottom: 8 }}>
        <strong>{category.label}</strong>
      </div>
      {children}
    </section>
  );
}

export function KanbanBoard({ tasks, onMoveTask, onDeleteTask, onUpdateTask }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getTaskById = (id) => tasks.find((task) => task.id === id);

  const resolveCategory = (overId) => {
    if (!overId) return null;
    if (taskCategories.some((c) => c.key === overId)) return overId;
    const overTask = getTaskById(overId);
    return overTask?.category || null;
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const activeTask = getTaskById(active.id);
    if (!activeTask) return;

    const targetCategory = resolveCategory(over.id);
    if (!targetCategory || targetCategory === activeTask.category) return;

    onMoveTask(activeTask.id, targetCategory);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="columns">
        {taskCategories.map((category) => {
          const items = tasks.filter((task) => task.category === category.key);
          return (
            <Column key={category.key} category={category}>
              <SortableContext items={items.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                {items.map((task) => (
                  <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onUpdate={onUpdateTask} />
                ))}
              </SortableContext>
            </Column>
          );
        })}
      </div>
    </DndContext>
  );
}
