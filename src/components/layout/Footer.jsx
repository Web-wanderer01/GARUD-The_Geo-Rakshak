import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1e3e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">About</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>GARUD - THE GEO RAKSHAK</strong><br/>
              AI-Based Early Warning &amp; Landslide Risk Monitoring System for India's North Eastern Region.
              Developed under the National Disaster Management Authority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Risk Dashboard', path: '/map' },
                { name: 'Active Alerts', path: '/alerts' },
                { name: 'Logistics Operations', path: '/logistics' },
                { name: 'Virtual Simulations', path: '/demo' },
                { name: 'Field Report', path: '/reporting' },
                { name: 'Emergency Contacts', path: '/emergency' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">GovTech Integrations</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { name: 'Data.gov.in (OGD)', url: 'https://data.gov.in' },
                { name: 'API Setu (Live Telemetry)', url: 'https://apisetu.gov.in' },
                { name: 'Bhashini (Language Mission)', url: 'https://bhashini.gov.in' },
                { name: 'NDMA India', url: 'https://ndma.gov.in' },
                { name: 'IMD Weather', url: 'https://mausam.imd.gov.in' },
              ].map(link => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1">
                    {link.name} <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3">Emergency Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                Emergency Helpline: <strong className="text-white">1078</strong>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                NDRF: <strong className="text-white">011-24363260</strong>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                helpdesk@ner-landslide.gov.in
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                NDMA Bhawan, New Delhi
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#071428] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2026 National Disaster Management Authority, Government of India</p>
          <p>⚠ Prototype — simulated data for demonstration only</p>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="h-1 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </footer>
  );
}
