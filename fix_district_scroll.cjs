const fs = require('fs');
const file = 'src/components/operations/DistrictRiskTable.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update the wrapper
content = content.replace(
  '<div className="hidden md:block overflow-x-auto">',
  '<div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">'
);

// Update table relative
content = content.replace(
  '<table className="w-full text-left text-sm text-slate-600">',
  '<table className="w-full text-left text-sm text-slate-600 relative">'
);

// Update th's to be sticky
content = content.replace(
  '<thead className="bg-slate-50 text-slate-700 uppercase text-xs">',
  '<thead className="text-slate-700 uppercase text-xs sticky top-0 z-10">'
);
content = content.replace(/className="group px-6/g, 'className="bg-slate-50 group px-6');
content = content.replace(/className="px-6 py-4/g, 'className="bg-slate-50 px-6 py-4');

fs.writeFileSync(file, content);
