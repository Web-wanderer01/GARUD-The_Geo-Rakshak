import React, { useState, useEffect } from 'react';
import { Smartphone, Send, Users, CheckCircle2, AlertTriangle, MessageSquare, Loader2 } from 'lucide-react';
import { alerts } from '../../data/alerts';

export default function SmsBroadcastPanel() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [stats, setStats] = useState({
    smsSent: 12450,
    whatsappSent: 8920,
    delivered: 20150,
    failed: 1220
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');

  const handleBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastProgress(0);
    
    // Simulate sending progress
    const interval = setInterval(() => {
      setBroadcastProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBroadcasting(false);
          setStats(s => ({
            smsSent: s.smsSent + 450,
            whatsappSent: s.whatsappSent + 320,
            delivered: s.delivered + 750,
            failed: s.failed + 20
          }));
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-400" />
          Automated Dissemination (SMS/WhatsApp)
        </h3>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.smsSent.toLocaleString()}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SMS Sent</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-2xl font-bold text-slate-800">{stats.whatsappSent.toLocaleString()}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">WhatsApp Sent</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.delivered.toLocaleString()}</div>
            <div className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Delivered</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
            <div className="text-2xl font-bold text-red-700">{stats.failed.toLocaleString()}</div>
            <div className="text-[10px] uppercase font-bold text-red-600 tracking-wider">Failed (No Signal)</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 max-h-[250px]">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Targeted Broadcast Queues</h4>
          
          {criticalAlerts.map(alert => (
            <div key={alert.id} className="border border-slate-200 rounded-lg p-3 relative overflow-hidden">
              {isBroadcasting && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-50 -z-10 transition-all duration-200 ease-linear"
                  style={{ width: `${broadcastProgress}%` }}
                ></div>
              )}
              
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-slate-800">{alert.location}, {alert.state}</div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> ~4,500 residents
                </div>
              </div>
              
              <div className="text-xs text-slate-600 bg-slate-100 p-2 rounded mb-3 font-mono">
                "GARUD ALERT: {alert.severity.toUpperCase()} Landslide risk in {alert.location}. {alert.recommendedAction}"
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">EN</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">AS</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">BD</span>
                </div>
                
                {isBroadcasting ? (
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Sending...
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Queued
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleBroadcast}
          disabled={isBroadcasting}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            isBroadcasting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isBroadcasting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Broadcasting... {broadcastProgress}%
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Execute Emergency Broadcast
            </>
          )}
        </button>
      </div>
    </div>
  );
}
