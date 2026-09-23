const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldReportsChart = `<div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Live Field Reports (Last 20 Mins)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer>
                <AreaChart data={liveNetworkData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="reports" stroke="#2563eb" fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>`;

const newReportsChart = `<div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Live Field Reports Trend</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded animate-pulse">LIVE INCING</span>
            </h3>
            <div className="flex gap-4 mb-2">
               <div className="flex flex-col"><span className="text-2xl font-bold text-slate-800">42</span><span className="text-xs text-slate-500">Last 20 Mins</span></div>
               <div className="flex flex-col"><span className="text-2xl font-bold text-blue-600">89%</span><span className="text-xs text-slate-500">AI Verified</span></div>
            </div>
            <div className="h-32 w-full mt-2">
              <ResponsiveContainer>
                <AreaChart data={liveNetworkData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="reports" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>`;

content = content.replace(oldReportsChart, newReportsChart);

const oldUnitsChart = `<div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" /> Active Ground Units (Telemetry)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer>
                <BarChart data={liveNetworkData}>
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="activeNodes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>`;

const newUnitsChart = `<div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Active Ground Units (Vitals)</span>
              <span className="text-xs text-slate-400">SAT-LINK OK</span>
            </h3>
            <div className="space-y-3">
              {[
                { name: 'SDRF Team Alpha', bat: 85, hr: 82, loc: 'Dima Hasao' },
                { name: 'NDRF Base Camp 4', bat: 92, hr: 75, loc: 'Tawang' },
                { name: 'Medical Evac H-1', bat: 45, hr: 98, loc: 'Cherrapunji' }
              ].map((unit, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer group">
                  <div>
                    <div className="text-sm font-bold text-slate-700">{unit.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {unit.loc}
                    </div>
                  </div>
                  <div className="flex gap-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-slate-500">BAT</span>
                      <span className={\`text-xs font-bold \${unit.bat < 50 ? 'text-orange-500' : 'text-green-600'}\`}>{unit.bat}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-slate-500">BPM</span>
                      <span className="text-xs font-bold text-red-500 flex items-center gap-1">{unit.hr} <Activity className="w-3 h-3 animate-pulse" /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>`;

content = content.replace(oldUnitsChart, newUnitsChart);
fs.writeFileSync(file, content);
