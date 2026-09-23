import { PackageOpen, Activity, Droplet, Flame } from 'lucide-react';
import { supplyGaps } from '../../data/logistics';

export default function SupplyChainGaps() {
  const getProgressColor = (value) => {
    if (value > 50) return 'bg-green-500';
    if (value > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
          <PackageOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Supply Chain Gaps</h2>
          <p className="text-sm text-slate-500">Resource levels in isolated districts</p>
        </div>
      </div>

      <div className="space-y-6">
        {supplyGaps.map((gap, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <h3 className="font-semibold text-slate-700 mb-3">{gap.district}</h3>
            
            <div className="space-y-3">
              {/* Medicine */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Medicine</span>
                  <span>{gap.medicine}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getProgressColor(gap.medicine)}`} style={{ width: `${gap.medicine}%` }}></div>
                </div>
              </div>

              {/* Food & Ration */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Droplet className="w-3 h-3" /> Food & Water</span>
                  <span>{gap.food}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getProgressColor(gap.food)}`} style={{ width: `${gap.food}%` }}></div>
                </div>
              </div>

              {/* Fuel */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> Fuel Reserves</span>
                  <span>{gap.fuel}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getProgressColor(gap.fuel)}`} style={{ width: `${gap.fuel}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
