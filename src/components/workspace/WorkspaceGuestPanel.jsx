import { useState } from 'react';

import { Plus, Search, UserCheck, UserX, Clock, Users, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const RSVP_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-600' },
  { value: 'invited', label: 'Invited', color: 'bg-blue-100 text-blue-600' },
  { value: 'attending', label: 'Attending', color: 'bg-emerald-100 text-emerald-600' },
  { value: 'declined', label: 'Declined', color: 'bg-rose-100 text-rose-600' },
  { value: 'maybe', label: 'Maybe', color: 'bg-amber-100 text-amber-600' },
];

const GROUPS = [
  { value: 'bride_family', label: "Bride's Family" },
  { value: 'groom_family', label: "Groom's Family" },
  { value: 'bride_friends', label: "Bride's Friends" },
  { value: 'groom_friends', label: "Groom's Friends" },
  { value: 'mutual', label: 'Mutual' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
];

export default function WorkspaceGuestPanel({ wedding, guests, setGuests }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', group: '', rsvp_status: 'pending', plus_one: false, plus_one_name: '', dietary_restrictions: '', table_number: '', notes: '' });

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvp_status === 'attending').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => ['pending', 'invited', 'maybe'].includes(g.rsvp_status)).length,
  };

  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || g.rsvp_status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openModal = (guest = null) => {
    if (guest) {
      setSelected(guest);
      setForm({ name: guest.name || '', email: guest.email || '', phone: guest.phone || '', group: guest.group || '', rsvp_status: guest.rsvp_status || 'pending', plus_one: guest.plus_one || false, plus_one_name: guest.plus_one_name || '', dietary_restrictions: guest.dietary_restrictions || '', table_number: guest.table_number || '', notes: guest.notes || '' });
    } else {
      setSelected(null);
      setForm({ name: '', email: '', phone: '', group: '', rsvp_status: 'pending', plus_one: false, plus_one_name: '', dietary_restrictions: '', table_number: '', notes: '' });
    }
    setModalOpen(true);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form.name.trim()) return;
  //   setSaving(true);
  //   try {
  //     const data = { ...form, wedding_id: wedding.id, table_number: form.table_number ? parseInt(form.table_number) : null };
  //     if (selected) {
  //       await base44.entities.Guest.update(selected.id, data);
  //       setGuests(prev => prev.map(g => g.id === selected.id ? { ...g, ...data } : g));
  //     } else {
  //       const n = await base44.entities.Guest.create(data);
  //       setGuests(prev => [...prev, n].sort((a, b) => a.name.localeCompare(b.name)));
  //     }
  //     setModalOpen(false);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async (guest) => {
  //   if (!window.confirm('Remove this guest?')) return;
  //   await base44.entities.Guest.delete(guest.id);
  //   setGuests(prev => prev.filter(g => g.id !== guest.id));
  // };

  // const handleQuickStatus = async (guest, status) => {
  //   await base44.entities.Guest.update(guest.id, { rsvp_status: status });
  //   setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, rsvp_status: status } : g));
  // };

  return (
    <div className="p-4 space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: 'Total', value: stats.total, color: 'text-slate-800' },
          { label: 'Going', value: stats.attending, color: 'text-emerald-600' },
          { label: 'No', value: stats.declined, color: 'text-rose-600' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input className="pl-8 h-8 text-xs" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {RSVP_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => openModal()} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 shrink-0">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Guest List */}
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">{search || filterStatus !== 'all' ? 'No guests found' : 'No guests yet'}</p>
        ) : (
          filtered.map(guest => {
            const status = RSVP_STATUSES.find(s => s.value === guest.rsvp_status) || RSVP_STATUSES[0];
            return (
              <div key={guest.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 group">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">
                    {guest.name}
                    {guest.plus_one && <span className="text-slate-400 ml-1 font-normal">+1</span>}
                  </p>
                  {guest.table_number && <p className="text-xs text-slate-400">Table {guest.table_number}</p>}
                </div>
                <Select value={guest.rsvp_status || 'pending'} onValueChange={(v) => handleQuickStatus(guest, v)}>
                  <SelectTrigger className={`h-6 text-xs border-0 w-24 ${status.color}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RSVP_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openModal(guest)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(guest)} className="text-rose-600"><Trash2 className="h-3.5 w-3.5 mr-2" />Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{selected ? 'Edit Guest' : 'Add Guest'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Guest Name *</Label><Input className="h-8 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Group</Label>
                <Select value={form.group} onValueChange={(v) => setForm({ ...form, group: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{GROUPS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">RSVP Status</Label>
                <Select value={form.rsvp_status} onValueChange={(v) => setForm({ ...form, rsvp_status: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{RSVP_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input className="h-8 text-sm" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Table #</Label><Input className="h-8 text-sm" type="number" value={form.table_number} onChange={(e) => setForm({ ...form, table_number: e.target.value })} /></div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.plus_one} onChange={(e) => setForm({ ...form, plus_one: e.target.checked })} className="rounded" />
              <span className="text-sm text-slate-600">Has Plus One</span>
            </label>
            {form.plus_one && <Input className="h-8 text-sm" placeholder="Plus one name" value={form.plus_one_name} onChange={(e) => setForm({ ...form, plus_one_name: e.target.value })} />}
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={saving || !form.name.trim()}>{saving ? 'Saving...' : selected ? 'Update' : 'Add Guest'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}