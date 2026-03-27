import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { DragDropContext } from '@hello-pangea/dnd';
import {
  Heart, Plus, Search, LayoutGrid, DollarSign, Users, UserCheck,
  Calendar, ChevronLeft, ChevronRight, X, Settings, ArrowLeft,
  TrendingDown, PiggyBank, CheckCircle2, Circle, Phone, Mail,
  Globe, FileText, MoreHorizontal, Pencil, Trash2, AlertTriangle,
  Clock, UserX, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import BoardColumn from '../components/board/BoardColumn';
import TaskFormModal from '../components/board/TaskFormModal';
import TaskDetailModal from '../components/board/TaskDetailModal';
import WorkspaceBudgetPanel from '../components/workspace/WorkspaceBudgetPanel';
import WorkspaceVendorPanel from '../components/workspace/WorkspaceVendorPanel';
import WorkspaceGuestPanel from '../components/workspace/WorkspaceGuestPanel';
import WorkspaceTimelinePanel from '../components/workspace/WorkspaceTimelinePanel';
import moment from 'moment';

const COLUMNS = ['budget', 'venue', 'vendors', 'guests', 'decor', 'timeline', 'done'];

const SIDEBAR_TABS = [
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'vendors', label: 'Vendors', icon: Users },
  { id: 'guests', label: 'Guests', icon: UserCheck },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
];

