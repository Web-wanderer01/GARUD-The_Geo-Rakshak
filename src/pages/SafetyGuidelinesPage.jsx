import { Shield, AlertTriangle, CheckCircle, Info, PackageOpen, Home, Wind, Droplets, Flame, Users, Stethoscope, Phone } from 'lucide-react';

const beforeTips = [
  'Learn if your home is in a landslide-prone zone using the GARUD Risk Map.',
  'Identify cracks in streets, foundations, or on slopes near your home.',
  'Ensure proper drainage channels around your house to prevent water accumulation.',
  'Do not build houses on steep slopes, near drainage paths, or river banks.',
  'Keep an emergency kit ready with essentials (see checklist below).',
  'Have a family evacuation plan and designate a safe meeting point.',
  'Monitor GARUD alerts, local radio, and IMD weather forecasts during monsoon.',
  'Plant trees and vegetation on slopes near your property to stabilize soil.',
];

const duringTips = [
  'Stay alert at all times. Many deaths occur while people are sleeping.',
  'If you hear unusual sounds — trees cracking, boulders knocking — move away immediately.',
  'Do not attempt to cross a flowing mudslide, debris flow, or flooded river.',
  'If inside, move to the uphill side of your building, away from windows and doors.',
  'If trapped, curl into a tight ball, protect your head, and make noise to attract rescuers.',
  'If outdoors, run to the nearest high ground in a direction perpendicular to the flow path.',
  'Avoid low-lying areas, valleys, and drainage channels.',
  'After reaching safety, call 112 or 1078 immediately.',
];

const afterTips = [
  'Stay away from the slide area; secondary slides are very common.',
  'Listen for emergency broadcasts. Do not return home until authorities declare it safe.',
  'Check for injured and trapped persons near the slide without entering the direct danger area.',
  'Report broken utility lines, gas leaks, and damaged road/bridges to authorities.',
  'Use the GARUD "Report an Incident" form to log your field observation with photos.',
  'Boil all drinking water — post-disaster contamination is a serious risk.',
  'Document all property damage with photos for insurance and government relief claims.',
  'Replant damaged slopes as soon as possible to prevent future erosion and flooding.',
];

const kitItems = [
  { item: 'Water (min. 3 litres/person/day for 3 days)', icon: Droplets },
  { item: 'Non-perishable food (energy bars, canned goods)', icon: Flame },
  { item: 'Battery-operated or hand-crank radio', icon: Wind },
  { item: 'Flashlight with extra batteries / power bank', icon: Wind },
  { item: 'First-aid kit with prescription medications', icon: Stethoscope },
  { item: 'Whistle to signal for help if trapped', icon: Users },
  { item: 'Dust mask and plastic sheeting', icon: Home },
  { item: 'Waterproof bag with important documents (Aadhaar, passports, insurance)', icon: PackageOpen },
  { item: 'Cash in small denominations', icon: PackageOpen },
  { item: 'Warm clothes, sturdy shoes, rain poncho', icon: Home },
];

const warningImages = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Landslide_at_Aranayake%2C_Sri_Lanka_2016.jpg/640px-Landslide_at_Aranayake%2C_Sri_Lanka_2016.jpg',
    alt: 'A major landslide burying homes in a hilly region',
    caption: 'Active landslide flow engulfing houses in a hilly terrain',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Landslide_in_Uttarakhand_India_2013.jpg/640px-Landslide_in_Uttarakhand_India_2013.jpg',
    alt: 'Landslide debris blocking a mountain highway in Uttarakhand',
    caption: 'Mountain highway completely blocked by landslide debris — a common sight in NER',
  },
];

export default function SafetyGuidelinesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 mb-20 space-y-10">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Shield className="w-7 h-7 text-orange-600" /> Safety Guidelines for Landslides & Floods
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <div className="flex gap-3">
            <Info className="w-6 h-6 text--600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 leading-relaxed">
              Landslides occur when masses of rock, earth, or debris move down a slope — often triggered by heavy rainfall, earthquakes, or human activities. The North Eastern Region receives some of the world's highest annual rainfall, making it one of India's most landslide-vulnerable zones. <strong>Following these NDMA-approved guidelines can save your life.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warningImages.map((img, i) => (
          <figure key={i} className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-48 object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <figcaption className="bg-slate-50 px-4 py-2 text-xs text-slate-700 italic">{img.caption}</figcaption>
          </figure>
        ))}
      </div>

      {/* Warning Signs */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Warning Signs — Evacuate Immediately If You See These
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text--600">
          {[
            'New cracks or bulging in the ground, walls, or road surface',
            'Leaning trees, telephone poles, or fence posts',
            'Sudden change in stream water colour (turns brown/muddy)',
            'Unusual sounds: cracking trees, rumbling, or boulders rolling',
            'Water suddenly breaking through the ground in new places',
            'Doors or windows stick unexpectedly (frames may be warping)',
          ].map((sign, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span>{sign}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Three Phases */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-orange-500 px-6 py-4 flex items-center gap-2 text-white font-bold text-lg">
            <AlertTriangle className="w-5 h-5" /> Before a Landslide — Be Prepared
          </div>
          <ul className="divide-y divide-slate-100">
            {beforeTips.map((tip, i) => (
              <li key={i} className="px-6 py-3 text-sm text-slate-700 flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-red-600 px-6 py-4 flex items-center gap-2 text-white font-bold text-lg">
            <AlertTriangle className="w-5 h-5" /> During a Landslide — Act Immediately
          </div>
          <ul className="divide-y divide-slate-100">
            {duringTips.map((tip, i) => (
              <li key={i} className="px-6 py-3 text-sm text-slate-700 flex items-start gap-3">
                <span className="text-red-600 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-600 px-6 py-4 flex items-center gap-2 text-white font-bold text-lg">
            <CheckCircle className="w-5 h-5" /> After a Landslide — Recover Safely
          </div>
          <ul className="divide-y divide-slate-100">
            {afterTips.map((tip, i) => (
              <li key={i} className="px-6 py-3 text-sm text-slate-700 flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Kit */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <PackageOpen className="w-5 h-5 text-purple-600" /> Emergency Preparedness Kit Checklist
        </h3>
        <p className="text-sm text-slate-700 mb-4">Prepare this kit before monsoon season and keep it accessible. Replace food/water every 6 months.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kitItems.map(({ item, icon: Icon }, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="mt-0.5 accent-green-600 flex-shrink-0" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-800 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Know your risk zone right now</h3>
          <p className="text-slate-300 text-sm mt-1">Use the GARUD Risk Dashboard to check your district's current landslide risk score and receive real-time alerts.</p>
        </div>
        <a href="/map" className="flex-shrink-0 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
          View Live Risk Map →
        </a>
      </div>
    </div>
  );
}
