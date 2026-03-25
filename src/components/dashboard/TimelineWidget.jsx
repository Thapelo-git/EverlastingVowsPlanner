import { Calendar, Clock, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import moment from 'moment';

export default function TimelineWidget({ weddingDate, tasks = [] }) {
  const today = moment();
  const wedding = weddingDate ? moment(weddingDate) : null;
  const daysUntil = wedding ? wedding.diff(today, 'days') : null;

  const upcomingTasks = tasks
    .filter(t => t.due_date && t.column !== 'done')
    .sort((a, b) => moment(a.due_date).diff(moment(b.due_date)))
    .slice(0, 4);

  const overdueTasks = tasks.filter(
    t => t.due_date && moment(t.due_date).isBefore(today, 'day') && t.column !== 'done'
  );

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Calendar className="h-5 w-5 text-pink-600" />
          </div>
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown */}
        {wedding && (
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-4 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm opacity-90">Days Until Wedding</span>
            </div>
            <p className="text-4xl font-bold">
              {daysUntil > 0 ? daysUntil : daysUntil === 0 ? "Today!" : "Passed"}
            </p>
            <p className="text-xs opacity-75 mt-1">{wedding.format('MMMM D, YYYY')}</p>
          </div>
        )}

        {/* Overdue Warning */}
        {overdueTasks.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
            <p className="text-sm font-medium text-rose-700">
              ⚠️ {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Upcoming Tasks */}
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">Upcoming Deadlines</h4>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming deadlines</p>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-slate-100">
                  <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                    <p className="text-xs text-slate-400">{moment(task.due_date).format('MMM D')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}