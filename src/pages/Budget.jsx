import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Plus, DollarSign, PiggyBank, TrendingUp, TrendingDown,
  MoreHorizontal, Pencil, Trash2, CheckCircle2, Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const categories = [
  { value: 'venue', label: 'Venue', color: '#8B5CF6' },
  { value: 'catering', label: 'Catering', color: '#EC4899' },
  { value: 'photography', label: 'Photography', color: '#F59E0B' },
  { value: 'videography', label: 'Videography', color: '#10B981' },
  { value: 'flowers', label: 'Flowers', color: '#EF4444' },
  { value: 'music', label: 'Music', color: '#3B82F6' },
  { value: 'attire', label: 'Attire', color: '#6366F1' },
  { value: 'beauty', label: 'Beauty', color: '#F472B6' },
  { value: 'stationery', label: 'Stationery', color: '#14B8A6' },
  { value: 'transportation', label: 'Transportation', color: '#78716C' },
  { value: 'favors', label: 'Favors', color: '#A855F7' },
  { value: 'decor', label: 'Decor', color: '#22C55E' },
  { value: 'cake', label: 'Cake', color: '#FB923C' },
  { value: 'officiant', label: 'Officiant', color: '#64748B' },
  { value: 'other', label: 'Other', color: '#94A3B8' },
];

export default function Budget() {
  const [wedding, setWedding] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    estimated_cost: '',
    actual_cost: '',
    paid: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [weddings, allItems] = await Promise.all([
        base44.entities.Wedding.list('-created_date', 1),
        base44.entities.BudgetItem.list('category', 200),
      ]);

      const activeWedding = weddings[0];
      setWedding(activeWedding);

      if (activeWedding) {
        setBudgetItems(allItems.filter(i => i.wedding_id === activeWedding.id));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = wedding?.total_budget || 0;
  const estimated = budgetItems.reduce((sum, i) => sum + (i.estimated_cost || 0), 0);
  const actual = budgetItems.reduce((sum, i) => sum + (i.actual_cost || 0), 0);
  const remaining = totalBudget - actual;
  const percentUsed = totalBudget > 0 ? (actual / totalBudget) * 100 : 0;
  const overBudget = actual > totalBudget && totalBudget > 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Group items by category for chart
  const chartData = categories.map(cat => {
    const items = budgetItems.filter(i => i.category === cat.value);
    const total = items.reduce((sum, i) => sum + (i.actual_cost || i.estimated_cost || 0), 0);
    return {
      name: cat.label,
      value: total,
      color: cat.color,
    };
  }).filter(d => d.value > 0);

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        category: item.category || '',
        description: item.description || '',
        estimated_cost: item.estimated_cost || '',
        actual_cost: item.actual_cost || '',
        paid: item.paid || false,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        category: '',
        description: '',
        estimated_cost: '',
        actual_cost: '',
        paid: false,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return;

    setSaving(true);
    try {
      const data = {
        ...formData,
        wedding_id: wedding.id,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : null,
      };

      if (selectedItem) {
        await base44.entities.BudgetItem.update(selectedItem.id, data);
        setBudgetItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, ...data } : i));
      } else {
        const newItem = await base44.entities.BudgetItem.create(data);
        setBudgetItems(prev => [...prev, newItem]);
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save budget item:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this budget item?')) return;
    
    try {
      await base44.entities.BudgetItem.delete(item.id);
      setBudgetItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleTogglePaid = async (item) => {
    try {
      await base44.entities.BudgetItem.update(item.id, { paid: !item.paid });
      setBudgetItems(prev => prev.map(i => i.id === item.id ? { ...i, paid: !i.paid } : i));
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
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
              <h1 className="text-xl font-bold text-slate-800">Budget Tracker</h1>
              <p className="text-sm text-slate-500">Manage your wedding expenses</p>
            </div>
          </div>
          <Button onClick={() => openModal()} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                </div>
                <span className="text-sm text-slate-500">Total Budget</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-sm text-slate-500">Estimated</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(estimated)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-rose-600" />
                </div>
                <span className="text-sm text-slate-500">Spent</span>
              </div>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(actual)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500">Remaining</span>
              </div>
              <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(remaining)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">Budget Used</span>
              <span className={`text-sm font-medium ${overBudget ? 'text-rose-600' : 'text-slate-600'}`}>
                {percentUsed.toFixed(0)}%
              </span>
            </div>
            <Progress value={Math.min(percentUsed, 100)} className={`h-4 ${overBudget ? '[&>div]:bg-rose-500' : ''}`} />
            {overBudget && (
              <p className="text-sm text-rose-600 mt-2">
                ⚠️ You're {formatCurrency(actual - totalBudget)} over budget
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          {chartData.length > 0 && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          <Card className={chartData.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
            <CardHeader>
              <CardTitle className="text-base">Expense Items</CardTitle>
            </CardHeader>
            <CardContent>
              {budgetItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">No expenses added yet</p>
                  <Button onClick={() => openModal()}>Add Your First Expense</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {budgetItems.map(item => {
                    const cat = categories.find(c => c.value === item.category) || { label: item.category, color: '#94A3B8' };
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <button onClick={() => handleTogglePaid(item)}>
                          {item.paid ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300" />
                          )}
                        </button>
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700">{cat.label}</span>
                            {item.paid && (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                                Paid
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-slate-500 truncate">{item.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {item.actual_cost ? (
                            <p className="font-semibold text-slate-800">{formatCurrency(item.actual_cost)}</p>
                          ) : (
                            <p className="text-slate-400">{formatCurrency(item.estimated_cost)} est.</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openModal(item)}>
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(item)} className="text-rose-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Item Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Venue deposit"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Actual Cost ($)</Label>
                <Input
                  type="number"
                  value={formData.actual_cost}
                  onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paid"
                checked={formData.paid}
                onCheckedChange={(checked) => setFormData({ ...formData, paid: checked })}
              />
              <Label htmlFor="paid">Mark as Paid</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !formData.category}>
                {saving ? 'Saving...' : selectedItem ? 'Update' : 'Add Expense'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}