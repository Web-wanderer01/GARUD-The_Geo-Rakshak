const fs = require('fs');
const file = 'src/components/operations/EmergencyPriority.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldThead = `<thead className="bg-slate-800 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-16">Rank</th>
                <th className="px-4 py-3 font-semibold">Zone</th>
                <th className="px-4 py-3 font-semibold text-right">Risk Score</th>
                <th className="px-4 py-3 font-semibold text-right">Priority Score</th>
                <th className="px-4 py-3 font-semibold">Population / Infra</th>
                <th className="px-4 py-3 font-semibold">Recommended Action</th>
              </tr>
            </thead>`;

const newThead = `<thead className="text-white sticky top-0 z-10">
              <tr>
                <th className="bg-slate-800 px-4 py-3 font-semibold text-center w-16">Rank</th>
                <th className="bg-slate-800 px-4 py-3 font-semibold">Zone</th>
                <th className="bg-slate-800 px-4 py-3 font-semibold text-right">Risk Score</th>
                <th className="bg-slate-800 px-4 py-3 font-semibold text-right">Priority Score</th>
                <th className="bg-slate-800 px-4 py-3 font-semibold">Population / Infra</th>
                <th className="bg-slate-800 px-4 py-3 font-semibold">Recommended Action</th>
              </tr>
            </thead>`;

content = content.replace(oldThead, newThead);
fs.writeFileSync(file, content);
