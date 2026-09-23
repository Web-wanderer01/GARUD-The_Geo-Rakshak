import React from 'react';
import { Smartphone, Bell, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { SEVERITY_CONFIG } from '../../data/alerts';

export default function PhonePreview({ alert, language }) {
  if (!alert) return null;

  const conf = SEVERITY_CONFIG[alert.severity];
  const message = (language !== 'en' && alert.translations && alert.translations[language]) 
    ? alert.translations[language] 
    : alert.message;

  const timeStr = new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-4">
        Notification Preview (Mock)
      </div>

      <div className="relative w-full max-w-[280px] h-[580px] bg-white rounded-[2.5rem] shadow-xl border-[8px] border-slate-800 overflow-hidden flex flex-col">
        {/* Notch / Status Bar */}
        <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-20">
          <div className="w-1/3 h-4 bg-slate-800 rounded-b-xl"></div>
        </div>
        <div className="h-10 px-6 pt-1 flex justify-between items-center text-[10px] font-medium text-slate-800 bg-slate-100 z-10">
          <span>{timeStr}</span>
          <div className="flex gap-1">
            <Smartphone size={12} />
          </div>
        </div>

        {/* Header */}
        <div className="bg-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <ChevronLeft size={18} />
            <span className="font-semibold text-slate-800 text-sm">NDMA-ALERT</span>
          </div>
          <MoreHorizontal size={18} className="text-slate-400" />
        </div>

        {/* SMS Chat Area */}
        <div className="flex-1 bg-slate-50 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="text-center text-[10px] text-slate-400 my-2">Today {timeStr}</div>
          
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-800 shadow-sm max-w-[90%] relative">
            {alert.severity === 'critical' && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
            <div className="font-bold mb-1 flex items-center gap-1">
              {conf.icon} EMERGENCY ALERT
            </div>
            <p className="whitespace-pre-wrap leading-snug">{message}</p>
          </div>
        </div>

        {/* Mock Push Notification Card overlaid */}
        <div className="absolute bottom-6 left-0 right-0 px-3 z-30">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200/50">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <div className="w-5 h-5 bg-red-500 rounded-md flex items-center justify-center text-white"><Bell size={12} /></div>
                Landslide Alert
              </div>
              <span className="text-[10px] text-slate-500">now</span>
            </div>
            <p className="text-xs font-medium text-slate-800 line-clamp-1">{conf.label} Alert: {alert.district}</p>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight mt-0.5">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
