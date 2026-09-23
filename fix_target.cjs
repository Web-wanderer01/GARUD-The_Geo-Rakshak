const fs = require('fs');
const file = 'src/pages/HomePage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldMap = `{quickAccess.map(({ icon: Icon, title, link, color, hover }) => (
              <Link key={link} to={link} className={\`flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm \${hover}\`}>
                <Icon className={\`w-8 h-8 mb-2 \${color}\`} />
                <span className={\`text-sm font-medium \${color}\`}>{title}</span>
              </Link>
            ))}`;

const newMap = `{quickAccess.map(({ icon: Icon, title, link, color, hover }) => (
              <Link 
                key={link} 
                to={link} 
                target={link === '/operations' ? '_blank' : undefined}
                rel={link === '/operations' ? 'noopener noreferrer' : undefined}
                className={\`flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 transition-colors shadow-sm \${hover}\`}
              >
                <Icon className={\`w-8 h-8 mb-2 \${color}\`} />
                <span className={\`text-sm font-medium \${color}\`}>{title}</span>
              </Link>
            ))}`;

content = content.replace(oldMap, newMap);
fs.writeFileSync(file, content);
