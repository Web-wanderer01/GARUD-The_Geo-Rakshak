const fs = require('fs');

function processFile(file, isOperations = false) {
  let c = fs.readFileSync(file, 'utf8');

  c = c.replace(/bg-\[#050d1a\]/g, 'bg-slate-50')
      .replace(/bg-\[#0a0a0a\]/g, 'bg-slate-100')
      .replace(/bg-\[#060e1f\]\/80/g, 'bg-slate-50/90')
      .replace(/bg-\[#061124\]/g, 'bg-slate-50')
      .replace(/bg-\[#0a1628\]/g, 'bg-slate-50')
      .replace(/bg-black\/60/g, 'bg-white')
      .replace(/text-white|text-slate-100/g, 'text-slate-800')
      .replace(/bg-slate-900\/60/g, 'bg-white')
      .replace(/bg-slate-800\/50/g, 'bg-slate-100')
      .replace(/bg-slate-800\/60/g, 'bg-slate-100')
      .replace(/bg-slate-800\/40/g, 'bg-slate-50')
      .replace(/bg-slate-900\/50/g, 'bg-white')
      .replace(/border-slate-800\/50|border-slate-700\/40|border-slate-700\/30|border-slate-700\/20/g, 'border-slate-200')
      .replace(/border-slate-800/g, 'border-slate-200')
      .replace(/border-slate-700/g, 'border-slate-300')
      .replace(/border-slate-600\/30/g, 'border-slate-300')
      .replace(/text-slate-300|text-slate-400/g, 'text-slate-600')
      .replace(/text-slate-500/g, 'text-slate-500')
      .replace(/text-blue-300|text-sky-300|text-cyan-400/g, 'text-blue-700')
      .replace(/text-amber-300/g, 'text-amber-700')
      .replace(/text-red-300|text-red-400/g, 'text-red-700')
      .replace(/text-green-300|text-green-400/g, 'text-green-700')
      .replace(/text-purple-400|text-purple-300/g, 'text-purple-700')
      .replace(/bg-slate-800/g, 'bg-slate-100')
      .replace(/bg-slate-700\/50/g, 'bg-slate-200/50')
      .replace(/bg-slate-700/g, 'bg-slate-200')
      .replace(/bg-slate-900/g, 'bg-white')
      .replace(/bg-blue-900\/20|bg-blue-600\/40|bg-blue-500\/20/g, 'bg-blue-50')
      .replace(/bg-red-900\/20|bg-red-900\/30|bg-red-500\/30|bg-red-500\/20/g, 'bg-red-50')
      .replace(/bg-amber-900\/20|bg-amber-500\/20/g, 'bg-amber-50')
      .replace(/bg-green-900\/20|bg-green-500\/30|bg-green-600\/30|bg-green-500\/20/g, 'bg-green-50')
      .replace(/border-blue-500\/50|border-blue-500\/30|border-blue-500\/20|border-blue-500\/40/g, 'border-blue-200')
      .replace(/border-red-500\/70|border-red-500\/50|border-red-500\/40|border-red-500\/30|border-red-500\/20/g, 'border-red-200')
      .replace(/border-amber-500\/60|border-amber-500\/50|border-amber-500\/40|border-amber-500\/30|border-amber-500\/20/g, 'border-amber-200')
      .replace(/border-green-500\/40|border-green-500\/30|border-green-500\/20/g, 'border-green-200')
      .replace(/border-green-400\/60/g, 'border-green-300')
      .replace(/placeholder:text-slate-600/g, 'placeholder:text-slate-400');

  if (isOperations) {
    c = c.replace(/dark_all/g, 'light_all')
         .replace(/fillColor:'#ef4444'/g, "fillColor:'#dc2626'")
         .replace(/color:'#ef4444'/g, "color:'#dc2626'")
         .replace(/fillColor:'#3b82f6'/g, "fillColor:'#2563eb'")
         .replace(/color:'#3b82f6'/g, "color:'#2563eb'")
         .replace(/fillColor:'#22c55e'/g, "fillColor:'#16a34a'")
         .replace(/color:'#22c55e'/g, "color:'#16a34a'")
         .replace(/background:'#0a1628'/g, "background:'#f8fafc'");
  }

  fs.writeFileSync(file, c);
  console.log('Modified ' + file);
}

processFile('src/pages/OperationsPage.jsx', true);
processFile('src/pages/CoordinationPage.jsx', false);
