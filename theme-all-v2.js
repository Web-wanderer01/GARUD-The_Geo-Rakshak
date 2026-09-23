
const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
const excludes = ['HomePage.jsx', 'GARUDLoginPage.jsx', 'LoginPage.jsx', 'SignUpPage.jsx', 'AboutPage.jsx', 'SafetyGuidelinesPage.jsx', 'EmergencyContactsPage.jsx'];

files.forEach(filename => {
  if (excludes.includes(filename)) return;
  const file = path.join(dir, filename);
  let c = fs.readFileSync(file, 'utf8');

  // Replace background 900/950 colors that look bad on white background with 50/100
  c = c.replace(/bg-(red|amber|green|blue|purple|slate|indigo|cyan)-(900|950)(\/[0-9]+)?/g, (match, color) => {
    return \g-\-50\;
  });

  // Replace text 300/400 colors that are illegible on white background with 700/800
  c = c.replace(/text-(slate|gray|zinc|neutral)-(300|400)(\/[0-9]+)?/g, 'text-slate-600');
  c = c.replace(/text-(red|amber|green|blue|purple|indigo|cyan|sky)-(300|400)(\/[0-9]+)?/g, (match, color) => {
    if (color === 'sky') return 'text-blue-700';
    return \	ext-\-700\;
  });

  // Same for borders
  c = c.replace(/border-(red|amber|green|blue|purple|slate|indigo|cyan)-(900|950)(\/[0-9]+)?/g, (match, color) => {
    if (color === 'slate') return 'border-slate-300';
    return \order-\-200\;
  });
  c = c.replace(/border-(red|amber|green|blue|purple|slate|indigo|cyan)-(500|400)(\/[0-9]+)?/g, (match, color) => {
    if (color === 'slate') return 'border-slate-300';
    return \order-\-200\;
  });
  
  // Specific fix for operations page which I noticed earlier had bg-slate-950
  c = c.replace(/bg-slate-950/g, 'bg-slate-100');
  
  fs.writeFileSync(file, c);
  console.log('Processed ' + filename);
});

