import { FileText, Camera, Info } from 'lucide-react';
import FadeIn from '../common/FadeIn';

export default function HistoricalImpact() {
  const cases = [
    {
      title: 'Brahmaputra Valley Floods (Assam)',
      image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=800&q=80',
      description: 'The Brahmaputra river system is prone to extreme seasonal flooding. Annual monsoon rains cause the river and its tributaries to breach embankments, displacing millions and causing widespread agricultural destruction. The 2020 floods alone affected over 5 million people across 30 districts.'
    },
    {
      title: 'Teesta River Flash Floods (Sikkim)',
      image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80',
      description: 'In October 2023, a glacial lake outburst flood (GLOF) at South Lhonak Lake severely impacted the Teesta River basin. The disaster washed away the Chungthang dam, bridges, and highway stretches, cutting off northern Sikkim and causing tragic loss of life and infrastructure.'
    },
    {
      title: 'Monsoon Landslides (Meghalaya & Manipur)',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      description: 'The steep topography and heavy rainfall (especially in Cherrapunji/Mawsynram) trigger frequent landslides. In 2022, a devastating landslide in Tupul, Manipur at a railway construction site resulted in numerous casualties, highlighting the extreme vulnerability of infrastructure in the region.'
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-gov-700" />
        <h4 className="text-lg font-bold text-slate-800">Ground Reality: The Scale of Destruction</h4>
      </div>
      
      <p className="text-sm text-slate-600 mb-6 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        The North Eastern Region (NER) of India is geologically young and highly susceptible to geo-environmental hazards. 
        High seismic activity combined with intense monsoon rainfall makes the terrain extremely fragile. 
        Below is a brief overview of recent catastrophic events that necessitate a real-time early warning system like GARUD.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {cases.map((item, idx) => (
          <FadeIn key={idx} delay={idx * 150} className="h-full">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full group hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Archive
                </div>
                {/* Gradient overlay for text readability if we wanted text over image, but we put it below */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h5 className="font-bold text-sm text-slate-800 mb-2 flex items-start gap-2 leading-snug">
                  <FileText className="w-4 h-4 text-gov-600 flex-shrink-0 mt-0.5" />
                  {item.title}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
