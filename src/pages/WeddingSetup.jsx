import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function WeddingSetup() {
  const navigate = useNavigate();
  const [existingWedding, setExistingWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    couple_names: '',
    wedding_date: null,
    total_budget: '',
    venue_name: '',
    theme: '',
    guest_count: '',
  });

  useEffect(() => {
    loadWedding();
  }, []);

  const loadWedding = async () => {
    try {
      const weddings = await base44.entities.Wedding.list('-created_date', 1);
      if (weddings.length > 0) {
        const wedding = weddings[0];
        setExistingWedding(wedding);
        setFormData({
          couple_names: wedding.couple_names || '',
          wedding_date: wedding.wedding_date ? new Date(wedding.wedding_date) : null,
          total_budget: wedding.total_budget || '',
          venue_name: wedding.venue_name || '',
          theme: wedding.theme || '',
          guest_count: wedding.guest_count || '',
        });
      }
    } catch (error) {
      console.error('Failed to load wedding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.couple_names.trim()) return;

    setSaving(true);
    try {
      const data = {
        couple_names: formData.couple_names,
        wedding_date: formData.wedding_date ? format(formData.wedding_date, 'yyyy-MM-dd') : null,
        total_budget: formData.total_budget ? parseFloat(formData.total_budget) : null,
        venue_name: formData.venue_name || null,
        theme: formData.theme || null,
        guest_count: formData.guest_count ? parseInt(formData.guest_count) : null,
      };

      if (existingWedding) {
        await base44.entities.Wedding.update(existingWedding.id, data);
      } else {
        await base44.entities.Wedding.create(data);
      }

      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Failed to save wedding:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Heart className="h-12 w-12 text-pink-300 animate-bounce" />
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {existingWedding ? 'Edit Wedding Details' : 'Create Your Wedding'}
            </h1>
            <p className="text-slate-500">Set up your wedding planning profile</p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-slate-200/60 shadow-xl shadow-pink-100/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              Wedding Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="couple_names">Couple Names *</Label>
                <Input
                  id="couple_names"
                  placeholder="e.g., John & Sarah"
                  value={formData.couple_names}
                  onChange={(e) => setFormData({ ...formData, couple_names: e.target.value })}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Wedding Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.wedding_date ? format(formData.wedding_date, 'PPP') : 'Pick your wedding date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.wedding_date}
                      onSelect={(date) => setFormData({ ...formData, wedding_date: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_budget">Total Budget ($)</Label>
                  <Input
                    id="total_budget"
                    type="number"
                    placeholder="e.g., 30000"
                    value={formData.total_budget}
                    onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest_count">Expected Guests</Label>
                  <Input
                    id="guest_count"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.guest_count}
                    onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue_name">Venue Name</Label>
                <Input
                  id="venue_name"
                  placeholder="e.g., The Grand Ballroom"
                  value={formData.venue_name}
                  onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Wedding Theme</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Romantic Garden, Rustic Elegance"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Link to={createPageUrl('Dashboard')} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={saving || !formData.couple_names.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {saving ? 'Saving...' : existingWedding ? 'Save Changes' : 'Create Wedding'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}