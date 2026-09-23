import React from 'react';
import { Clock, MapPin, Image as ImageIcon } from 'lucide-react';

export default function ReportsList({ reports }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Crack/Fissure': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Slope Movement': return 'bg-red-100 text-red-800 border-red-200';
      case 'Road Block': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Water Seepage': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-slate-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Recent Reports</h2>
        <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-sm font-medium">
          {reports.length} Total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>No community reports yet.</p>
            <p className="text-sm mt-1">Be the first to report a field observation.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(report.category)}`}>
                  {report.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${report.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {report.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-700 mb-3 line-clamp-2">{report.description}</p>
              
              {report.photoUrl && (
                <div className="mb-3 w-16 h-16 rounded overflow-hidden border border-slate-200">
                  <img src={report.photoUrl} alt="Report attachment" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {report.lat && report.lng ? `${report.lat}, ${report.lng}` : 'Location unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(report.timestamp)}</span>
                </div>
                {report.reporterName && (
                  <div className="flex items-center gap-1 font-medium">
                    By {report.reporterName}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
