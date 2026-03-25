import { useState } from 'react';

import { Plus, Phone, Mail, Globe, FileText, DollarSign, Pencil, Trash2, MoreHorizontal, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const CATEGORIES = [
  'photographer','videographer','florist','caterer','dj','band','cake','makeup','hair','officiant','transportation','rentals','lighting','other'
];
const CONTRACT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-600' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-600' },
  { value: 'signed', label: 'Signed', color: 'bg-emerald-100 text-emerald-600' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-600' },
];

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(n || 0);

export default function WorkspaceVendorPanel({ wedding, vendors, setVendors }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', contact_name: '', phone: '', email: '', website: '', contract_status: 'pending', payment_status: 'not_started', total_cost: '', amount_paid: '', notes: '' });

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (vendor = null) => {
    if (vendor) {
      setSelected(vendor);
      setForm({ name: vendor.name || '', category: vendor.category || '', contact_name: vendor.contact_name || '', phone: vendor.phone || '', email: vendor.email || '', website: vendor.website || '', contract_status: vendor.contract_status || 'pending', payment_status: vendor.payment_status || 'not_started', total_cost: vendor.total_cost || '', amount_paid: vendor.amount_paid || '', notes: vendor.notes || '' });
    } else {
      setSelected(null);
      setForm({ name: '', category: '', contact_name: '', phone: '', email: '', website: '', contract_status: 'pending', payment_status: 'not_started', total_cost: '', amount_paid: '', notes: '' });
    }
    setModalOpen(true);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form.name.trim() || !form.category) return;
  //   setSaving(true);
  //   try {
  //     const data = { ...form, wedding_id: wedding.id, total_cost: form.total_cost ? parseFloat(form.total_cost) : null, amount_paid: form.amount_paid ? parseFloat(form.amount_paid) : null };
  //     if (selected) {
  //       await base44.entities.Vendor.update(selected.id, data);
  //       setVendors(prev => prev.map(v => v.id === selected.id ? { ...v, ...data } : v));
  //     } else {
  //       const n = await base44.entities.Vendor.create(data);
  //       setVendors(prev => [...prev, n]);
  //     }
  //     setModalOpen(false);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async (vendor) => {
  //   if (!window.confirm('Delete this vendor?')) return;
  //   await base44.entities.Vendor.delete(vendor.id);
  //   setVendors(prev => prev.filter(v => v.id !== vendor.id));
  // };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input className="pl-8 h-8 text-xs" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => openModal()} size="sm" className="h-8 text-xs bg-orange-500 hover:bg-orange-600 shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />Add
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">{search ? 'No vendors found' : 'No vendors yet'}</p>
        ) : (
          filtered.map(vendor => {
            const cs = CONTRACT_STATUSES.find(s => s.value === vendor.contract_status) || CONTRACT_STATUSES[0];
            return (
              <div key={vendor.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{vendor.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-xs border-0 ${cs.color}`}>{cs.label}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openModal(vendor)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(vendor)} className="text-rose-600"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-0.5 text-xs text-slate-500">
                  {vendor.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{vendor.phone}</div>}
                  {vendor.email && <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{vendor.email}</div>}
                  {vendor.total_cost && (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200">
                      <span>Total: <span className="font-medium text-slate-700">{fmt(vendor.total_cost)}</span></span>
                      {vendor.amount_paid && <span className="text-emerald-600">Paid: {fmt(vendor.amount_paid)}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input className="h-8 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Vendor name" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input className="h-8 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input className="h-8 text-sm" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Contract Status</Label>
                <Select value={form.contract_status} onValueChange={(v) => setForm({ ...form, contract_status: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{CONTRACT_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Status</Label>
                <Select value={form.payment_status} onValueChange={(v) => setForm({ ...form, payment_status: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="deposit_paid">Deposit Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid_in_full">Paid in Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Total Cost ($)</Label><Input className="h-8 text-sm" type="number" value={form.total_cost} onChange={(e) => setForm({ ...form, total_cost: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Amount Paid ($)</Label><Input className="h-8 text-sm" type="number" value={form.amount_paid} onChange={(e) => setForm({ ...form, amount_paid: e.target.value })} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Notes</Label><Textarea className="text-sm" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={saving || !form.name.trim() || !form.category}>{saving ? 'Saving...' : selected ? 'Update' : 'Add Vendor'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}