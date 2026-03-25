import { useState } from 'react';

import { Plus, DollarSign, TrendingDown, PiggyBank, AlertTriangle, CheckCircle2, Circle, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const CATEGORIES = [
  { value: 'venue', label: 'Venue', color: '#8B5CF6' },
  { value: 'catering', label: 'Catering', color: '#EC4899' },
  { value: 'photography', label: 'Photography', color: '#F59E0B' },
  { value: 'flowers', label: 'Flowers', color: '#EF4444' },
  { value: 'music', label: 'Music', color: '#3B82F6' },
  { value: 'attire', label: 'Attire', color: '#6366F1' },
  { value: 'decor', label: 'Decor', color: '#22C55E' },
  { value: 'cake', label: 'Cake', color: '#FB923C' },
  { value: 'other', label: 'Other', color: '#94A3B8' },
];

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(n || 0);

export default function WorkspaceBudgetPanel({ wedding, budgetItems, setBudgetItems }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ category: '', description: '', estimated_cost: '', actual_cost: '', paid: false });

  const totalBudget = wedding?.total_budget || 0;
  const spent = budgetItems.reduce((s, i) => s + (i.actual_cost || 0), 0);
  const estimated = budgetItems.reduce((s, i) => s + (i.estimated_cost || 0), 0);
  const remaining = totalBudget - spent;
  const pct = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const over = totalBudget > 0 && spent > totalBudget;

  const openModal = (item = null) => {
    if (item) {
      setSelected(item);
      setForm({ category: item.category || '', description: item.description || '', estimated_cost: item.estimated_cost || '', actual_cost: item.actual_cost || '', paid: item.paid || false });
    } else {
      setSelected(null);
      setForm({ category: '', description: '', estimated_cost: '', actual_cost: '', paid: false });
    }
    setModalOpen(true);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!form.category) return;
  //   setSaving(true);
  //   try {
  //     const data = {
  //       ...form,
  //       wedding_id: wedding.id,
  //       estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
  //       actual_cost: form.actual_cost ? parseFloat(form.actual_cost) : null,
  //     };
  //     if (selected) {
  //       await base44.entities.BudgetItem.update(selected.id, data);
  //       setBudgetItems(prev => prev.map(i => i.id === selected.id ? { ...i, ...data } : i));
  //     } else {
  //       const n = await base44.entities.BudgetItem.create(data);
  //       setBudgetItems(prev => [...prev, n]);
  //     }
  //     setModalOpen(false);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async (item) => {
  //   await base44.entities.BudgetItem.delete(item.id);
  //   setBudgetItems(prev => prev.filter(i => i.id !== item.id));
  // };

  // const handleTogglePaid = async (item) => {
  //   await base44.entities.BudgetItem.update(item.id, { paid: !item.paid });
  //   setBudgetItems(prev => prev.map(i => i.id === item.id ? { ...i, paid: !i.paid } : i));
  // };

  return (
    <div className="p-4 space-y-4">
      {/* Summary */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Total Budget</p>
            <p className="font-bold text-slate-800 text-base">{fmt(totalBudget)}</p>
          </div>
          <div className={`rounded-xl p-3 ${over ? 'bg-rose-50' : 'bg-emerald-50'}`}>
            <p className="text-xs text-slate-500 mb-1">Remaining</p>
            <p className={`font-bold text-base ${over ? 'text-rose-600' : 'text-emerald-600'}`}>{fmt(remaining)}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Spent</span>
            <span className={`text-xs font-semibold ${over ? 'text-rose-600' : 'text-slate-700'}`}>
              {fmt(spent)} ({Math.round(pct)}%)
            </span>
          </div>
          <Progress value={Math.min(pct, 100)} className={`h-2 ${over ? '[&>div]:bg-rose-500' : '[&>div]:bg-emerald-500'}`} />
          {over && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600">
              <AlertTriangle className="h-3 w-3" />
              {fmt(spent - totalBudget)} over budget!
            </div>
          )}
        </div>
      </div>

      {/* Add Button */}
      <Button onClick={() => openModal()} size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs h-8">
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Expense
      </Button>

      {/* Items */}
      <div className="space-y-2">
        {budgetItems.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No expenses added yet</p>
        ) : (
          budgetItems.map(item => {
            const cat = CATEGORIES.find(c => c.value === item.category) || { label: item.category, color: '#94A3B8' };
            return (
              <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
                <button onClick={() => handleTogglePaid(item)} className="shrink-0">
                  {item.paid
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    : <Circle className="h-4 w-4 text-slate-300" />
                  }
                </button>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{cat.label}</p>
                  {item.description && <p className="text-xs text-slate-400 truncate">{item.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-slate-700">
                    {item.actual_cost ? fmt(item.actual_cost) : <span className="text-slate-400">{fmt(item.estimated_cost)} est.</span>}
                  </p>
                  {item.paid && <Badge className="text-xs bg-emerald-50 text-emerald-600 border-0 h-4 px-1">Paid</Badge>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openModal(item)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(item)} className="text-rose-600"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{selected ? 'Edit Expense' : 'Add Expense'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Input className="h-8 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g., Venue deposit" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Estimated ($)</Label>
                <Input className="h-8 text-sm" type="number" value={form.estimated_cost} onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Actual ($)</Label>
                <Input className="h-8 text-sm" type="number" value={form.actual_cost} onChange={(e) => setForm({ ...form, actual_cost: e.target.value })} placeholder="0" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} className="rounded" />
              <span className="text-sm text-slate-600">Mark as Paid</span>
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={saving || !form.category}>{saving ? 'Saving...' : selected ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}