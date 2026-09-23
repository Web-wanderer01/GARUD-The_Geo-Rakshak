const fs = require('fs');
let text = fs.readFileSync('src/components/analytics/MultiParameterFramework.jsx', 'utf8');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800\"', 'icon={CloudLightning}');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800\"', 'icon={Droplets}');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800\"', 'icon={Mountain}');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800\"', 'icon={Waves}');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800\"', 'icon={Minimize2}');
text = text.replace('imgUrl=\"https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800\"', 'icon={Activity}');

const newCard = \const ParameterCard = ({ title, desc, icon: Icon, gradient }) => {
  return (
    <div className=\"bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all\">
       <div className={\\\h-36 overflow-hidden relative \ flex items-center justify-center\\\}>
         {Icon && <Icon className=\"w-16 h-16 text-white opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700\" />}
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

