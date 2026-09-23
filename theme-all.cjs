const fs = require('fs');
const path = require('path');

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

// Exclude pages we already styled or shouldn't touch
const excludes = [
  'HomePage.jsx', 'GARUDLoginPage.jsx', 'LoginPage.jsx', 'SignUpPage.jsx', 
  'AboutPage.jsx', 'SafetyGuidelinesPage.jsx', 'EmergencyContactsPage.jsx', 
  'OperationsPage.jsx', 'CoordinationPage.jsx'
];

function processFile(filename) {
  if (excludes.includes(filename)) return;
  
  const file = path.join(dir, filename);
  let c = fs.readFileSync(file, 'utf8');
  let isMapFile = c.includes('MapContainer') || c.includes('dark_all');

  const replacements = [
    ['bg-[#050d1a]', 'bg-slate-50'],
    ['bg-[#0a0a0a]', 'bg-slate-100'],
    ['bg-[#060e1f]/80', 'bg-slate-50/90'],
    ['bg-[#061124]', 'bg-slate-50'],
    ['bg-[#0a1628]', 'bg-slate-50'],
    ['bg-black/60', 'bg-white'],
    ['text-white', 'text-slate-800'],
    ['text-slate-100', 'text-slate-800'],
    ['bg-slate-900/60', 'bg-white'],
    ['bg-slate-800/50', 'bg-slate-100'],
    ['bg-slate-800/60', 'bg-slate-100'],
    ['bg-slate-800/40', 'bg-slate-50'],
    ['bg-slate-900/50', 'bg-white'],
    ['border-slate-800/50', 'border-slate-200'],
    ['border-slate-700/40', 'border-slate-200'],
    ['border-slate-700/30', 'border-slate-200'],
    ['border-slate-700/20', 'border-slate-200'],
    ['border-slate-800', 'border-slate-200'],
    ['border-slate-700', 'border-slate-300'],
    ['border-slate-600/30', 'border-slate-300'],
    ['text-slate-300', 'text-slate-600'],
    ['text-slate-400', 'text-slate-600'],
    ['text-blue-300', 'text-blue-700'],
    ['text-sky-300', 'text-blue-700'],
    ['text-cyan-400', 'text-blue-700'],
    ['text-amber-300', 'text-amber-700'],
    ['text-red-300', 'text-red-700'],
    ['text-red-400', 'text-red-700'],
    ['text-green-300', 'text-green-700'],
    ['text-green-400', 'text-green-700'],
    ['text-purple-400', 'text-purple-700'],
    ['text-purple-300', 'text-purple-700'],
    ['bg-slate-800', 'bg-slate-100'],
    ['bg-slate-700/50', 'bg-slate-200/50'],
    ['bg-slate-700', 'bg-slate-200'],
    ['bg-slate-900', 'bg-white'],
    ['bg-blue-900/20', 'bg-blue-50'],
    ['bg-blue-600/40', 'bg-blue-50'],
    ['bg-blue-500/20', 'bg-blue-50'],
    ['bg-red-900/20', 'bg-red-50'],
    ['bg-red-900/30', 'bg-red-50'],
    ['bg-red-500/30', 'bg-red-50'],
    ['bg-red-500/20', 'bg-red-50'],
    ['bg-amber-900/20', 'bg-amber-50'],
    ['bg-amber-500/20', 'bg-amber-50'],
    ['bg-green-900/20', 'bg-green-50'],
    ['bg-green-500/30', 'bg-green-50'],
    ['bg-green-600/30', 'bg-green-50'],
    ['bg-green-500/20', 'bg-green-50'],
    ['border-blue-500/50', 'border-blue-200'],
    ['border-blue-500/30', 'border-blue-200'],
    ['border-blue-500/20', 'border-blue-200'],
    ['border-blue-500/40', 'border-blue-200'],
    ['border-red-500/70', 'border-red-200'],
    ['border-red-500/50', 'border-red-200'],
    ['border-red-500/40', 'border-red-200'],
    ['border-red-500/30', 'border-red-200'],
    ['border-red-500/20', 'border-red-200'],
    ['border-amber-500/60', 'border-amber-200'],
    ['border-amber-500/50', 'border-amber-200'],
    ['border-amber-500/40', 'border-amber-200'],
    ['border-amber-500/30', 'border-amber-200'],
    ['border-amber-500/20', 'border-amber-200'],
    ['border-green-500/40', 'border-green-200'],
    ['border-green-500/30', 'border-green-200'],
    ['border-green-500/20', 'border-green-200'],
    ['border-green-400/60', 'border-green-300'],
    ['placeholder:text-slate-600', 'placeholder:text-slate-400']
  ];

  for (const [search, replace] of replacements) {
    c = c.split(search).join(replace);
  }

  if (isMapFile) {
    c = c.split('dark_all').join('light_all')
         .split("fillColor:'#ef4444'").join("fillColor:'#dc2626'")
         .split("color:'#ef4444'").join("color:'#dc2626'")
         .split("fillColor:'#3b82f6'").join("fillColor:'#2563eb'")
         .split("color:'#3b82f6'").join("color:'#2563eb'")
         .split("fillColor:'#22c55e'").join("fillColor:'#16a34a'")
         .split("color:'#22c55e'").join("color:'#16a34a'")
         .split("background:'#0a1628'").join("background:'#f8fafc'");
  }

  fs.writeFileSync(file, c);
  console.log('Modified ' + file);
}

files.forEach(f => processFile(f));
