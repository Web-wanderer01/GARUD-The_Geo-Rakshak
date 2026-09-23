const fs = require('fs');

const header = `import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { LiveDataContext } from '../../contexts/LiveDataContext';
import { alerts } from '../../data/alerts';

export default function Header() {
  const { isLiveConnected } = useContext(LiveDataContext) || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [liveAlertBadge, setLiveAlertBadge] = useState(alerts.filter(a => a.severity === 'critical').length);
  const location = useLocation();

  useEffect(() => {
    const i = setInterval(() => setLiveAlertBadge(c => Math.max(1, c + (Math.random() > 0.85 ? 1 : 0))), 6000);
    return () => clearInterval(i);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Satellite Map', path: '/map' },
    { name: 'Predictive Analytics', path: '/analytics' },
    { name: 'Operations', path: '/operations' },
    { name: 'NDRF Logistics', path: '/logistics' },
    { name: 'Citizen Database', path: '/database' },
    { name: 'Simulation Demo', path: '/demo' },
    { name: 'About & Emergency', path: '/about' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header>
      {/* Indian tricolor stripe */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Top utility bar */}
      <div className="bg-gov-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">???? ????? | Government of India</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Ministry of Earth Sciences</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={"flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full " + (isLiveConnected ? "text-green-400" : "text-amber-400")}>
              <span className={"w-1.5 h-1.5 rounded-full animate-pulse " + (isLiveConnected ? "bg-green-400" : "bg-amber-400")}></span>
              {isLiveConnected ? "LIVE" : "DEMO"}
            </span>
          </div>
        </div>
      </div>

      {/* Main header with branding */}
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

      {/* Navigation bar */}
      <nav className="bg-gov-600 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex justify-between items-center w-full">
            <div className="flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={"px-4 py-2.5 text-sm font-medium transition-colors border-b-2 relative " + (
                    isActive(link.path)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-transparent text-blue-100 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.name}
                  {link.path === '/alerts' && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded-full leading-none animate-pulse">
                      {liveAlertBadge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center justify-between py-2.5">
            <span className="text-sm font-medium text-blue-100">Navigation Menu</span>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 text-blue-100 hover:text-white">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gov-700 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-2 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={"block px-3 py-2 text-sm rounded " + (
                    isActive(link.path)
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-blue-200 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
`;

fs.writeFileSync('src/components/layout/Header.jsx', header);
console.log('Header rewritten cleanly!');
