import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

export default function BudgetWidget({ totalBudget = 0, budgetItems = [] }) {
  const estimated = budgetItems.reduce((sum, item) => sum + (item.estimated_cost || 0), 0);
  const actual = budgetItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
  const remaining = totalBudget - actual;
  const percentUsed = totalBudget > 0 ? Math.min((actual / totalBudget) * 100, 100) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
          </div>
          Budget Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Used</span>
            <span className="font-semibold text-slate-700">{percentUsed.toFixed(0)}%</span>
          </div>
          <Progress value={percentUsed} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500">Total Budget</span>
            </div>
            <p className="text-lg font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-rose-400" />
              <span className="text-xs text-slate-500">Spent</span>
            </div>
            <p className="text-lg font-bold text-rose-600">{formatCurrency(actual)}</p>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-slate-500">Estimated</span>
            </div>
            <p className="text-lg font-bold text-amber-600">{formatCurrency(estimated)}</p>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <PiggyBank className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-500">Remaining</span>
            </div>
            <p className={`text-lg font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}