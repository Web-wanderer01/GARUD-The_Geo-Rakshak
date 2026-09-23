/**
 * Shimmer skeleton loading placeholder.
 * Shows animated loading placeholders in card, text, or circle shapes.
 */
export default function LoadingSkeleton({ type = 'text', lines = 3, className = '' }) {
  if (type === 'card') {
    return (
      <div className={`bg-white rounded-xl p-6 border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        <div className="space-y-4">
          <div className="h-5 rounded-lg w-3/4 shimmer-bg" />
          <div className="h-3 rounded-lg w-1/2 shimmer-bg" />
          <div className="h-32 rounded-xl shimmer-bg" />
          <div className="flex gap-3">
            <div className="h-8 rounded-full w-24 shimmer-bg" />
            <div className="h-8 rounded-full w-20 shimmer-bg" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${className}`}>
        <div className="h-[400px] md:h-[500px] relative shimmer-bg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-slate-300 border-t-blue-500 animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading Risk Map...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-white rounded-xl p-6 border border-slate-200 overflow-hidden ${className}`}>
        <div className="h-4 w-1/3 rounded shimmer-bg mb-6" />
        <div className="flex items-end gap-2 h-48">
          {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg shimmer-bg"
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`rounded-full shimmer-bg ${className}`} style={{ width: 48, height: 48 }} />
    );
  }

  if (type === 'table') {
    return (
      <div className={`bg-white rounded-xl p-4 border border-slate-200 space-y-3 ${className}`}>
        <div className="h-10 rounded-lg shimmer-bg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg shimmer-bg" style={{ animationDelay: `${i * 100}ms`, opacity: 1 - i * 0.1 }} />
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-lg shimmer-bg"
          style={{
            width: `${90 - i * 12}%`,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
