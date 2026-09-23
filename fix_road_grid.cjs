const fs = require('fs');
let content = fs.readFileSync('src/components/operations/RoadStatusBoard.jsx', 'utf8');

content = content.replace(
  '<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">',
  '<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">'
);

fs.writeFileSync('src/components/operations/RoadStatusBoard.jsx', content);
