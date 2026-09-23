import React, { useState, useEffect } from 'react';
import { Navigation, Mic, X, Volume2 } from 'lucide-react';

export default function VoiceNavigation({ onNavigate, onCancel }) {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Idle');
  
  const startNavigation = () => {
    setIsActive(true);
    setStatus('Acquiring Location & Calculating Route...');
    
    // Simulate computing route to nearest safe zone
    setTimeout(() => {
      const mockRoute = {
        campName: 'Guwahati Stadium Relief Camp',
        path: [
          [26.12, 91.70], // User Mock Location
          [26.13, 91.71],
          [26.14, 91.73] // Guwahati Stadium
        ]
      };
      
      onNavigate(mockRoute);
      setStatus('Navigating to Safe Zone...');
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          "Emergency navigation activated. Proceed north-east towards Guwahati Stadium Relief Camp. The route is clear of known landslide zones."
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      
    }, 1500);
  };
  
  const cancelNavigation = () => {
    setIsActive(false);
    setStatus('Idle');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onCancel();
  };
  
  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isActive && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-fade-in max-w-sm">
          <div className="bg-blue-500/20 p-3 rounded-full animate-pulse">
            <Volume2 className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-grow">
            <div className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Voice Guidance Active</div>
            <div className="text-sm font-medium">{status}</div>
          </div>
          <button onClick={cancelNavigation} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}
      
      {!isActive && (
        <button 
          onClick={startNavigation}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 group"
        >
          <Mic className="w-5 h-5 group-hover:animate-pulse" />
          Voice Evacuation Assist
        </button>
      )}
    </div>
  );
}
