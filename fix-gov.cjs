const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(filename => {
  const file = path.join(dir, filename);
  let c = fs.readFileSync(file, 'utf8');

  // Replace dark bg-gov-* classes with light slate/white alternatives
  c = c.replace(/bg-gov-900(?:\/[0-9]+)?/g, 'bg-white');
  c = c.replace(/bg-gov-800(?:\/[0-9]+)?/g, 'bg-slate-50');
  c = c.replace(/bg-gov-700(?:\/[0-9]+)?/g, 'bg-slate-100');
  c = c.replace(/border-gov-900(?:\/[0-9]+)?/g, 'border-slate-300');
  c = c.replace(/border-gov-800(?:\/[0-9]+)?/g, 'border-slate-200');
  c = c.replace(/border-gov-700(?:\/[0-9]+)?/g, 'border-slate-200');
  
  // Also we want to ensure any buttons that were manually using bg-gov-* keep contrast?
  // Actually, if we change bg to slate-50/white, the text should be text-slate-800, which we already did in the earlier global replace!

  if (c !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, c);
    console.log('Processed gov colors in ' + filename);
  }
});
