const fs = require('fs');
let text = fs.readFileSync('src/components/analytics/MultiParameterFramework.jsx', 'utf8');

text = text.replace('title=\"1. Rainfall Intensity (24h)\"\\n           desc=\"Heavy prolonged', 'title=\"1. Rainfall Intensity (24h)\"\\n           imgUrl=\"https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"Heavy prolonged');
text = text.replace('title=\"2. Soil Moisture & Saturation\"\\n           desc=\"High antecedent', 'title=\"2. Soil Moisture & Saturation\"\\n           imgUrl=\"https://images.unsplash.com/photo-1579781354186-091d798fdc9e?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"High antecedent');
text = text.replace('title=\"3. Slope Angle & Topography\"\\n           desc=\"The steepness', 'title=\"3. Slope Angle & Topography\"\\n           imgUrl=\"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"The steepness');
text = text.replace('title=\"4. River Proximity & Toe Erosion\"\\n           desc=\"Fast-flowing', 'title=\"4. River Proximity & Toe Erosion\"\\n           imgUrl=\"https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"Fast-flowing');
text = text.replace('title=\"5. Stream Narrowing & Blockage\"\\n           desc=\"Natural or', 'title=\"5. Stream Narrowing & Blockage\"\\n           imgUrl=\"https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"Natural or');
text = text.replace('title=\"6. Seismic Activity (Zone V)\"\\n           desc=\"The entire', 'title=\"6. Seismic Activity (Zone V)\"\\n           imgUrl=\"https://images.unsplash.com/photo-1612093510526-9f79bbaf9d40?auto=format&fit=crop&q=80&w=800\"\\n           desc=\"The entire');

const newCard = \const ParameterCard = ({ title, desc, icon: Icon, imgUrl, gradient }) => {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div className=\"bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all\">
       <div className={\\\h-36 overflow-hidden relative \ flex items-center justify-center\\\}>
         {!imgError && imgUrl ? (
           <img 
             src={imgUrl} 
             alt={title} 
             className=\"w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90\" 
             onError={() => setImgError(true)}
           />
         ) : (
           Icon && <Icon className=\"w-16 h-16 text-white opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700\" />
         )}
         <div className=\"absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none\"></div>
       </div>
       <div className=\"p-5 flex-1 bg-white\">
         <h3 className=\"text-sm font-bold text-slate-800 mb-2\">{title}</h3>
         <p className=\"text-xs text-slate-600 leading-relaxed\">{desc}</p>
       </div>
    </div>
  );
};\;

const oldCardStart = text.indexOf('const ParameterCard =');
text = text.substring(0, oldCardStart) + newCard;
fs.writeFileSync('src/components/analytics/MultiParameterFramework.jsx', text);

