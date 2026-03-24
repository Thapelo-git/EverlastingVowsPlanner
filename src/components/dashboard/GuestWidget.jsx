import { UserCheck, UserX, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function GuestWidget({ guests = [], expectedCount = 0 }) {
  const attending = guests.filter(g => g.rsvp_status === 'attending').length;
  const declined = guests.filter(g => g.rsvp_status === 'declined').length;
  const pending = guests.filter(g => g.rsvp_status === 'pending' || g.rsvp_status === 'invited' || g.rsvp_status === 'maybe').length;
  
  const plusOnes = guests.filter(g => g.plus_one && g.rsvp_status === 'attending').length;
  const totalAttending = attending + plusOnes;
  
  const responseRate = guests.length > 0 
    ? ((attending + declined) / guests.length) * 100 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          Guest List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white text-center">
          <p className="text-3xl font-bold">{totalAttending}</p>
          <p className="text-sm opacity-90">Confirmed Guests</p>
          {plusOnes > 0 && (
            <p className="text-xs opacity-75 mt-1">({attending} invited + {plusOnes} plus ones)</p>
          )}
        </div>

        {/* Response Rate */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Response Rate</span>
            <span className="font-medium text-slate-700">{responseRate.toFixed(0)}%</span>
          </div>
          <Progress value={responseRate} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
            <UserCheck className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-600">{attending}</p>
            <p className="text-[10px] text-emerald-600">Attending</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-2.5 text-center">
            <UserX className="h-4 w-4 text-rose-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-rose-600">{declined}</p>
            <p className="text-[10px] text-rose-600">Declined</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-2.5 text-center">
            <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-600">{pending}</p>
            <p className="text-[10px] text-amber-600">Pending</p>
          </div>
        </div>

        {/* Invited Count */}
        <div className="text-center text-sm text-slate-500">
          {guests.length} invited / {expectedCount || '?'} expected
        </div>
      </CardContent>
    </Card>
  );
}