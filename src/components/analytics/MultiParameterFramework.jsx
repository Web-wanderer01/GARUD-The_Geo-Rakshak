import React from 'react';
import { Layers, TrendingUp, TrendingDown, Activity, CloudRain, Mountain, CloudLightning, Droplets, Waves, Minimize2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MultiParameterFramework() {
  const twentyYearData = [
    { year: '2004', rainfall: 2100, landslides: 45, seismic: 12 },
    { year: '2008', rainfall: 2350, landslides: 60, seismic: 18 },
    { year: '2012', rainfall: 2600, landslides: 75, seismic: 22 },
    { year: '2016', rainfall: 3100, landslides: 95, seismic: 30 },
    { year: '2020', rainfall: 3450, landslides: 120, seismic: 45 },
    { year: '2024', rainfall: 3900, landslides: 156, seismic: 65 },
    // AI Predictions
    { year: '2028 (Pred)', rainfall: 4200, landslides: 180, seismic: 70, isPrediction: true },
    { year: '2032 (Pred)', rainfall: 4600, landslides: 210, seismic: 85, isPrediction: true },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">20-Year Risk Progression Analysis</h2>
            <p className="text-sm text-slate-500">Historical Comparison & AI Predictive Modeling (2004 - 2032)</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-semibold mb-1">Landslide Frequency</p>
            <h3 className="text-3xl font-bold text-red-900">+246%</h3>
            <p className="text-xs text-red-500 mt-1">Since 2004 baseline</p>
          </div>
          <Mountain className="w-12 h-12 text-red-200" />
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-1">Avg Annual Rainfall</p>
            <h3 className="text-3xl font-bold text-blue-900">+85%</h3>
            <p className="text-xs text-blue-500 mt-1">Extreme weather events</p>
          </div>
          <CloudRain className="w-12 h-12 text-blue-200" />
        </div>
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-semibold mb-1">Seismic Activity (Mag &gt; 4.0)</p>
            <h3 className="text-3xl font-bold text-purple-900">+441%</h3>
            <p className="text-xs text-purple-500 mt-1">Fault-line sensitivity</p>
          </div>
          <Activity className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graph 1 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4 text-center">Landslide vs Seismic Growth</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={twentyYearData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="landslides" name="Landslides" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="seismic" name="Seismic Events" stroke="#9333ea" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4 text-center">Rainfall Intensity (mm/year)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={twentyYearData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="year" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#2563eb" fillOpacity={1} fill="url(#colorRain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-2">
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
           <Layers className="w-5 h-5 text-blue-600" />
           The 6-Parameter AI Risk Formula
        </h3>
        <p className="text-sm text-slate-500">How our geospatial engine calculates landslide probability in the North East.</p>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <ParameterCard 
           title="1. Rainfall Intensity (24h)"
           desc="Heavy prolonged monsoon downpours are the primary trigger for landslides in the NER. Saturated soils lose their sheer strength, and high-intensity rainfall rapidly increases pore water pressure within the slope."
           icon={CloudLightning}
           imgUrl="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
         />
         
         <ParameterCard 
           title="2. Soil Moisture & Saturation"
           desc="High antecedent soil moisture weakens the internal friction of the earth. When soil reaches its liquid limit due to continuous precipitation, the material transforms into a viscous mass, causing debris flows."
           icon={Droplets}
           imgUrl="https://images.unsplash.com/photo-1728114553153-80744d22cb67?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-amber-700 to-slate-900"
         />
         
         <ParameterCard 
           title="3. Slope Angle & Topography"
           desc="The steepness of the terrain directly correlates with gravitational sheer stress. In the mountainous regions of Assam, Sikkim, and Meghalaya, slopes exceeding 35 degrees are naturally predisposed to catastrophic failure."
           icon={Mountain}
           imgUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-emerald-700 to-slate-900"
         />
         
         <ParameterCard 
           title="4. River Proximity & Toe Erosion"
           desc="Fast-flowing rivers like the Brahmaputra continuously undercut the base (toe) of adjacent hillsides. This toe erosion removes structural support, eventually causing massive chunks of land to collapse into the river."
           icon={Waves}
           imgUrl="https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-cyan-700 to-slate-900"
         />
         
         <ParameterCard 
           title="5. Stream Narrowing & Blockage"
           desc="Natural or artificial constriction of drainage channels forces water to back up or carve new destructive paths. Blockages lead to flash floods that rapidly erode the surrounding hillside, creating unpredictable events."
           icon={Minimize2}
           imgUrl="https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-indigo-700 to-slate-900"
         />
         
         <ParameterCard 
           title="6. Seismic Activity (Zone V)"
           desc="The entire North Eastern Region lies in Seismic Zone V, the highest risk zone in India. Tectonic tremors fracture the bedrock and loosen the topsoil, acting as a powerful catalyst for landslides on saturated slopes."
           icon={Activity}
           imgUrl="https://images.unsplash.com/photo-1647125849914-5238985ab21a?auto=format&fit=crop&q=80&w=800"
           gradient="bg-gradient-to-br from-orange-700 to-slate-900"
         />
      </div>
    </div>
  );
}

const ParameterCard = ({ title, desc, icon: Icon, imgUrl, gradient }) => {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all">
       <div className={`h-36 overflow-hidden relative ${gradient} flex items-center justify-center`}>
         {!imgError && imgUrl ? (
           <img 
             src={imgUrl} 
             alt={title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
             onError={() => setImgError(true)}
           />
         ) : (
           Icon && <Icon className="w-16 h-16 text-white opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none"></div>
       </div>
       <div className="p-5 flex-1 bg-white">
         <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
         <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
};
