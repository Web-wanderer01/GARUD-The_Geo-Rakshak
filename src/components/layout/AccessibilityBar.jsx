import { useState, useEffect } from 'react';

export default function AccessibilityBar() {
  const [contrast, setContrast] = useState('normal');
  const [textSize, setTextSize] = useState('normal');

  // Apply high contrast class
  useEffect(() => {
    if (contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [contrast]);

  // Apply text size changes
  useEffect(() => {
    const html = document.documentElement;
    if (textSize === 'small') html.style.fontSize = '14px';
    else if (textSize === 'large') html.style.fontSize = '18px';
    else html.style.fontSize = '16px';
  }, [textSize]);

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 border-b border-slate-700 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Left side links */}
        <div className="flex items-center gap-4">
          <a href="#main-content" className="hover:text-white focus:text-white focus:outline-none focus:underline decoration-white underline-offset-2">Skip to Main Content</a>
          <a href="#screen-reader" className="hidden sm:inline hover:text-white focus:outline-none focus:underline">Screen Reader Access</a>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Text Size */}
          <div className="flex items-center gap-1.5 border-r border-slate-600 pr-3 sm:pr-4">
            <button onClick={() => setTextSize('small')} className="hover:text-white px-1 focus:outline-none focus:ring-1 focus:ring-white" title="Decrease Text Size">A-</button>
            <button onClick={() => setTextSize('normal')} className="hover:text-white px-1 font-medium focus:outline-none focus:ring-1 focus:ring-white" title="Normal Text Size">A</button>
            <button onClick={() => setTextSize('large')} className="hover:text-white px-1 font-bold focus:outline-none focus:ring-1 focus:ring-white" title="Increase Text Size">A+</button>
          </div>
          
          {/* Contrast */}
          <div className="flex items-center gap-2 border-r border-slate-600 pr-3 sm:pr-4">
            <button 
              onClick={() => setContrast('normal')} 
              className="w-4 h-4 bg-white border border-slate-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-white" 
              title="Standard Contrast"
              aria-label="Standard Contrast"
            />
            <button 
              onClick={() => setContrast('high')} 
              className="w-4 h-4 bg-black border border-white rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-white" 
              title="High Contrast"
              aria-label="High Contrast"
            />
          </div>
          
          {/* Language Selection - Google Translate */}
          <div id="google_translate_element" className="translate-wrapper"></div>
          <style>{`
            /* Hide the Google Translate branding */
            .goog-te-gadget { color: transparent !important; font-size:0px; display: flex; align-items: center; }
            .goog-te-gadget .goog-te-combo { margin: 0; padding: 2px 4px; background: transparent; color: #cbd5e1; border: 1px solid #475569; border-radius: 4px; font-size: 11px; outline: none; cursor: pointer; }
            .goog-te-gadget .goog-te-combo:hover { color: white; border-color: #64748b; }
            .goog-te-gadget .goog-te-combo option { color: #000; }
            .goog-logo-link { display: none !important; }
            .goog-te-banner-frame { display: none !important; }
            body { top: 0 !important; }
          `}</style>
        </div>
      </div>
    </div>
  );
}
