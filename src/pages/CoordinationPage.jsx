import React, { useState, useEffect, useRef } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import { Shield, Users, Plane, Anchor, Heart, Radio, Send, CheckCircle, Clock, AlertTriangle, FileText, ChevronDown, Plus } from 'lucide-react';


const AGENCIES = ['NDRF','SDRF','Indian Army','IAF','Medical Corps','Dist. Admin'];
const TASK_TYPES = ['Search & Rescue','Flood Relief','Medical Evacuation','Supply Drop','Road Clearance','Aerial Recon'];
const PRIORITIES = ['CRITICAL','HIGH','MEDIUM','LOW'];

const PRIORITY_STYLE = { CRITICAL:'bg-red-50 text--600 border-red-200', HIGH:'bg-amber-50 text--600 border-amber-200', MEDIUM:'bg-blue-50 text--600 border-blue-200', LOW:'bg-slate-500/20 text-slate-700 border-slate-300' };
const STATUS_STYLE = { DISPATCHED:'text--600', EN_ROUTE:'text--600', ON_SITE:'text--600', COMPLETED:'text--600' };
const STATUS_NEXT = { DISPATCHED:'EN_ROUTE', EN_ROUTE:'ON_SITE', ON_SITE:'COMPLETED', COMPLETED:'COMPLETED' };

const INIT_LOG = [
  { id:1, agency:'NDRF', task:'Search & Rescue', loc:'Rangpo Landslide (NH-10)', priority:'CRITICAL', status:'EN_ROUTE',   time:'06:12', res:['Helicopter','Engineers'] },
  { id:2, agency:'IAF',  task:'Supply Drop',     loc:'Tawang Airfield',          priority:'HIGH',     status:'ON_SITE',    time:'05:45', res:['Helicopter'] },
  { id:3, agency:'Medical Corps', task:'Medical Evacuation', loc:'Silchar Flood Camp', priority:'HIGH', status:'COMPLETED', time:'05:20', res:['Medical'] },
  { id:4, agency:'Indian Army', task:'Road Clearance', loc:'NH-06 Dima Hasao',   priority:'MEDIUM',   status:'DISPATCHED', time:'04:58', res:['Engineers'] },
  { id:5, agency:'SDRF', task:'Flood Relief',    loc:'Imphal Urban Flood',        priority:'HIGH',     status:'EN_ROUTE',   time:'04:30', res:['Boats'] },
  { id:6, agency:'NDRF', task:'Search & Rescue', loc:'Dima Hasao Landslide',     priority:'CRITICAL', status:'ON_SITE',    time:'03:55', res:['Helicopter','Medical'] },
  { id:7, agency:'SDRF', task:'Flood Relief',    loc:'Brahmaputra Floodplain',   priority:'HIGH',     status:'EN_ROUTE',   time:'03:20', res:['Boats'] },
  { id:8, agency:'Medical Corps', task:'Medical Evacuation', loc:'Gangtok Camp', priority:'MEDIUM',   status:'COMPLETED',  time:'02:45', res:['Medical'] },
];

const RESOURCES = [
  { name:'Mi-17 Helicopters', icon:'🚁', total:7,  deployed:3, avail:4 },
  { name:'ALH Dhruv',         icon:'🚁', total:8,  deployed:2, avail:6 },
  { name:'NDRF Battalions',   icon:'🛡️', total:8,  deployed:5, avail:3 },
  { name:'SDRF Companies',    icon:'👮', total:12, deployed:4, avail:8 },
  { name:'Boat Squadrons',    icon:'🚤', total:18, deployed:6, avail:12 },
  { name:'Medical Teams',     icon:'🏥', total:23, deployed:8, avail:15 },
  { name:'Army Engineers',    icon:'⚙️', total:5,  deployed:3, avail:2 },
  { name:'IAF C-130J',        icon:'✈️', total:2,  deployed:1, avail:1 },
];

const GEMINI_MODELS = ['gemini-2.5-flash','gemini-2.0-flash','gemini-1.5-flash'];

