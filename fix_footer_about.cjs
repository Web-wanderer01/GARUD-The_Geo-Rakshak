const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Footer.jsx', 'utf8');

const oldAbout = `          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">About</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>GARUD - THE GEO RAKSHAK</strong><br/>
              AI-Based Early Warning &amp; Landslide Risk Monitoring System for India's North Eastern Region.
              Developed under the National Disaster Management Authority.
            </p>
          </div>`;

const newAbout = `          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">About</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>GARUD - THE GEO RAKSHAK</strong><br/>
              An AI-powered Smart Logistics, Early Warning, and Landslide Risk Intelligence Platform.
              Developed for the National Disaster Management Authority.
            </p>
          </div>`;

content = content.replace(oldAbout, newAbout);
fs.writeFileSync('src/components/layout/Footer.jsx', content);
