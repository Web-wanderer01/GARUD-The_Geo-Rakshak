const fs = require('fs');
const file = 'src/components/demo/MultiModalLogisticsDemo.jsx';
let content = fs.readFileSync(file, 'utf8');

// Restore inner grid
content = content.replace(
  /<div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50">/,
  '<div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50">'
);

// Restore header row
content = content.replace(
  /<div className="bg-indigo-950 p-6 flex flex-col gap-4 gap-4">/,
  '<div className="bg-indigo-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">'
);

fs.writeFileSync(file, content);