export default function CoordinationPage() {
  const [resources, setResources] = useState(RESOURCES.map(r => ({ ...r })));
  const [dispLog, setDispLog]     = useState(INIT_LOG);
  const [form, setForm]           = useState({ agency:'NDRF', task:'Search & Rescue', loc:'', priority:'HIGH', res:[], notes:'' });
  const [sitrep, setSitrep]       = useState('');
  const [sitrepLoading, setSitrepLoading] = useState(false);
  const [sitrepDate, setSitrepDate] = useState(new Date().toLocaleDateString('en-IN'));
  const [officer, setOfficer]     = useState('Cmd. J.S. Bisht, GARUD-OC');
  const sitrepRef = useRef(null);

  const deployRes = (idx) => {
    setResources(prev => prev.map((r,i) => i===idx && r.avail>0 ? { ...r, avail:r.avail-1, deployed:r.deployed+1 } : r));
  };
  const recallRes = (idx) => {
    setResources(prev => prev.map((r,i) => i===idx && r.deployed>0 ? { ...r, avail:r.avail+1, deployed:r.deployed-1 } : r));
  };

  const dispatch = () => {
    if (!form.loc.trim()) { alert('Please enter a location'); return; }
    const entry = { id: Date.now(), ...form, status:'DISPATCHED', time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    setDispLog(prev => [entry, ...prev]);
    setForm(f => ({ ...f, loc:'', notes:'', res:[] }));
  };

  const advanceStatus = (id) => {
    setDispLog(prev => prev.map(d => d.id===id ? { ...d, status: STATUS_NEXT[d.status] } : d));
  };

  const generateSitrep = async () => {
    setSitrepLoading(true);
    setSitrep('');
    const key = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (!key || !key.startsWith('AQ.') && !key.startsWith('AIza')) {
      setSitrep('⚠ API key not configured. Please add VITE_GEMINI_API_KEY to .env');
      setSitrepLoading(false);
      return;
    }

    const prompt = `Generate a formal NDMA-standard Situation Report (SITREP) for NER disaster operations.

Date: ${sitrepDate}
Reporting Officer: ${officer}
Active Dispatch: ${dispLog.slice(0,5).map(d=>`${d.agency} → ${d.loc} (${d.task}, ${d.status})`).join('; ')}
Resources Deployed: ${resources.map(r=>`${r.name}: ${r.deployed}/${r.total}`).join(', ')}

Format as:
## SITREP — GARUD Command NER
**Date/Time:** [date]  **Officer:** [name]  **Classification:** RESTRICTED

### 1. Executive Summary (3 sentences)
### 2. Active Incidents (list 5 specific NER incidents with state, type, severity)
### 3. Resources Deployed (table format)
### 4. Relief Camp Status (3 camps)
### 5. Immediate Recommendations (3 bullet points)
### 6. Next 24-Hour Forecast (weather + risk outlook)

Keep it professional, concise, government-style.`;

    for (const model of GEMINI_MODELS) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${key}`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{role:'user',parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:1200,temperature:0.6} })
        });
        if (!res.ok) continue;
        setSitrepLoading(false);
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let full = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of dec.decode(value,{stream:true}).split('\n')) {
            if (!line.startsWith('data: ')) continue;
            try {
              const token = JSON.parse(line.slice(6))?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
              full += token;
              setSitrep(full);
              sitrepRef.current?.scrollTo(0, sitrepRef.current.scrollHeight);
            } catch {}
          }
        }
        return;
      } catch {}
    }
    setSitrep('❌ All AI models busy. Please try again.');
    setSitrepLoading(false);
  };

  const copyToClipboard = () => { navigator.clipboard?.writeText(sitrep); alert('Copied to clipboard!'); };

  const toggleRes = (res) => {
    setForm(f => ({ ...f, res: f.res.includes(res) ? f.res.filter(r=>r!==res) : [...f.res, res] }));
  };

  return (
    <div className="page-enter relative pb-10 bg-white min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">

        <FadeIn direction="down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">🏛️ Coordination Terminal</h1>
              <p className="text-slate-700 text-sm">Inter-Agency Dispatch · Resource Matrix · AI SITREP Generator</p>
            </div>
            <SimulatedDataBadge />
          </div>
        </FadeIn>

        {/* Resource Matrix */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text--600"/> Live Resource Matrix</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {resources.map((r,i) => (
                <div key={r.name} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs text-slate-700 leading-tight mb-2">{r.name}</div>
                  <div className="text-sm font-mono">
                    <span className="text--600 font-black">{r.avail}</span>
                    <span className="text-slate-700">/{r.total}</span>
                  </div>
                  <div className="text-[9px] text--600 mb-2">{r.deployed} deployed</div>
                  <div className="flex gap-1">
                    <button onClick={() => deployRes(i)} disabled={r.avail===0}
                      className="flex-1 text-[10px] py-1 rounded-lg bg-blue-50 text--600 border border-blue-200 hover:bg-blue-600/60 disabled:opacity-30 transition-colors font-bold">
                      +Deploy
                    </button>
                    <button onClick={() => recallRes(i)} disabled={r.deployed===0}
                      className="flex-1 text-[10px] py-1 rounded-lg bg-red-600/30 text--600 border border-red-200 hover:bg-red-600/50 disabled:opacity-30 transition-colors">
                      Recall
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Dispatch Terminal + Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn>
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5 space-y-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><Send className="w-5 h-5 text--600"/> Dispatch Terminal</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 mb-1 block">Agency</label>
                  <select value={form.agency} onChange={e=>setForm(f=>({...f,agency:e.target.value}))}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-200">
                    {AGENCIES.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-700 mb-1 block">Task Type</label>
                  <select value={form.task} onChange={e=>setForm(f=>({...f,task:e.target.value}))}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-200">
                    {TASK_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1 block">Location</label>
                <input value={form.loc} onChange={e=>setForm(f=>({...f,loc:e.target.value}))}
                  placeholder="e.g. NH-10 Rangpo Km 42, Sikkim"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-200"/>
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1 block">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button key={p} onClick={() => setForm(f=>({...f,priority:p}))}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${form.priority===p ? PRIORITY_STYLE[p] : 'border-slate-200 text-slate-700 hover:text-slate-700'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1 block">Resources Required</label>
                <div className="flex flex-wrap gap-2">
                  {['Helicopter','Boats','Medical','Engineers','Communications'].map(r => (
                    <button key={r} onClick={()=>toggleRes(r)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-all ${form.res.includes(r)?'bg-blue-50 text--600 border-blue-200':'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-700 mb-1 block">Notes (optional)</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2}
                  placeholder="Additional instructions..."
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-blue-200"/>
              </div>
              <button onClick={dispatch}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-slate-900 font-black py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/40 text-sm active:scale-95">
                🚨 DISPATCH NOW
              </button>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text--600"/> Dispatch Log</h2>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {dispLog.map(d => (
                  <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text--600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{d.agency}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[d.priority]}`}>{d.priority}</span>
                      <span className={`text-xs font-bold ml-auto ${STATUS_STYLE[d.status]}`}>● {d.status.replace('_',' ')}</span>
                    </div>
                    <div className="text-sm text-slate-900 font-medium">{d.task} → {d.loc}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-700">{d.time}</span>
                      {d.status !== 'COMPLETED' && (
                        <button onClick={() => advanceStatus(d.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-purple-600/30 text--600 border border-purple-200 hover:bg-purple-600/50 transition-colors">
                          → Advance Status
                        </button>
                      )}
                      {d.status === 'COMPLETED' && <span className="text-xs text--600">✅ Completed</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* AI SITREP Generator */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-indigo-200 p-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text--600"/> AI SITREP Generator — GARUD Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-700 mb-1 block">Date</label>
                <input value={sitrepDate} onChange={e=>setSitrepDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-200"/>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-700 mb-1 block">Reporting Officer</label>
                <input value={officer} onChange={e=>setOfficer(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-200"/>
              </div>
            </div>
            <button onClick={generateSitrep} disabled={sitrepLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-slate-900 font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm shadow-lg shadow-indigo-900/40 mb-4">
              {sitrepLoading ? '⏳ Generating SITREP with GARUD AI...' : '⚡ Generate Official SITREP with GARUD AI'}
            </button>
            {sitrep && (
              <>
                <div ref={sitrepRef}
                  className="bg-white border border-slate-200 rounded-xl p-4 max-h-72 overflow-y-auto text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                  {sitrep}
                </div>
                <div className="flex gap-3 mt-3">
                  <button onClick={copyToClipboard} className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-600 text-slate-900 rounded-xl transition-colors">📋 Copy</button>
                  <button onClick={() => window.print()} className="px-4 py-2 text-sm bg-slate-200 hover:bg-slate-600 text-slate-900 rounded-xl transition-colors">🖨️ Print</button>
                </div>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
