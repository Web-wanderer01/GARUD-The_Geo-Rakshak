import { useState } from 'react';
import { Info, X } from 'lucide-react';

/**
 * Reusable tooltip component for methodology explanations.
 * Shows an info icon that expands to reveal detailed text on click.
 */
export default function InfoTooltip({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        aria-label={`More info: ${title}`}
      >
        <Info className="w-4 h-4" />
        <span className="underline decoration-dotted">{title}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 w-72 sm:w-96 p-4 bg-white border border-slate-200 rounded-lg shadow-lg text-sm text-slate-700">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Close tooltip"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 leading-relaxed">{children}</div>
        </div>
      )}
    </div>
  );
}
