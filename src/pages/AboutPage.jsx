import { useEffect, useState } from 'react';
import { ChevronRight, Shield, Target, Activity, Cpu, Globe, Users, BarChart3, Zap, Database, Radio, Map, Lightbulb, Workflow, Scale, AlertTriangle, Leaf, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';


const techStack = [
  { name: 'AI Risk Engine', desc: 'Rule-based ensemble scoring model using 4 geophysical parameters with 15-min update cycles', icon: Cpu, color: 'blue' },
  { name: 'GIS Mapping', desc: 'Interactive Leaflet maps with real-time CircleMarker overlays for 50+ monitored zones across NER', icon: Map, color: 'green' },
  { name: 'Alert Dispatch', desc: 'Multi-channel alert system covering SMS (MSG91), push notifications, and radio broadcast in 5 languages', icon: Radio, color: 'red' },
  { name: 'Field Reporting', desc: 'Geolocation-enabled mobile-first forms for field officers, with offline queuing via IndexedDB', icon: Globe, color: 'purple' },
  { name: 'Data Infrastructure', desc: 'Cloud-hosted PostgreSQL/PostGIS backend with AWS S3 for media, and CloudFront CDN for fast access', icon: Database, color: 'orange' },
  { name: 'Analytics', desc: 'Recharts-powered 7-day predictive forecasting and historical trend analysis for risk pattern identification', icon: BarChart3, color: 'cyan' },
];

const stats = [
  { label: 'States Monitored', value: '8', icon: Globe },
  { label: 'Risk Zones', value: '50+', icon: Map },
  { label: 'Languages Supported', value: '5', icon: Users },
  { label: 'Alert Channels', value: '3', icon: Zap },
];

const timeline = [
  { year: '2021', title: 'Concept & Research', desc: 'Detailed study of landslide patterns in NER, IMD data analysis, and stakeholder consultations with NDMA.' },
  { year: '2022', title: 'Prototype Development', desc: 'First working prototype of the risk-scoring engine and GIS dashboard developed and tested in Assam.' },
  { year: '2023', title: 'Multi-State Expansion', desc: 'Expanded monitoring coverage to all 8 NER states. Integration with IMD weather API and ISRO satellite feeds.' },
  { year: '2024', title: 'Field Reporting & Alerts', desc: 'Launched multilingual SMS alert system and geo-tagged field reporting module for ground truth data.' },
  { year: '2026', title: 'Smart Logistics Module', desc: 'Added AI-powered logistics intelligence: GPS fleet tracking, alternate route optimization, and supply chain gap analysis.' },
];

function LiveMissionStats() {
  const [stats, setStats] = useState({ zones: 54, uptime: 99.7, alerts: 1847, dispatches: 312 });
  useEffect(() => {
    const i = setInterval(() => setStats(s => ({
      zones: Math.max(50, Math.min(56, s.zones + (Math.random() > 0.7 ? 1 : 0))),
      uptime: Math.max(99.0, Math.min(100, s.uptime + (Math.random()-0.5)*0.1)),
      alerts: s.alerts + Math.floor(Math.random() * 2),
      dispatches: s.dispatches + (Math.random() > 0.9 ? 1 : 0)
    })), 4000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-mono">Live Platform Metrics</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { val: stats.zones, label: 'Zones Monitored', icon: '??', live: true },
            { val: stats.uptime.toFixed(1) + '%', label: 'System Uptime', icon: '?', live: true },
            { val: stats.alerts.toLocaleString(), label: 'Alerts Issued', icon: '??', live: true },
            { val: stats.dispatches, label: 'NDRF Dispatches', icon: '??', live: true },
          ].map(({ val, label, icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-black tabular-nums">{val}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mb-20 space-y-12">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-blue-900 text-white p-8 md:p-12">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Northeast_India_regions_map.png/640px-Northeast_India_regions_map.png"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display='none'; }}
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Government of India Emblem"
            className="h-24 brightness-0 invert opacity-80 flex-shrink-0"
          />
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">भारत सरकार | Government of India</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">GARUD — THE GEO RAKSHAK</h1>
            <p className="text-blue-100 leading-relaxed max-w-2xl">
              An AI-powered Smart Logistics &amp; Landslide Risk Intelligence Platform for India's North Eastern Region — providing real-time monitoring, predictive alerts, fleet tracking, and emergency coordination across 8 states.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm">
              <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-700 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Mission + Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text--600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Our Mission</h3>
          <p className="text-sm text-slate-700 leading-relaxed">To provide accurate, reliable, and timely early warnings to vulnerable communities, significantly reducing loss of life and property across India's most geologically active region.</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text--600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Real-time Monitoring</h3>
          <p className="text-sm text-slate-700 leading-relaxed">Continuous analysis of rainfall thresholds, soil moisture, and slope stability across 8 states using advanced predictive models updated every 15 minutes via satellite telemetry.</p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-6">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-orange-700" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Disaster Preparedness</h3>
          <p className="text-sm text-slate-700 leading-relaxed">Enhancing capacity building through data-driven insights, streamlined geo-tagged reporting, and AI-powered logistics coordination for immediate emergency response.</p>
        </div>
      </div>

      {/* Proposed Solution */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">Proposed solution</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">One intelligence layer from first signal to field response</h2>
          <p className="text-slate-700 leading-relaxed mt-3 max-w-4xl">
            GARUD combines satellite observations, rainfall and weather forecasts, IoT sensor readings, terrain data, citizen reports, and response logistics in one operational platform. It converts these signals into an explainable risk score, sends location-aware alerts, and helps authorised responders decide where to inspect, evacuate, and dispatch resources first.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Observe', text: 'Continuously ingest multi-source data and validate sensor, satellite, and field inputs.', icon: Radio, color: 'blue' },
            { title: 'Predict', text: 'Calculate zone-level risk using rainfall, soil moisture, slope, geology, and historical patterns.', icon: Activity, color: 'orange' },
            { title: 'Act', text: 'Coordinate multilingual warnings, evacuation routes, NDRF dispatches, and post-event reporting.', icon: Shield, color: 'green' },
          ].map(({ title, text, icon: Icon, color }) => (
            <div key={title} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-5`}>
              <Icon className={`w-7 h-7 text-${color}-700 mb-3`} />
              <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem fit and innovation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 text-white rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-300" />
            <h2 className="text-xl font-bold">How it addresses the problem</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {[
              'Moves response from reactive relief to measurable, location-specific preparedness.',
              'Works across remote terrain and patchy connectivity with offline field reporting and queued sync.',
              'Provides a common operating picture for communities, district officials, IMD partners, and NDRF teams.',
              'Makes every alert actionable with severity, evidence, affected roads, safe routes, and next steps.',
            ].map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />{item}</li>)}
          </ul>
        </section>
        <section className="bg-purple-50 border border-purple-200 rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text--600" />
            <h2 className="text-xl font-bold text-slate-900">Innovation and uniqueness</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Unlike a standalone map or alert feed, GARUD closes the loop between prediction and response. Its differentiator is a human-in-the-loop design: AI prioritises and explains risk, while trained officials validate evidence and make accountable decisions.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-purple-900">
            <div className="bg-white/70 rounded-lg p-3">Explainable risk scores</div>
            <div className="bg-white/70 rounded-lg p-3">Multilingual last-mile alerts</div>
            <div className="bg-white/70 rounded-lg p-3">Offline-first field workflows</div>
            <div className="bg-white/70 rounded-lg p-3">Risk-aware logistics routing</div>
          </div>
        </section>
      </div>

      {/* Methodology */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Workflow className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Methodology and implementation process</h2>
            <p className="text-sm text-slate-700">A phased, testable path from prototype to operational deployment.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            ['1', 'Baseline', 'Map hazards, stakeholders, historical events, and priority districts.'],
            ['2', 'Integrate', 'Connect certified weather, satellite, GIS, sensor, and field data sources.'],
            ['3', 'Model', 'Calibrate thresholds with local geology and validate predictions against ground truth.'],
            ['4', 'Pilot', 'Run drills with one district, measure alert lead time, accuracy, and adoption.'],
            ['5', 'Scale', 'Harden security, train operators, establish SLAs, and expand state by state.'],
          ].map(([step, title, text]) => (
            <div key={step} className="relative bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-sm mb-3">{step}</span>
              <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
          <strong>Flow:</strong> Observe data → validate quality → score risk → review by authorised officer → notify affected groups → coordinate response → capture outcome and improve the model.
        </div>
      </section>

      {/* Technology Stack */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-blue-600" /> Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div key={tech.name} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-lg bg-${tech.color}-100 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${tech.color}-700`} />
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feasibility and risk management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text--600" />
            <h2 className="text-xl font-bold text-slate-900">Feasibility analysis</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            <p><strong className="text-slate-900">Technical:</strong> The prototype already demonstrates mapping, analytics, alerts, reports, logistics, and offline-capable web delivery using mature open-source tools.</p>
            <p><strong className="text-slate-900">Operational:</strong> Role-based dashboards map to existing district and response workflows; phased pilots reduce training and change-management overhead.</p>
            <p><strong className="text-slate-900">Economic:</strong> Cloud-native deployment and open standards allow incremental investment, reuse of government data infrastructure, and lower field coordination costs.</p>
            <p><strong className="text-slate-900">Sustainability:</strong> Modular services, documented APIs, and measurable outcomes support long-term ownership by public agencies.</p>
          </div>
        </section>
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text--600" />
            <h2 className="text-xl font-bold text-slate-900">Challenges and mitigation</h2>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ['Sparse connectivity', 'Offline queues, SMS fallback, and low-bandwidth views.'],
              ['False alarms or missed events', 'Confidence bands, human approval, local calibration, and continuous validation.'],
              ['Data quality and interoperability', 'Schema contracts, sensor health checks, provenance, and API standards.'],
              ['Privacy and cyber risk', 'Data minimisation, encryption, RBAC, audit logs, and security testing.'],
            ].map(([risk, strategy]) => <p key={risk} className="text-slate-700"><strong className="text-slate-900">{risk}:</strong> {strategy}</p>)}
          </div>
        </section>
      </div>

      {/* Impact and benefits */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <Leaf className="w-6 h-6 text--600" />
          <h2 className="text-xl font-bold text-slate-900">Potential impact and benefits</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          <div><h3 className="font-bold text-slate-900 mb-1">For communities</h3><p className="text-slate-700">Earlier, clearer warnings in local languages, safer evacuation decisions, and improved access to verified emergency information.</p></div>
          <div><h3 className="font-bold text-slate-900 mb-1">For government</h3><p className="text-slate-700">Shared situational awareness, faster prioritisation, auditable decisions, and better allocation of rescue teams, roads, and supplies.</p></div>
          <div><h3 className="font-bold text-slate-900 mb-1">For the environment and economy</h3><p className="text-slate-700">Reduced disruption to roads and livelihoods, targeted infrastructure protection, and evidence for resilient land-use planning.</p></div>
        </div>
      </section>

      {/* References */}
      <section className="border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Reference and research links</h2>
        </div>
        <p className="text-sm text-slate-700 mb-4">The following public sources inform the prototype’s hazard, weather, governance, and language-access approach.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['NDMA India', 'National disaster management guidance and institutional context.', 'https://ndma.gov.in'],
            ['India Meteorological Department', 'Weather observations, forecasts, and warnings.', 'https://mausam.imd.gov.in'],
            ['ISRO / NRSC', 'Earth observation and geospatial research resources.', 'https://www.nrsc.gov.in'],
            ['India Disaster Resource Network', 'Disaster management resources and response context.', 'https://idrn.gov.in'],
            ['Data.gov.in', 'Open Government Data platform and dataset discovery.', 'https://data.gov.in'],
            ['Bhashini', 'National language technology mission for inclusive communication.', 'https://bhashini.gov.in'],
          ].map(([name, description, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <span><strong className="block text-sm text-slate-900">{name}</strong><span className="block text-xs text-slate-700 mt-1">{description}</span></span>
              <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            </a>
          ))}
        </div>
      </section>

      
      {/* Emergency Helplines Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text--600">National Emergency Helplines</h2>
            <p className="text-sm text-red-600 font-medium">Keep these numbers handy in case of severe disasters.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">National Emergency</span>
            <span className="text-3xl font-extrabold text-red-600">112</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">NDMA / Disaster</span>
            <span className="text-3xl font-extrabold text-red-600">1078</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">Police</span>
            <span className="text-3xl font-extrabold text-red-600">100</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">Fire Brigade</span>
            <span className="text-3xl font-extrabold text-red-600">101</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">Ambulance</span>
            <span className="text-3xl font-extrabold text-red-600">108</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">NDRF Control Room</span>
            <span className="text-3xl font-extrabold text-red-600">9711077372</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">Weather (IMD)</span>
            <span className="text-3xl font-extrabold text-red-600">1800220161</span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider text-slate-700 font-semibold mb-1">Women Helpline</span>
            <span className="text-3xl font-extrabold text-red-600">1091</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Platform Development Timeline</h2>
        <div className="relative border-l-2 border-blue-200 pl-6 space-y-6">
          {timeline.map((item) => (
            <div key={item.year} className="relative">
              <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{item.year}</span>
              <h4 className="font-semibold text-slate-900 mt-1">{item.title}</h4>
              <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <p className="text-sm text-amber-800">
          <strong>Prototype Notice:</strong> GARUD is currently a proof-of-concept prototype using simulated data for demonstration. All risk scores, alerts, and logistics data shown are synthetic and for illustrative purposes only. In a production deployment, all data would be sourced from certified government telemetry systems and IMD weather feeds.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          Emergency Facilities & Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-red-900 mb-2">NDRF Control Room</h3>
            <p className="text--600 font-mono text-lg mb-4">1078 / 112</p>
            <p className="text-sm text-red-600">National Disaster Response Force. Available 24x7 for rescue operations.</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Ambulance & Medical</h3>
            <p className="text--600 font-mono text-lg mb-4">108 / 102</p>
            <p className="text-sm text-blue-600">State Medical Emergency Services. Dial for immediate medical assistance.</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-amber-900 mb-2">State Disaster Authority</h3>
            <p className="text--600 font-mono text-lg mb-4">1070</p>
            <p className="text-sm text-amber-600">State specific disaster management helpline for localized assistance.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
