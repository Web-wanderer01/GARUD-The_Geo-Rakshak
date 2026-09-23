import React, { useState, useContext } from 'react';
import { Send, Package, Navigation, Loader2 } from 'lucide-react';
import { LiveDataContext } from '../../contexts/LiveDataContext';

export default function ManualDispatchForm() {
  const { dispatchFleet } = useContext(LiveDataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    cargo: '',
    category: 'medicine',
    origin: '',
    destination: '',
    transportMode: 'truck'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      let prefix = 'TRK-';
      let spd = 50;
      if (formData.transportMode === 'helicopter') {
        prefix = 'HELI-';
        spd = 220;
      } else if (formData.transportMode === 'drone') {
        prefix = 'DRN-';
        spd = 120;
      }

      dispatchFleet({
        id: prefix + Math.floor(Math.random() * 900 + 100),
        category: formData.category,
        cargo: formData.cargo,
        origin: formData.origin,
        destination: formData.destination,
        transportMode: formData.transportMode,
        status: 'on-time',
        eta: 'Calculating...',
        lat: 26.14 + (Math.random() * 1.5 - 0.75), // Randomize slightly around NER
        lng: 91.73 + (Math.random() * 2 - 1),
        speed: spd,
        delayReason: null,
        routeHistory: [], // Will be generated if needed
        route: formData.transportMode === 'truck' ? 'Dispatched Route' : 'Direct Flight Path'
      });
      
      setIsSubmitting(false);
      setSuccessMsg('Logistics Dispatched Successfully!');
      setFormData({ cargo: '', category: 'medicine', origin: '', destination: '', transportMode: 'truck' });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manual Logistics Dispatch</h2>
          <p className="text-sm text-slate-500">Deploy resources to affected zones</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Cargo Details</label>
          <input 
            required 
            type="text" 
            placeholder="e.g. 500 Blankets & Rations" 
            value={formData.cargo}
            onChange={(e) => setFormData({...formData, cargo: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Resource Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="medicine">Medicine & First-Aid</option>
              <option value="food">Food & Water</option>
              <option value="construction">Construction & Shelter</option>
              <option value="agriculture">Agricultural Support</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Transport Mode</label>
            <select 
              value={formData.transportMode}
              onChange={(e) => setFormData({...formData, transportMode: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="truck">Heavy Truck (Road)</option>
              <option value="helicopter">NDRF Helicopter (Air)</option>
              <option value="drone">Recon/Supply Drone (Air)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Origin (Depot)</label>
            <input 
              required 
              type="text" 
              placeholder="Guwahati HQ" 
              value={formData.origin}
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Destination</label>
            <input 
              required 
              type="text" 
              placeholder="Dima Hasao" 
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isSubmitting ? 'Dispatching...' : 'Confirm Dispatch'}
        </button>
      </form>
    </div>
  );
}
