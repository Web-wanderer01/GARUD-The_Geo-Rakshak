import { Phone, MapPin, Cross, Radio, Shield, AlertTriangle, Building2, Clock, ExternalLink } from 'lucide-react';

const nationalHelplines = [
  { label: 'National Emergency Number', number: '112', desc: 'Police, Fire & Ambulance — works 24/7' },
  { label: 'NDMA Disaster Helpline', number: '1078', desc: 'National Disaster Management Authority' },
  { label: 'Ambulance (Medical)', number: '108', desc: 'Free emergency ambulance service' },
  { label: 'NDRF Control Room', number: '011-24363260', desc: 'National Disaster Response Force' },
  { label: 'IMD Weather Helpline', number: '1800-180-1717', desc: 'India Meteorological Department (Toll-free)' },
  { label: 'Railway Helpline', number: '139', desc: 'For stranded passengers on blocked rail lines' },
  { label: 'Gas Leak Emergency', number: '1906', desc: 'Report gas pipeline damage post-disaster' },
];

const stateContacts = [
  { state: 'Assam', number: '1070 / 1079', agency: 'Assam SEOC (Dispur)', color: 'red' },
  { state: 'Meghalaya', number: '1070', agency: 'Meghalaya SDMA (Shillong)', color: 'orange' },
  { state: 'Manipur', number: '1070', agency: 'Relief & Disaster Management (Imphal)', color: 'yellow' },
  { state: 'Mizoram', number: '1070', agency: 'Disaster Management & Rehabilitation (Aizawl)', color: 'green' },
  { state: 'Nagaland', number: '1070', agency: 'SEOC Nagaland (Kohima)', color: 'teal' },
  { state: 'Tripura', number: '1070', agency: 'Revenue (Relief & Disaster Management), Agartala', color: 'blue' },
  { state: 'Arunachal Pradesh', number: '1070', agency: 'Dept of Disaster Management (Itanagar)', color: 'indigo' },
  { state: 'Sikkim', number: '1070', agency: 'Land Revenue & Disaster Management (Gangtok)', color: 'purple' },
];

const ndrf = [
  { battalion: '1st NDRF', location: 'Guwahati, Assam', coverage: 'Assam, Meghalaya, Tripura' },
  { battalion: '12th NDRF', location: 'Itanagar, Arunachal', coverage: 'Arunachal Pradesh, Nagaland' },
  { battalion: '6th NDRF', location: 'Kolkata, West Bengal', coverage: 'Sikkim (back-up)' },
  { battalion: 'IAF Air Rescue', location: 'Jorhat Air Station', coverage: 'All NER States (aerial)' },
];

const dosDonts = {
  dos: [
    'Call 112 immediately in a life-threatening situation.',
    'Keep your phone charged and power banks handy during monsoon.',
    'Share your GPS location with rescuers when calling for help.',
    'Save all emergency numbers in your phone as offline contacts.',
    'Listen to community radio for evacuation orders in low-network areas.',
  ],
  donts: [
    'Do not block emergency lines with non-urgent calls.',
    'Do not share unverified emergency news on social media.',
    'Do not attempt self-rescue in active landslide zones.',
    'Do not re-enter your home until authorities declare it safe.',
    'Do not rely solely on internet — download offline GARUD data.',
  ],
};

export default function EmergencyContactsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mb-20 space-y-10">

      {/* Header */}
      <div className="bg-red-700 text-white rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Emergency Contacts & Resources</h1>
            <p className="text-red-200 text-sm mt-0.5">North Eastern Region — All 8 States</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div className="bg-white/15 rounded-lg p-3">
            <div className="text-3xl font-extrabold">112</div>
            <div className="text-xs text-red-200 mt-1">National Emergency</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3">
            <div className="text-3xl font-extrabold">1078</div>
            <div className="text-xs text-red-200 mt-1">NDMA Helpline</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3">
            <div className="text-3xl font-extrabold">108</div>
            <div className="text-xs text-red-200 mt-1">Ambulance</div>
          </div>
        </div>
      </div>

      {/* National Helplines */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center gap-2 font-bold text-lg">
          <Phone className="w-5 h-5" /> National Emergency Helplines (24×7)
        </div>
        <div className="divide-y divide-slate-100">
          {nationalHelplines.map((h, i) => (
            <div key={i} className="px-6 py-4 flex justify-between items-center gap-4">
              <div>
                <div className="font-semibold text-slate-900 text-sm">{h.label}</div>
                <div className="text-xs text-slate-700 mt-0.5">{h.desc}</div>
              </div>
              <a
                href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
                className="text-2xl font-extrabold text-red-600 hover:text--600 transition-colors whitespace-nowrap"
              >
                {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* State-wise Control Rooms */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" /> State Disaster Control Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stateContacts.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex justify-between items-start gap-3 hover:border-blue-300 transition-colors">
              <div>
                <div className="font-bold text-slate-900">{c.state}</div>
                <div className="text-xs text-slate-700 mt-0.5">{c.agency}</div>
              </div>
              <a
                href={`tel:1070`}
                className="text-xl font-extrabold text--600 hover:text-blue-800"
              >
                {c.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* NDRF Deployments */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-blue-700 text-white px-6 py-4 flex items-center gap-2 font-bold text-lg">
          <Shield className="w-5 h-5" /> NDRF & Rescue Force Deployments in NER
        </div>
        <div className="divide-y divide-slate-100">
          {ndrf.map((n, i) => (
            <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <div className="font-semibold text-slate-900">{n.battalion}</div>
                <div className="text-xs text-slate-700">{n.coverage}</div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-blue-600">
                <MapPin className="w-4 h-4" />
                <span>{n.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dos and Donts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Do's During an Emergency
          </h3>
          <ul className="space-y-3">
            {dosDonts.dos.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Don'ts During an Emergency
          </h3>
          <ul className="space-y-3">
            {dosDonts.donts.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Useful Links */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-slate-700" /> Official Government Resources
        </h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {[
            { label: 'NDMA Official Site', url: 'https://ndma.gov.in' },
            { label: 'IMD Weather Portal', url: 'https://mausam.imd.gov.in' },
            { label: 'ISRO Bhuvan GIS', url: 'https://bhuvan.nrsc.gov.in' },
            { label: 'National Landslide Hazard Management', url: 'https://nidm.gov.in' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-white border border-slate-200 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
