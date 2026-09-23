const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Footer.jsx', 'utf8');

const oldQuickLinks = `          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Risk Dashboard', path: '/map' },
                { name: 'Active Alerts', path: '/alerts' },
                { name: 'Logistics Operations', path: '/logistics' },
                { name: 'Virtual Simulations', path: '/demo' },
                { name: 'Field Report', path: '/reporting' },
                { name: 'Emergency Contacts', path: '/emergency' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>`;

const newQuickLinks = `          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Risk Dashboard', path: '/map' },
                { name: 'Data Analytics', path: '/analytics' },
                { name: 'Command Center', path: '/operations' },
                { name: 'Smart Logistics', path: '/logistics' },
                { name: 'Virtual Simulations', path: '/demo' },
                { name: 'Citizen Database', path: '/database' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>`;

content = content.replace(oldQuickLinks, newQuickLinks);

fs.writeFileSync('src/components/layout/Footer.jsx', content);
