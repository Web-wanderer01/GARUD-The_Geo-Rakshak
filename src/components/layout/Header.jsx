import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Header() {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Satellite Map', path: '/map' },
    { name: 'Predictive Analytics', path: '/analytics' },
    { name: 'Operations', path: '/operations' },
    { name: 'NDRF Logistics', path: '/logistics' },
    { name: 'Citizen Database', path: '/database' },
    { name: 'Virtual Simulations', path: '/demo' },
    { name: 'IoT Sensors', path: '/iot' },
    { name: 'Strategic Upgrades', path: '/upgrades' },
    { name: 'About & Emergency', path: '/about' }
  ];

  return (
    <header>
      <div className="h-1.5 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="bg-gov-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">भारत सरकार | Government of India</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Earth Sciences</span>
          </div>
          <div className="flex items-center gap-4"><div id="google_translate_element" className="bg-white/10 rounded px-2"></div></div>
        </div>
      </div>

      <div className="bg-gov-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Government of India Emblem"
              className="h-12 w-auto brightness-0 invert opacity-90"
            />
            <div className="w-10 h-10 bg-white/10 rounded-full hidden sm:flex items-center justify-center border border-white/20 flex-shrink-0 ml-2">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] text-blue-200 tracking-wide uppercase font-semibold">National Disaster Management Authority</p>
              <h1 className="text-base sm:text-xl font-bold tracking-tight leading-tight uppercase">GARUD - THE GEO RAKSHAK</h1>
            </div>
          </Link>
        </div>
      </div>

      <nav className="bg-gov-600 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
