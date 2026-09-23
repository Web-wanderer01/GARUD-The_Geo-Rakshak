import React from 'react';
import { LANGUAGES } from '../../data/alerts';

export default function MultilingualToggle({ selectedLanguage, onLanguageChange }) {
  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="lg:max-w-2xl">
          <h3 className="text-[15px] font-semibold text-blue-800 mb-1.5">Multilingual Alert Dissemination</h3>
          <p className="text-xs text-blue-600/80 leading-relaxed">
            Translations shown are sample placeholders for demonstration. Production system would use professionally verified translations or certified neural MT.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {LANGUAGES.map(lang => {
            const isActive = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`flex flex-col items-center justify-center w-20 h-14 rounded-md transition-all border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-blue-700 border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-sm font-medium leading-none mb-1">{lang.native}</span>
                <span className={`text-[9px] ${isActive ? 'text-blue-100' : 'text-blue-500'}`}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
