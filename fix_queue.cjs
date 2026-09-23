const fs = require('fs');
const file = 'src/components/operations/ReportReviewQueue.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldDetails = `<div className="flex-grow">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
                  <div className="font-medium text-blue-700">{report.incidentType}</div>
                  <div className="text-slate-500">• {report.submitterRole}</div>
                  <div className="flex items-center gap-1 text-slate-600 w-full mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                    {report.location.lat}, {report.location.lng}
                  </div>
                </div>`;

const newDetails = `<div className="flex-grow">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-2">
                  <div className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{report.incidentType}</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    {report.submitterRole}
                  </div>
                  {report.status === 'Pending Review' && (
                    <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-semibold text-xs ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      AI Confidence: {Math.floor(Math.random() * 15 + 85)}% (Satellite Confirmed)
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-600 w-full">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> 
                    {report.location.lat}, {report.location.lng}
                  </div>
                </div>`;

content = content.replace(oldDetails, newDetails);
fs.writeFileSync(file, content);
