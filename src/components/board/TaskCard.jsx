import { useState } from 'react';
import { Calendar, User, Paperclip, MessageSquare, MoreHorizontal, GripVertical } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import moment from 'moment';

const priorityColors = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const roleColors = {
  planner: 'bg-violet-100 text-violet-700',
  bride: 'bg-pink-100 text-pink-700',
  groom: 'bg-blue-100 text-blue-700',
  vendor: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function TaskCard({ task, onEdit, onDelete, onView, commentCount = 0, isDragging }) {
  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment(), 'day');
  const isDueSoon = task.due_date && moment(task.due_date).isBetween(moment(), moment().add(3, 'days'), 'day', '[]');

  return (
    <div
      className={`group bg-white rounded-xl border border-slate-200/80 p-4 cursor-pointer 
        transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300
        ${isDragging ? 'shadow-2xl shadow-slate-300/50 rotate-2 scale-105' : ''}
      `}
      onClick={() => onView(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-slate-800 text-sm leading-tight flex-1 line-clamp-2">
          {task.title}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1"
            >
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              className="text-rose-600 focus:text-rose-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.priority && (
          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
        )}
        {task.assigned_role && (
          <Badge className={`text-[10px] px-2 py-0.5 font-medium ${roleColors[task.assigned_role]} border-0`}>
            {task.assigned_role}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500' : isDueSoon ? 'text-amber-500' : ''}`}>
              <Calendar className="h-3 w-3" />
              <span>{moment(task.due_date).format('MMM D')}</span>
            </div>
          )}
          {task.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[60px]">{task.assigned_to}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.attachments?.length > 0 && (
            <div className="flex items-center gap-0.5">
              <Paperclip className="h-3 w-3" />
              <span>{task.attachments.length}</span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              <span>{commentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}