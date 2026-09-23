import { User, Mail, Phone, MapPin, Shield, Activity, FileText } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';

export default function ProfilePage() {
  return (
    <div className="page-enter max-w-7xl mx-auto p-4 md:p-8">
      <FadeIn direction="down">
        <h1 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-700" />
          Official Personnel Profile
        </h1>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Official Smart Card Profile */}
        <div className="lg:col-span-1 space-y-6">
          <FadeIn delay={100}>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200 p-1">
              {/* Card Hologram / Pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Official Header */}
              <div className="bg-white rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <Shield className="w-8 h-8 text--600" />
                  <div>
                    <div className="text-slate-900 font-bold tracking-widest text-xs">GOVERNMENT OF INDIA</div>
                    <div className="text-blue-200 text-[10px] tracking-wider font-semibold">NDMA • GARUD NETWORK</div>
                  </div>
                </div>
              </div>

              {/* Photo & Details */}
              <div className="p-6 relative">
                {/* Embedded Chip Mock */}
                <div className="absolute top-6 right-6 w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600/50 flex flex-col justify-between p-1 opacity-90 shadow-inner">
                  <div className="w-full h-px bg-yellow-700/30"></div>
                  <div className="w-full h-px bg-yellow-700/30"></div>
                  <div className="w-full h-px bg-yellow-700/30"></div>
                </div>

                <div className="flex gap-5 mb-6 mt-2">
                  <div className="w-24 h-32 bg-slate-200 rounded-lg border-2 border-slate-300 shadow-sm overflow-hidden flex items-center justify-center relative">
                    {/* Placeholder Photo */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-300"></div>
                    <User className="w-12 h-12 text-slate-700 relative z-10" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h2 className="text-xl font-extrabold text-slate-900 leading-none mb-1 uppercase tracking-tight">DR. A. SHARMA</h2>
                    <p className="text-sm font-bold text-blue-700 uppercase mb-4 tracking-wider">Senior Geologist</p>
                    <div className="space-y-1 text-xs font-semibold">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-700">ID NO</span>
                        <span className="text-slate-900">GRD-4029-X</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-700">CLEARANCE</span>
                        <span className="text-slate-900">LEVEL 4</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-700">BLOOD</span>
                        <span className="text-red-600">O+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Barcode */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <div className="w-full h-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/UPC-A-036000291452.svg')] bg-repeat-x bg-contain opacity-50 filter grayscale"></div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-700" /> Active Assignment
              </h3>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span>Primary Zone</span>
                  <span className="text-slate-900 font-bold">Assam</span>
                </li>
                <li className="flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span>Secondary Zone</span>
                  <span className="text-slate-900 font-bold">Meghalaya</span>
                </li>
                <li className="flex items-center justify-between text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span>Status</span>
                  <span className="inline-flex items-center gap-1.5 text--600 bg-green-100 px-2 py-0.5 rounded font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> On Duty
                  </span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        {/* Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={300}>
            <div className="gov-card">
              <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Recent Activity Log</h3>
              <div className="space-y-4">
                {[
                  { action: 'Issued Critical Alert for East Khasi Hills', time: '2 hours ago', type: 'alert' },
                  { action: 'Updated soil moisture parameters for Kamrup district', time: '5 hours ago', type: 'system' },
                  { action: 'Reviewed and verified field report #4829', time: '1 day ago', type: 'report' },
                  { action: 'Exported Monthly Risk Analysis CSV', time: '2 days ago', type: 'system' },
                  { action: 'Logged in from Guwahati Command Center', time: '2 days ago', type: 'auth' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 border-slate-200 pl-4 py-1 relative">
                    <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-2.5 border-2 border-white"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{log.action}</p>
                      <p className="text-xs text-slate-700 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-blue-700 hover:text-slate-900 font-medium">View Full Audit Log →</button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FadeIn delay={400}>
              <div className="gov-card bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-blue-700" />
                  <h4 className="font-bold text-slate-900">System Uptime</h4>
                </div>
                <p className="text-2xl font-bold text-slate-900">99.98%</p>
                <p className="text-xs text-slate-700 mt-1">Under your monitoring shift</p>
              </div>
            </FadeIn>
            <FadeIn delay={500}>
              <div className="gov-card bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <h4 className="font-bold text-slate-900">Reports Verified</h4>
                </div>
                <p className="text-2xl font-bold text-slate-900">142</p>
                <p className="text-xs text-slate-700 mt-1">In the last 30 days</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
