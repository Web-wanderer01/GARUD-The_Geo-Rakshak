const fs = require('fs');
const file = 'src/pages/HomePage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Change grid-cols to 6 for the feature row
content = content.replace(/className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"/, 'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"');

// Reduce padding and text size in the feature cards to make them fit better in 6 columns
content = content.replace(/className=\{"block p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white " \+ c\.border\}/g, 'className={"block p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col justify-between h-full " + c.border}');
content = content.replace(/className=\{"w-12 h-12 rounded-xl flex items-center justify-center mb-4 " \+ c\.icon\}/g, 'className={"w-10 h-10 rounded-lg flex items-center justify-center mb-3 " + c.icon}');
content = content.replace(/<Icon className="w-6 h-6" \/>/g, '<Icon className="w-5 h-5" />');
content = content.replace(/<h3 className="font-bold text-lg text-slate-900 mb-2">\{title\}<\/h3>/g, '<h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>');
content = content.replace(/<p className="text-slate-600 text-sm leading-relaxed">\{description\}<\/p>/g, '<p className="text-slate-500 text-[11px] leading-snug line-clamp-3 mb-2">{description}</p>');
content = content.replace(/<span className=\{"text-xs font-bold flex items-center gap-1 mt-4 " \+ c\.btn\}>/g, '<span className={"text-[10px] font-bold flex items-center gap-1 mt-auto " + c.btn}>');

fs.writeFileSync(file, content);
