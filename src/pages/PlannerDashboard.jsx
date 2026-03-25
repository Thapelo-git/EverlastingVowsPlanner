import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { 
  Heart, Plus, Users, Calendar,
  LayoutGrid, ChevronRight, Trash2, MoreHorizontal, Copy, ExternalLink, Mail, Check, Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar as CalendarPicker } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format } from 'date-fns';
import moment from 'moment';    

export default function PlannerDashboard() {
  const navigate = useNavigate();
  const [weddings, setWeddings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inviteModal, setInviteModal] = useState({ open: false, wedding: null });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    couple_names: '',
    wedding_date: null,
    total_budget: '',
    venue_name: '',
    theme: '',
    guest_count: '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const loadData = async () => {};

  const handleCreate = async (e) => { 
    e.preventDefault(); 
    setModalOpen(false);
  };

  const handleDelete = async (wedding) => {};

  const getWeddingStats = (weddingId) => ({ total: 0, done: 0 });

  const openInviteModal = (wedding) => {
    setInviteModal({ open: true, wedding });
    setInviteEmail('');
    setInviteLink('');
    setCopied(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteModal.wedding) return;
    setInviting(true);
    try {
      
      const link = `${window.location.origin}/Workspace?weddingId=${inviteModal.wedding.id}`;
      setInviteLink(link);
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDaysUntil = (date) => {
    if (!date) return null;
    const days = moment(date).diff(moment(), 'days');
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">WeddingPro</h1>
            <p className="text-slate-400 text-xs">Planner Dashboard</p>
          </div>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/30 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Wedding
        </Button>
      </div>

      <div className="px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">Your Weddings</h2>
          <p className="text-slate-400">{weddings.length} active project{weddings.length !== 1 ? 's' : ''}</p>
        </div>

        {weddings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No weddings yet</h3>
            <p className="text-slate-400 mb-6">Create your first wedding project to get started</p>
            <Button onClick={() => setModalOpen(true)} className="bg-gradient-to-r from-pink-500 to-rose-500">
              <Plus className="h-4 w-4 mr-2" />
              Create First Wedding
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {weddings.map(wedding => {
              const stats = getWeddingStats(wedding.id);
              const daysUntil = getDaysUntil(wedding.wedding_date);
              const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

              return (
                <Card key={wedding.id} className="bg-white/10 border-white/10 hover:bg-white/15 transition-all group">
                  <CardContent className="p-0">
                    {/* Card Header */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{wedding.couple_names}</h3>
                            {wedding.venue_name && (
                              <p className="text-xs text-slate-400">{wedding.venue_name}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/Workspace?weddingId=${wedding.id}`)}>
                              <ExternalLink className="h-4 w-4 mr-2" /> Open Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openInviteModal(wedding)}>
                              <Users className="h-4 w-4 mr-2" /> Invite Couple
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(wedding)} className="text-rose-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/10 rounded-lg p-2.5 text-center">
                          <p className="text-white font-bold text-lg leading-none">{stats.total}</p>
                          <p className="text-slate-400 text-xs mt-1">Tasks</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2.5 text-center">
                          <p className="text-emerald-400 font-bold text-lg leading-none">{stats.done}</p>
                          <p className="text-slate-400 text-xs mt-1">Done</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2.5 text-center">
                          {daysUntil !== null ? (
                            <>
                              <p className={`font-bold text-lg leading-none ${daysUntil < 30 ? 'text-amber-400' : 'text-white'}`}>
                                {daysUntil < 0 ? '✓' : daysUntil}
                              </p>
                              <p className="text-slate-400 text-xs mt-1">{daysUntil < 0 ? 'Done' : 'Days'}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-slate-400 font-bold text-lg leading-none">—</p>
                              <p className="text-slate-400 text-xs mt-1">Date</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className="text-xs text-slate-300 font-medium">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {wedding.wedding_date && (
                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {moment(wedding.wedding_date).format('MMMM D, YYYY')}
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-white/10 px-5 py-3">
                      <Link to={`/Workspace?weddingId=${wedding.id}`}>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 text-sm h-9">
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Open Planning Board
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add New Card */}
            <button
              onClick={() => setModalOpen(true)}
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-pink-400/50 hover:bg-white/5 transition-all group min-h-[200px] flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-white/10 group-hover:bg-pink-500/20 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-pink-400 transition-colors" />
              </div>
              <p className="text-slate-400 group-hover:text-slate-300 font-medium transition-colors">Add New Wedding</p>
            </button>
          </div>
        )}
      </div>

      {/* Invite Couple Modal */}
      <Dialog open={inviteModal.open} onOpenChange={(open) => setInviteModal(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-pink-500" />
              Invite Couple
              {inviteModal.wedding && (
                <span className="text-slate-500 font-normal text-sm">— {inviteModal.wedding.couple_names}</span>
              )}
            </DialogTitle>
          </DialogHeader>

          {!inviteLink ? (
            <form onSubmit={handleInvite} className="space-y-4">
              <p className="text-sm text-slate-500">
                Enter the couple's email address. They'll receive an invitation to join the app and will be linked directly to their wedding workspace.
              </p>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="e.g., couple@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteModal({ open: false, wedding: null })}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="bg-gradient-to-r from-pink-500 to-rose-500"
                >
                  {inviting ? 'Sending...' : (
                    <><Mail className="h-4 w-4 mr-2" /> Send Invite</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">Invite sent to {inviteEmail}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" /> Workspace Access Link
                </Label>
                <div className="flex gap-2">
                  <Input readOnly value={inviteLink} className="text-xs text-slate-600 bg-slate-50" />
                  <Button type="button" variant="outline" onClick={handleCopyLink} className="flex-shrink-0">
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-400">Share this link with the couple — they'll land directly on their planning board after logging in.</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setInviteModal({ open: false, wedding: null })}>Done</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Wedding Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Create New Wedding
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Couple Names *</Label>
              <Input
                placeholder="e.g., John & Sarah"
                value={formData.couple_names}
                onChange={(e) => setFormData({ ...formData, couple_names: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.wedding_date ? format(formData.wedding_date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={formData.wedding_date}
                    onSelect={(d) => setFormData({ ...formData, wedding_date: d })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Budget ($)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 30000"
                  value={formData.total_budget}
                  onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Guest Count</Label>
                <Input
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.guest_count}
                  onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Venue Name</Label>
              <Input
                placeholder="e.g., The Grand Ballroom"
                value={formData.venue_name}
                onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                disabled={saving || !formData.couple_names.trim()}
                className="bg-gradient-to-r from-pink-500 to-rose-500"
              >
                {saving ? 'Creating...' : 'Create & Open Board'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}