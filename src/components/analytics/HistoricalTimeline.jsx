import React, { useState } from 'react';
import { historicalEvents } from '../../data/historical';
import { SEVERITY_CONFIG } from '../../data/alerts';
import { Filter, Calendar } from 'lucide-react';

export default function HistoricalTimeline() {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  
  // Dynamic year detection based on current real-world year
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const states = ['All', ...new Set(historicalEvents.map(e => e.state))].sort();
  const severities = ['All', 'critical', 'high', 'moderate', 'low'];
  
  // Extract all unique years from the data, plus 'All'
  const years = ['All', ...new Set(historicalEvents.map(e => e.date.substring(0,4)))].sort((a,b) => b.localeCompare(a));

  const filteredEvents = historicalEvents
    .filter(e => (selectedYear === 'All' ? true : e.date.startsWith(selectedYear)))
    .filter(e => (selectedState === 'All' ? true : e.state === selectedState))
    .filter(e => (selectedSeverity === 'All' ? true : e.severity === selectedSeverity))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Historical Landslide Events</h2>
          <p className="text-sm text-slate-500">Showing {filteredEvents.length} recorded events for {selectedYear === 'All' ? 'All Time' : selectedYear}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Calendar size={16} className="text-slate-400" />
            <select
              className="bg-transparent text-sm text-slate-700 outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map(y => <option key={y} value={y}>{y === currentYear ? 'This Year ('+y+')' : y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent text-sm text-slate-700 outline-none"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-transparent text-sm text-slate-700 outline-none capitalize"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              {severities.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium text-right">Casualties</th>
              <th className="px-4 py-3 font-medium text-right">Displaced</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map(event => (
              <tr key={event.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    {event.date}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{event.location}</div>
                  <div className="text-slate-500 text-xs">{event.district}, {event.state}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{event.type}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_CONFIG[event.severity]?.bgClass || 'bg-slate-100 text-slate-800'}`}>
                    {SEVERITY_CONFIG[event.severity]?.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-700">{event.casualties}</td>
                <td className="px-4 py-3 text-right text-slate-700">{event.displaced}</td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No historical events found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_CONFIG[event.severity]?.bgClass || 'bg-slate-100'}`}>
                {SEVERITY_CONFIG[event.severity]?.label}
              </span>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={12} /> {event.date}
              </div>
            </div>
            <h3 className="font-medium text-slate-800 mb-1">{event.location}</h3>
            <p className="text-xs text-slate-500 mb-3">{event.district}, {event.state} • {event.type}</p>
            <div className="flex justify-between text-sm text-slate-700 border-t border-slate-200 pt-3 mt-2">
              <span>Casualties: <strong>{event.casualties}</strong></span>
              <span>Displaced: <strong>{event.displaced}</strong></span>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="py-8 text-center text-slate-500 border border-slate-200 rounded-lg">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}
