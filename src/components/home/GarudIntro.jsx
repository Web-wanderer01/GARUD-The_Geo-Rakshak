import { useState, useEffect } from 'react';
import FadeIn from '../common/FadeIn';
import { Shield } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1600&q=80',
    title: 'A Region Under Constant Threat.',
    subtext: 'The North Eastern Region faces relentless threats from devastating landslides. Every monsoon brings unprecedented challenges to life and infrastructure.'
  },
  {
    image: 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?auto=format&fit=crop&w=1600&q=80',
    title: 'Traditional Monitoring Is Not Enough.',
    subtext: 'Reacting after a disaster is too late. We need real-time data, predictive meteorological intelligence, and rapid dissemination.'
  },
  {
    image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=1600&q=80',
    title: 'GARUD - THE GEO RAKSHAK',
    subtext: 'AI-Based Early Warning & Landslide Risk Monitoring System. Protecting lives through real-time technology and predictive analytics.'
  }
];

export default function GarudIntro() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-gov-900 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with slow zoom effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gov-900/80 bg-gradient-to-t from-gov-900 via-gov-900/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
            {index === current && (
              <>
                {index === 2 && (
                  <FadeIn delay={100} className="mb-4">
                    <Shield className="w-16 h-16 text-blue-400 mx-auto" />
                  </FadeIn>
                )}
                <FadeIn delay={300} className="mb-6">
                  <h2 className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight ${
                    index === 2 ? 'text-blue-400 drop-shadow-lg' : 'text-white'
                  }`}>
                    {slide.title}
                  </h2>
                </FadeIn>
                <FadeIn delay={700}>
                  <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                    {slide.subtext}
                  </p>
                </FadeIn>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-blue-400 w-10' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
