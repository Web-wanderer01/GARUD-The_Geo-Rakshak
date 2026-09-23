import React, { useState } from 'react';
import { fieldReports } from '../../data/reports';
import { Check, X, MapPin, ExternalLink, Image as ImageIcon } from 'lucide-react';
import SimulatedDataBadge from '../common/SimulatedDataBadge';

export default function ReportReviewQueue({ reports: propReports, setReports: propSetReports }) {
  const [localReports, setLocalReports] = useState(fieldReports);
  const [selectedImage, setSelectedImage] = useState(null);

  const reports = propReports || localReports;
  const setReports = propSetReports || setLocalReports;

  const handleAction = (id, action) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: action === 'approve' ? 'Verified' : 'Rejected' } : r
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full flex flex-col relative">
      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-slate-300 bg-black/50 p-2 rounded-full"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Full screen evidence" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            <p className="text-white text-center mt-4 font-medium opacity-80">Click anywhere to close</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Field Report Queue</h2>
          <p className="text-sm text-slate-500">Crowdsourced & officer ground intelligence</p>
        </div>
        <SimulatedDataBadge />
      </div>

      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        {reports.map(report => (
          <div key={report.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{report.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  report.status === 'Verified' ? 'bg-green-200 text-green-800' :
                  report.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {new Date(report.timestamp).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Photo Thumbnail */}
              <div 
                className={`w-full sm:w-32 h-24 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${report.imageUrl ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 hover:opacity-90 transition-all shadow-sm' : ''}`}
                onClick={() => report.imageUrl ? setSelectedImage(report.imageUrl) : null}
                title={report.imageUrl ? "Click to view full image" : "No image provided"}
              >
                {report.imageUrl ? (
                  <img src={report.imageUrl} alt="Incident" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              {/* Details */}
              <div className="flex-grow">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
                  <div className="font-medium text-blue-700">{report.incidentType}</div>
                  <div className="text-slate-500">• {report.submitterRole}</div>
                  <div className="flex items-center gap-1 text-slate-600 w-full mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                    {report.location.lat}, {report.location.lng}
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3">
                  "{report.notes}"
                </p>

                {report.status === 'Pending Review' && (
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleAction(report.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Verify & Update Route
                    </button>
                    <button 
                      onClick={() => handleAction(report.id, 'reject')}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            No field reports in queue.
          </div>
        )}
      </div>
    </div>
  );
}
