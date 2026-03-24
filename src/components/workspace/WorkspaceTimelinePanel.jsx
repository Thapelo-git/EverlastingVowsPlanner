import { useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

export default function WorkspaceTimelinePanel({ wedding, tasks }) {
  const weddingDate = wedding?.wedding_date;
  const daysUntil = weddingDate ? moment(weddingDate).diff(moment(), 'days') : null;

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(t => t.due_date && t.column !== 'done')
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 20);
  }, [tasks]);

  const overdueTasks = upcomingTasks.filter(t => moment(t.due_date).isBefore(moment(), 'day'));
  const todayTasks = upcomingTasks.filter(t => moment(t.due_date).isSame(moment(), 'day'));
  const futureTasks = upcomingTasks.filter(t => moment(t.due_date).isAfter(moment(), 'day'));

  const PRIORITY_COLORS = {
    high: 'bg-rose-100 text-rose-700 border-rose-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const TaskItem = ({ task }) => {
    const isOverdue = moment(task.due_date).isBefore(moment(), 'day');
    const isToday = moment(task.due_date).isSame(moment(), 'day');

    return (
      <div className={`p-2.5 rounded-lg border ${isOverdue ? 'bg-rose-50 border-rose-200' : isToday ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink-0">
            {isOverdue ? <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> : isToday ? <Clock className="h-3.5 w-3.5 text-amber-500" /> : <Circle className="h-3.5 w-3.5 text-slate-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate">{task.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-xs ${isOverdue ? 'text-rose-600 font-medium' : isToday ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                {isToday ? 'Today' : isOverdue ? `${Math.abs(moment(task.due_date).diff(moment(), 'days'))}d overdue` : moment(task.due_date).format('MMM D')}
              </span>
              {task.priority && (
                <Badge className={`text-xs border h-4 px-1 ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low}`}>
                  {task.priority}
                </Badge>
              )}
              {task.assigned_role && (
                <span className="text-xs text-slate-400 capitalize">{task.assigned_role}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-5">
      {/* Wedding Day Countdown */}
      {weddingDate ? (
        <div className={`rounded-xl p-4 text-center ${daysUntil !== null && daysUntil >= 0 ? 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100' : 'bg-emerald-50 border border-emerald-100'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-pink-500" />
            <span className="text-sm font-semibold text-slate-700">Wedding Day</span>
          </div>
          <p className="text-slate-600 text-sm mb-2">{moment(weddingDate).format('MMMM D, YYYY')}</p>
          {daysUntil !== null && (
            <div>
              {daysUntil < 0 ? (
                <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold text-lg">Wedding Complete!</span>
                </div>
              ) : daysUntil === 0 ? (
                <p className="text-2xl font-bold text-pink-600">Today! 💒</p>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-pink-600">{daysUntil}</p>
                  <p className="text-sm text-slate-500">days to go</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No wedding date set</p>
        </div>
      )}

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
            <h3 className="text-xs font-semibold text-rose-600 uppercase tracking-wide">Overdue ({overdueTasks.length})</h3>
          </div>
          <div className="space-y-1.5">
            {overdueTasks.map(t => <TaskItem key={t.id} task={t} />)}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Due Today ({todayTasks.length})</h3>
          </div>
          <div className="space-y-1.5">
            {todayTasks.map(t => <TaskItem key={t.id} task={t} />)}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {futureTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Upcoming</h3>
          </div>
          <div className="space-y-1.5">
            {futureTasks.map(t => <TaskItem key={t.id} task={t} />)}
          </div>
        </div>
      )}

      {upcomingTasks.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No tasks with due dates yet</p>
          <p className="text-xs text-slate-300 mt-1">Add due dates to tasks on the board</p>
        </div>
      )}

      {/* Task Summary */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Overall Progress</h3>
        <div className="space-y-2">
          {['budget','venue','vendors','guests','decor','timeline'].map(col => {
            const colTasks = tasks.filter(t => t.column === col || (col !== 'done' && t.column === col));
            const allColTasks = tasks.filter(t => t.column === col);
            const done = tasks.filter(t => t.column === 'done').length;
            return null;
          })}
          {(() => {
            const cols = ['budget','venue','vendors','guests','decor','timeline','done'];
            const colLabels = { budget: 'Budget', venue: 'Venue', vendors: 'Vendors', guests: 'Guests', decor: 'Decor', timeline: 'Timeline', done: '✓ Done' };
            return cols.map(col => {
              const count = tasks.filter(t => t.column === col).length;
              if (count === 0) return null;
              return (
                <div key={col} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{colLabels[col]}</span>
                  <Badge variant="outline" className={`text-xs ${col === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600'}`}>
                    {count}
                  </Badge>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}