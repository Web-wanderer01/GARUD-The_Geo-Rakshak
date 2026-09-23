import React, { useState, useEffect } from 'react';
import { SEVERITY_CONFIG } from '../../data/alerts';
import { MapPin, Clock, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from 'lucide-react';
import { translateWithBhashini } from '../../services/bhashiniService';

const ORDER = ['critical', 'high', 'moderate', 'low'];

function AlertItem({ alert, language, expandedIds, toggleExpand }) {
  const [translatedMessage, setTranslatedMessage] = useState(alert.message);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTranslation = async () => {
      if (language === 'en') {
        if (mounted) setTranslatedMessage(alert.message);
        return;
      }
      
      setIsTranslating(true);
      const bhashiniResult = await translateWithBhashini(alert.message, 'en', language);
      
      if (!mounted) return;
      
      // Fallback to local mock translation if Bhashini API keys aren't set
      if (bhashiniResult) {
        setTranslatedMessage(bhashiniResult);
      } else if (alert.translations && alert.translations[language]) {
        setTranslatedMessage(alert.translations[language]);
      } else {
        setTranslatedMessage(alert.message);
      }
      setIsTranslating(false);
    };

    fetchTranslation();
    return () => { mounted = false; };
  }, [language, alert.message, alert.translations]);

  const isExpanded = expandedIds.has(alert.id);
  const isCritical = alert.severity === 'critical';
  const isHigh = alert.severity === 'high';

  return (
    <div
      className={`bg-white border rounded-lg p-5 transition-all ${
        isCritical ? 'border-red-200' :
        isHigh ? 'border-orange-200' : 'border-slate-200'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-50 border ${isCritical ? 'border-red-100' : isHigh ? 'border-orange-100' : 'border-slate-100'}`}>
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-red-600' : isHigh ? 'text-orange-600' : 'text-slate-600'}`}>
            {alert.severity}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock size={12} />
          {new Date(alert.timestamp).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <h3 className="font-semibold text-slate-700 text-[13px] flex items-center gap-1.5 mb-2.5">
        <MapPin size={14} className="text-slate-400 flex-shrink-0" />
        {alert.location}, {alert.state}
      </h3>
      
      {isTranslating ? (
        <div className="flex items-center gap-2 text-slate-400 text-[13px] mb-3 h-[42px]">
          <Loader2 className="w-4 h-4 animate-spin" /> Translating via Bhashini...
        </div>
      ) : language !== 'en' ? (
        <div className="space-y-2 mb-3">
          <p className="text-slate-800 text-[13px] leading-relaxed">
            {translatedMessage}
          </p>
          <p className="text-slate-500 text-[12px] leading-relaxed italic border-l-2 border-slate-200 pl-2">
            English: {alert.message}
          </p>
        </div>
      ) : (
        <p className="text-slate-600 text-[13px] leading-relaxed mb-3">{translatedMessage}</p>
      )}

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Recommended Action</h4>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded">{alert.recommendedAction}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => toggleExpand(alert.id)}
        className="mt-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
      >
        {isExpanded ? <><ChevronUp size={12} /> Hide Details</> : <><ChevronDown size={12} /> Show Details</>}
      </button>
    </div>
  );
}

export default function AlertsFeed({ alerts = [], language }) {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedIds(newExpanded);
  };

  const filteredAlerts = [...alerts]
    .filter(a => selectedSeverity === 'all' || a.severity === selectedSeverity)
    .sort((a, b) => {
      const sevDiff = ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity);
      if (sevDiff !== 0) return sevDiff;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div className="bg-white rounded-lg overflow-hidden flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle size={20} className="text-slate-600" />
          Active Alerts
        </h2>
        <div className="flex gap-1.5 flex-wrap bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors ${selectedSeverity === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >All</button>
          {ORDER.map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md capitalize transition-colors ${selectedSeverity === sev ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >{sev}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <CheckCircle2 size={32} className="mb-2 text-green-500" />
            <p className="text-sm">No active alerts for this severity level.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              language={language} 
              expandedIds={expandedIds} 
              toggleExpand={toggleExpand} 
            />
          ))
        )}
      </div>
    </div>
  );
}
