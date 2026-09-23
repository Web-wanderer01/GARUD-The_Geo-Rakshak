const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(filename => {
  const file = path.join(dir, filename);
  let c = fs.readFileSync(file, 'utf8');

  let modified = false;
  c = c.replace(/className="([^"]*)"/g, (match, classes) => {
    if (/(bg-(blue|red|indigo|emerald|green|purple|amber)-(500|600|700|800|900))(?![\/])/.test(classes) && classes.includes('text-slate-800')) {
      return 'className="' + classes.replace(/text-slate-800/g, 'text-white') + '"';
    }
    return match;
  });
  
  c = c.replace(/className={`([^`]*)`}/g, (match, classes) => {
    if (/(bg-(blue|red|indigo|emerald|green|purple|amber)-(500|600|700|800|900))(?![\/])/.test(classes) && classes.includes('text-slate-800')) {
      return 'className={`' + classes.replace(/text-slate-800/g, 'text-white') + '`}';
    }
    return match;
  });

  if (c !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, c);
    console.log('Fixed buttons in ' + filename);
  }
});
