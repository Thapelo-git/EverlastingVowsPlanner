import { Users, Phone, Mail, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-600', icon: Clock },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-600', icon: Clock },
  signed: { label: 'Signed', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
  completed: { label: 'Done', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
};

const paymentConfig = {
  not_started: { label: 'Not Paid', color: 'bg-slate-100 text-slate-600' },
  deposit_paid: { label: 'Deposit', color: 'bg-amber-100 text-amber-600' },
  partial: { label: 'Partial', color: 'bg-blue-100 text-blue-600' },
  paid_in_full: { label: 'Paid', color: 'bg-emerald-100 text-emerald-600' },
};

export default function VendorWidget({ vendors = [] }) {
  const activeVendors = vendors.slice(0, 4);
  const signedCount = vendors.filter(v => v.contract_status === 'signed' || v.contract_status === 'completed').length;
  const pendingCount = vendors.filter(v => v.contract_status === 'pending' || v.contract_status === 'sent').length;

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          Vendors
          <Badge variant="outline" className="ml-auto text-xs">
            {vendors.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-emerald-600">{signedCount}</p>
            <p className="text-xs text-emerald-600">Confirmed</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
        </div>

        {/* Vendor List */}
        {activeVendors.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No vendors added yet</p>
        ) : (
          <div className="space-y-2">
            {activeVendors.map((vendor) => {
              const status = statusConfig[vendor.contract_status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={vendor.id} className="bg-white rounded-lg p-3 border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-slate-800">{vendor.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{vendor.category}</p>
                    </div>
                    <Badge className={`text-[10px] ${status.color} border-0`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {vendor.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{vendor.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}