export default function Workspace() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const weddingId = urlParams.get('weddingId');

  const [wedding, setWedding] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('budget');

  // Modals
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultColumn, setDefaultColumn] = useState('budget');

  useEffect(() => {
    loadData();
  }, [weddingId]);

  const loadData = async () => {
    try {
      let activeWedding;
      if (weddingId) {
        const mockData = window.localStorage.getItem('mock_wedding_' + weddingId);
        if (mockData) {
          activeWedding = JSON.parse(mockData);
        } else {
          // Fallback if base44 is used
          try {
            const allWeddings = await base44.entities.Wedding.list('-created_date', 50);
            activeWedding = allWeddings.find(w => w.id === weddingId) || allWeddings[0];
          } catch(e) {}
        }
      }

      if (!activeWedding) {
        setLoading(false);
        return;
      }

      setWedding(activeWedding);

      // Using mock local storage data for related entities
      const allTasks = JSON.parse(window.localStorage.getItem('mock_tasks_' + activeWedding.id) || '[]');
      const allComments = JSON.parse(window.localStorage.getItem('mock_comments_' + activeWedding.id) || '[]');
      const allBudget = JSON.parse(window.localStorage.getItem('mock_budget_' + activeWedding.id) || '[]');
      const allVendors = JSON.parse(window.localStorage.getItem('mock_vendors_' + activeWedding.id) || '[]');
      const allGuests = JSON.parse(window.localStorage.getItem('mock_guests_' + activeWedding.id) || '[]');

      const wTasks = allTasks.filter(t => t.wedding_id === activeWedding.id);
      const taskIds = new Set(wTasks.map(t => t.id));

      setTasks(wTasks);
      setComments(allComments.filter(c => taskIds.has(c.task_id)));
      setBudgetItems(allBudget.filter(b => b.wedding_id === activeWedding.id));
      setVendors(allVendors.filter(v => v.wedding_id === activeWedding.id));
      setGuests(allGuests.filter(g => g.wedding_id === activeWedding.id));
    } finally {
      setLoading(false);
    }
  };

  const getTasksByColumn = (columnId) => {
    let filtered = tasks.filter(t => t.column === columnId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getCommentCounts = () => {
    const counts = {};
    comments.forEach(c => { counts[c.task_id] = (counts[c.task_id] || 0) + 1; });
    return counts;
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = tasks.map(t =>
      t.id === draggableId ? { ...t, column: destination.droppableId, order: destination.index } : t
    );
    setTasks(updatedTasks);

    if (wedding) {
      window.localStorage.setItem('mock_tasks_' + wedding.id, JSON.stringify(updatedTasks));
    }
  };

  const handleAddTask = (columnId) => {
    setSelectedTask(null);
    setDefaultColumn(columnId);
    setTaskFormOpen(true);
  };

  const handleEditTask = (task) => { setSelectedTask(task); setTaskFormOpen(true); };
  const handleViewTask = (task) => { setSelectedTask(task); setTaskDetailOpen(true); };

  const handleDeleteTask = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    
    const newTasks = tasks.filter(t => t.id !== task.id);
    setTasks(newTasks);
    
    if (wedding) {
      window.localStorage.setItem('mock_tasks_' + wedding.id, JSON.stringify(newTasks));
    }
    
    const newComments = comments.filter(c => c.task_id !== task.id);
    setComments(newComments);
    if (wedding) {
      window.localStorage.setItem('mock_comments_' + wedding.id, JSON.stringify(newComments));
    }
  };

  const handleTaskSubmit = async (formData) => {
    if (selectedTask) {
      const newTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, ...formData } : t);
      setTasks(newTasks);
      if (wedding) window.localStorage.setItem('mock_tasks_' + wedding.id, JSON.stringify(newTasks));
    } else {
      const newTask = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData,
        wedding_id: wedding.id,
        order: tasks.filter(t => t.column === formData.column).length,
      };
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
      if (wedding) window.localStorage.setItem('mock_tasks_' + wedding.id, JSON.stringify(newTasks));
    }
  };

  const handleTaskUpdate = async (taskId, data) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, ...data } : t);
    setTasks(newTasks);
    if (selectedTask?.id === taskId) setSelectedTask(prev => ({ ...prev, ...data }));
    if (wedding) window.localStorage.setItem('mock_tasks_' + wedding.id, JSON.stringify(newTasks));
  };

  const handleAddComment = async (commentData) => {
    const newComment = { id: Math.random().toString(), ...commentData };
    const newComments = [...comments, newComment];
    setComments(newComments);
    if (wedding) window.localStorage.setItem('mock_comments_' + wedding.id, JSON.stringify(newComments));
  };

  const handleDeleteComment = async (commentId) => {
    const newComments = comments.filter(c => c.id !== commentId);
    setComments(newComments);
    if (wedding) window.localStorage.setItem('mock_comments_' + wedding.id, JSON.stringify(newComments));
  };

  const openTab = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(true);
  };

  const daysUntil = wedding?.wedding_date ? moment(wedding.wedding_date).diff(moment(), 'days') : null;
  const completedTasks = tasks.filter(t => t.column === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const totalBudget = wedding?.total_budget || 0;
  const spent = budgetItems.reduce((s, i) => s + (i.actual_cost || 0), 0);
  const remaining = totalBudget - spent;
  const overBudget = totalBudget > 0 && spent > totalBudget;

  if (loading) {
    return (
      <div className="h-screen bg-slate-100 flex flex-col">
        <Skeleton className="h-14 w-full rounded-none" />
        <div className="flex gap-4 p-6 overflow-x-auto">
          {COLUMNS.map(c => <Skeleton key={c} className="min-w-[280px] h-[600px] rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Wedding Found</h2>
          <p className="text-slate-500 mb-6">Go back to your dashboard to select or create a wedding.</p>
          <Link to="/PlannerDashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const commentCounts = getCommentCounts();

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/PlannerDashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm leading-none">{wedding.couple_names}</h1>
              {wedding.wedding_date && (
                <p className="text-xs text-slate-400">
                  {daysUntil !== null && daysUntil >= 0 ? `${daysUntil} days to go` : moment(wedding.wedding_date).format('MMM D, YYYY')}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-slate-600 font-medium">{progressPercent}% done</span>
            </div>
            {overBudget && (
              <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1.5 text-xs text-rose-600">
                <AlertTriangle className="h-3 w-3" />
                Over budget
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm w-48"
            />
          </div>

          {/* Sidebar Tab Buttons */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            {SIDEBAR_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => openTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  sidebarOpen && activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={() => handleAddTask('budget')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Content: Board + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 min-w-max h-full">
              {COLUMNS.map(columnId => (
                <BoardColumn
                  key={columnId}
                  columnId={columnId}
                  tasks={getTasksByColumn(columnId)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onViewTask={handleViewTask}
                  commentCounts={commentCounts}
                />
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Right Sidebar */}
        {sidebarOpen && (
          <div className="w-80 xl:w-96 bg-white border-l border-slate-200 flex flex-col overflow-hidden shrink-0">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex gap-1">
                {SIDEBAR_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'budget' && (
                <WorkspaceBudgetPanel
                  wedding={wedding}
                  budgetItems={budgetItems}
                  setBudgetItems={setBudgetItems}
                />
              )}
              {activeTab === 'vendors' && (
                <WorkspaceVendorPanel
                  wedding={wedding}
                  vendors={vendors}
                  setVendors={setVendors}
                />
              )}
              {activeTab === 'guests' && (
                <WorkspaceGuestPanel
                  wedding={wedding}
                  guests={guests}
                  setGuests={setGuests}
                />
              )}
              {activeTab === 'timeline' && (
                <WorkspaceTimelinePanel
                  wedding={wedding}
                  tasks={tasks}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskFormModal
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        defaultColumn={defaultColumn}
      />
      <TaskDetailModal
        open={taskDetailOpen}
        onClose={() => setTaskDetailOpen(false)}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        comments={comments.filter(c => c.task_id === selectedTask?.id)}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}