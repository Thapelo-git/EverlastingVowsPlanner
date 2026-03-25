import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import TaskCard from './TaskCard';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const columnConfig = {
  budget: { label: 'Budget', emoji: '💰', color: 'from-emerald-500 to-emerald-600' },
  venue: { label: 'Venue', emoji: '🏛️', color: 'from-violet-500 to-violet-600' },
  vendors: { label: 'Vendors', emoji: '🤝', color: 'from-orange-500 to-orange-600' },
  guests: { label: 'Guests', emoji: '👥', color: 'from-blue-500 to-blue-600' },
  decor: { label: 'Decor', emoji: '🎨', color: 'from-pink-500 to-pink-600' },
  timeline: { label: 'Timeline', emoji: '📅', color: 'from-amber-500 to-amber-600' },
  done: { label: 'Done', emoji: '✅', color: 'from-slate-500 to-slate-600' },
};

export default function BoardColumn({ 
  columnId, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onViewTask,
  commentCounts 
}) {
  const config = columnConfig[columnId] || { label: columnId, emoji: '📋', color: 'from-slate-500 to-slate-600' };

  return (
    <div className="flex flex-col bg-slate-50/80 rounded-2xl min-w-[300px] w-[300px] max-h-full">
      {/* Column Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-sm shadow-sm`}>
              {config.emoji}
            </div>
            <h3 className="font-semibold text-slate-800">{config.label}</h3>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-slate-100/80' : ''}`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onView={onViewTask}
                      commentCount={commentCounts[task.id] || 0}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Button */}
      <div className="p-3 pt-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 hover:text-slate-700 hover:bg-white/80 rounded-xl h-10"
          onClick={() => onAddTask(columnId)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add task
        </Button>
      </div>
    </div>
  );
}