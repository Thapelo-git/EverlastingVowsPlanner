import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

import { 
  ArrowLeft, Plus, Search, Phone, Mail, Globe, FileText, 
  DollarSign, MoreHorizontal, Pencil, Trash2, CheckCircle2, Clock 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Skeleton } from '../components/ui/skeleton';

const categories = [
  { value: 'photographer', label: 'Photographer' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'florist', label: 'Florist' },
  { value: 'caterer', label: 'Caterer' },
  { value: 'dj', label: 'DJ' },
  { value: 'band', label: 'Band' },
  { value: 'cake', label: 'Cake' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'hair', label: 'Hair' },
  { value: 'officiant', label: 'Officiant' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'rentals', label: 'Rentals' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'other', label: 'Other' },
];

const contractStatuses = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-600' },
  { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-600' },
  { value: 'signed', label: 'Signed', color: 'bg-emerald-100 text-emerald-600' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-600' },
];

const paymentStatuses = [
  { value: 'not_started', label: 'Not Started', color: 'bg-slate-100 text-slate-600' },
  { value: 'deposit_paid', label: 'Deposit Paid', color: 'bg-amber-100 text-amber-600' },
  { value: 'partial', label: 'Partial', color: 'bg-blue-100 text-blue-600' },
  { value: 'paid_in_full', label: 'Paid in Full', color: 'bg-emerald-100 text-emerald-600' },
];

export default function Vendors() {
  const [wedding, setWedding] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact_name: '',
    phone: '',
    email: '',
    website: '',
    contract_status: 'pending',
    payment_status: 'not_started',
    total_cost: '',
    amount_paid: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   try {
  //     const [weddings, allVendors] = await Promise.all([
  //       base44.entities.Wedding.list('-created_date', 1),
  //       base44.entities.Vendor.list('-created_date', 100),
  //     ]);

  //     const activeWedding = weddings[0];
  //     setWedding(activeWedding);

  //     if (activeWedding) {
  //       setVendors(allVendors.filter(v => v.wedding_id === activeWedding.id));
  //     }
  //   } catch (error) {
  //     console.error('Failed to load data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (vendor = null) => {
    if (vendor) {
      setSelectedVendor(vendor);
      setFormData({
        name: vendor.name || '',
        category: vendor.category || '',
        contact_name: vendor.contact_name || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        website: vendor.website || '',
        contract_status: vendor.contract_status || 'pending',
        payment_status: vendor.payment_status || 'not_started',
        total_cost: vendor.total_cost || '',
        amount_paid: vendor.amount_paid || '',
        notes: vendor.notes || '',
      });
    } else {
      setSelectedVendor(null);
      setFormData({
        name: '',
        category: '',
        contact_name: '',
        phone: '',
        email: '',
        website: '',
        contract_status: 'pending',
        payment_status: 'not_started',
        total_cost: '',
        amount_paid: '',
        notes: '',
      });
    }
    setModalOpen(true);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.name.trim() || !formData.category) return;

  //   setSaving(true);
  //   try {
  //     const data = {
  //       ...formData,
  //       wedding_id: wedding.id,
  //       total_cost: formData.total_cost ? parseFloat(formData.total_cost) : null,
  //       amount_paid: formData.amount_paid ? parseFloat(formData.amount_paid) : null,
  //     };

  //     if (selectedVendor) {
  //       await base44.entities.Vendor.update(selectedVendor.id, data);
  //       setVendors(prev => prev.map(v => v.id === selectedVendor.id ? { ...v, ...data } : v));
  //     } else {
  //       const newVendor = await base44.entities.Vendor.create(data);
  //       setVendors(prev => [...prev, newVendor]);
  //     }

  //     setModalOpen(false);
  //   } catch (error) {
  //     console.error('Failed to save vendor:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async (vendor) => {
  //   if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    
  //   try {
  //     await base44.entities.Vendor.delete(vendor.id);
  //     setVendors(prev => prev.filter(v => v.id !== vendor.id));
  //   } catch (error) {
  //     console.error('Failed to delete vendor:', error);
  //   }
  // };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
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
              <h1 className="text-xl font-bold text-slate-800">Vendors</h1>
              <p className="text-sm text-slate-500">{vendors.length} vendors</p>
            </div>
          </div>
          <Button onClick={() => openModal()} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 mb-4">No vendors found</p>
            <Button onClick={() => openModal()}>Add Your First Vendor</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map(vendor => {
              const contractStatus = contractStatuses.find(s => s.value === vendor.contract_status) || contractStatuses[0];
              const paymentStatus = paymentStatuses.find(s => s.value === vendor.payment_status) || paymentStatuses[0];
              
              return (
                <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{vendor.name}</h3>
                        <p className="text-sm text-slate-500 capitalize">{vendor.category}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openModal(vendor)}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(vendor)} className="text-rose-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      {vendor.contact_name && (
                        <p className="text-slate-600">{vendor.contact_name}</p>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone className="h-3.5 w-3.5" />
                          <a href={`tel:${vendor.phone}`} className="hover:text-slate-700">{vendor.phone}</a>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${vendor.email}`} className="hover:text-slate-700 truncate">{vendor.email}</a>
                        </div>
                      )}
                      {vendor.website && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Globe className="h-3.5 w-3.5" />
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-slate-700 truncate">{vendor.website}</a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={`text-xs ${contractStatus.color} border-0`}>
                        <FileText className="h-3 w-3 mr-1" />
                        {contractStatus.label}
                      </Badge>
                      <Badge className={`text-xs ${paymentStatus.color} border-0`}>
                        <DollarSign className="h-3 w-3 mr-1" />
                        {paymentStatus.label}
                      </Badge>
                    </div>

                    {(vendor.total_cost || vendor.amount_paid) && (
                      <div className="bg-slate-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Cost</span>
                          <span className="font-medium">{formatCurrency(vendor.total_cost)}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-slate-500">Paid</span>
                          <span className="font-medium text-emerald-600">{formatCurrency(vendor.amount_paid)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Vendor Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedVendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Best Photography"
                  required
                />
              </div>
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
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                placeholder="e.g., John Smith"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., contact@vendor.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="e.g., https://www.vendor.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contract Status</Label>
                <Select
                  value={formData.contract_status}
                  onValueChange={(value) => setFormData({ ...formData, contract_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractStatuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Cost ($)</Label>
                <Input
                  type="number"
                  value={formData.total_cost}
                  onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
                  placeholder="e.g., 3000"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid ($)</Label>
                <Input
                  type="number"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
                  placeholder="e.g., 1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !formData.name.trim() || !formData.category}>
                {saving ? 'Saving...' : selectedVendor ? 'Update Vendor' : 'Add Vendor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}