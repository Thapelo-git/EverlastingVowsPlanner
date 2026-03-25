import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import { 
  ArrowLeft, Plus, Search, UserCheck, UserX, Clock, Users,
  MoreHorizontal, Pencil, Trash2, Mail, Phone, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';

const groups = [
  { value: 'bride_family', label: "Bride's Family" },
  { value: 'groom_family', label: "Groom's Family" },
  { value: 'bride_friends', label: "Bride's Friends" },
  { value: 'groom_friends', label: "Groom's Friends" },
  { value: 'mutual', label: 'Mutual Friends' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
];

const rsvpStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-600', icon: Clock },
  { value: 'invited', label: 'Invited', color: 'bg-blue-100 text-blue-600', icon: Mail },
  { value: 'attending', label: 'Attending', color: 'bg-emerald-100 text-emerald-600', icon: UserCheck },
  { value: 'declined', label: 'Declined', color: 'bg-rose-100 text-rose-600', icon: UserX },
  { value: 'maybe', label: 'Maybe', color: 'bg-amber-100 text-amber-600', icon: Clock },
];

export default function Guests() {
  const [wedding, setWedding] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    group: '',
    rsvp_status: 'pending',
    plus_one: false,
    plus_one_name: '',
    dietary_restrictions: '',
    table_number: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   try {
  //     const [weddings, allGuests] = await Promise.all([
  //       base44.entities.Wedding.list('-created_date', 1),
  //       base44.entities.Guest.list('name', 1000),
  //     ]);

  //     const activeWedding = weddings[0];
  //     setWedding(activeWedding);

  //     if (activeWedding) {
  //       setGuests(allGuests.filter(g => g.wedding_id === activeWedding.id));
  //     }
  //   } catch (error) {
  //     console.error('Failed to load data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchesStatus = filterStatus === 'all' || g.rsvp_status === filterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  });

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.rsvp_status === 'attending').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => g.rsvp_status === 'pending' || g.rsvp_status === 'invited' || g.rsvp_status === 'maybe').length,
    plusOnes: guests.filter(g => g.plus_one && g.rsvp_status === 'attending').length,
  };

  const openModal = (guest = null) => {
    if (guest) {
      setSelectedGuest(guest);
      setFormData({
        name: guest.name || '',
        email: guest.email || '',
        phone: guest.phone || '',
        group: guest.group || '',
        rsvp_status: guest.rsvp_status || 'pending',
        plus_one: guest.plus_one || false,
        plus_one_name: guest.plus_one_name || '',
        dietary_restrictions: guest.dietary_restrictions || '',
        table_number: guest.table_number || '',
        notes: guest.notes || '',
      });
    } else {
      setSelectedGuest(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        group: '',
        rsvp_status: 'pending',
        plus_one: false,
        plus_one_name: '',
        dietary_restrictions: '',
        table_number: '',
        notes: '',
      });
    }
    setModalOpen(true);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.name.trim()) return;

  //   setSaving(true);
  //   try {
  //     const data = {
  //       ...formData,
  //       wedding_id: wedding.id,
  //       table_number: formData.table_number ? parseInt(formData.table_number) : null,
  //     };

  //     if (selectedGuest) {
  //       await base44.entities.Guest.update(selectedGuest.id, data);
  //       setGuests(prev => prev.map(g => g.id === selectedGuest.id ? { ...g, ...data } : g));
  //     } else {
  //       const newGuest = await base44.entities.Guest.create(data);
  //       setGuests(prev => [...prev, newGuest].sort((a, b) => a.name.localeCompare(b.name)));
  //     }

  //     setModalOpen(false);
  //   } catch (error) {
  //     console.error('Failed to save guest:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async (guest) => {
  //   if (!window.confirm('Are you sure you want to remove this guest?')) return;
    
  //   try {
  //     await base44.entities.Guest.delete(guest.id);
  //     setGuests(prev => prev.filter(g => g.id !== guest.id));
  //   } catch (error) {
  //     console.error('Failed to delete guest:', error);
  //   }
  // };

  // const handleQuickStatusChange = async (guest, newStatus) => {
  //   try {
  //     await base44.entities.Guest.update(guest.id, { rsvp_status: newStatus });
  //     setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, rsvp_status: newStatus } : g));
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //   }
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Guest List</h1>
              <p className="text-sm text-slate-500">{stats.total} guests invited</p>
            </div>
          </div>
          <Button onClick={() => openModal()} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-slate-500">Attending</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{stats.attending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <UserX className="h-4 w-4 text-rose-500" />
              <span className="text-sm text-slate-500">Declined</span>
            </div>
            <p className="text-2xl font-bold text-rose-600">{stats.declined}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-slate-500">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-slate-500">Plus Ones</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.plusOnes}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map(g => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {rsvpStatuses.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-4">No guests found</p>
              <Button onClick={() => openModal()}>Add Your First Guest</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>RSVP</TableHead>
                  <TableHead>Plus One</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map(guest => {
                  const status = rsvpStatuses.find(s => s.value === guest.rsvp_status) || rsvpStatuses[0];
                  const StatusIcon = status.icon;
                  const groupLabel = groups.find(g => g.value === guest.group)?.label || guest.group;
                  
                  return (
                    <TableRow key={guest.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openModal(guest)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-800">{guest.name}</p>
                          {guest.email && (
                            <p className="text-sm text-slate-400">{guest.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">{groupLabel}</span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={guest.rsvp_status || 'pending'}
                          onValueChange={(value) => {
                            event?.stopPropagation();
                            handleQuickStatusChange(guest, value);
                          }}
                        >
                          <SelectTrigger className={`w-32 h-8 ${status.color} border-0`} onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rsvpStatuses.map(s => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {guest.plus_one ? (
                          <span className="text-sm text-slate-600">
                            {guest.plus_one_name || 'Yes'}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {guest.table_number ? (
                          <Badge variant="outline">Table {guest.table_number}</Badge>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openModal(guest); }}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(guest); }} className="text-rose-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Guest Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Guest Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Smith"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Group</Label>
                <Select
                  value={formData.group}
                  onValueChange={(value) => setFormData({ ...formData, group: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(g => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>RSVP Status</Label>
                <Select
                  value={formData.rsvp_status}
                  onValueChange={(value) => setFormData({ ...formData, rsvp_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rsvpStatuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="plus_one"
                checked={formData.plus_one}
                onCheckedChange={(checked) => setFormData({ ...formData, plus_one: checked })}
              />
              <Label htmlFor="plus_one">Has Plus One</Label>
            </div>

            {formData.plus_one && (
              <div className="space-y-2">
                <Label>Plus One Name</Label>
                <Input
                  value={formData.plus_one_name}
                  onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                  placeholder="Guest's name"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Table Number</Label>
                <Input
                  type="number"
                  value={formData.table_number}
                  onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <Input
                  value={formData.dietary_restrictions}
                  onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                  placeholder="e.g., Vegetarian"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !formData.name.trim()}>
                {saving ? 'Saving...' : selectedGuest ? 'Update Guest' : 'Add Guest'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}