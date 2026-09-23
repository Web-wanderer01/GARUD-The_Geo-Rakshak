import { useState } from 'react';
import { Settings, Bell, Database, Save, User, Shield, Monitor } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [toggles, setToggles] = useState({
    sms: true,
    email: true,
    push: false,
    offline: true,
    highContrast: false
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully to GARUD network.');
    }, 1000);
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'notifications', icon: Bell, label: 'Alerts & Notifications' },
    { id: 'data', icon: Database, label: 'Data & Sync' },
    { id: 'appearance', icon: Monitor, label: 'Display & Appearance' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  // Custom Modern Toggle Switch Component
  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors shadow-sm">
      <div className="pr-4">
        <span className="block font-bold text-slate-900">{label}</span>
        <span className="text-sm text-slate-700 mt-1 block">{desc}</span>
      </div>
      <button 
        type="button" 
        onClick={onChange}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gov-600 focus:ring-offset-2 ${checked ? 'bg-gov-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-[calc(100vh-140px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-700 mt-1 font-medium">Manage your GARUD portal preferences and configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gov-50 text-blue-700 shadow-sm border border-gov-100' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-700'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
            
            {activeTab === 'notifications' && (
              <FadeIn className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Alerts & Notifications</h2>
                  <p className="text-sm text-slate-700 mb-8 font-medium">Control how you receive emergency warnings from the system.</p>
                </div>
                <div className="space-y-4">
                  <Toggle 
                    label="Critical SMS Alerts" 
                    desc="Receive immediate text messages for Level 4 (Red) events in your zone." 
                    checked={toggles.sms} onChange={() => handleToggle('sms')} 
                  />
                  <Toggle 
                    label="Daily Email Digest" 
                    desc="Get a summary of risk shifts and regional reports delivered at 8:00 AM." 
                    checked={toggles.email} onChange={() => handleToggle('email')} 
                  />
                  <Toggle 
                    label="Browser Push Notifications" 
                    desc="Receive real-time floating alerts directly on your device." 
                    checked={toggles.push} onChange={() => handleToggle('push')} 
                  />
                </div>
              </FadeIn>
            )}

            {activeTab === 'data' && (
              <FadeIn className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Data & Synchronization</h2>
                  <p className="text-sm text-slate-700 mb-8 font-medium">Manage how GARUD fetches and caches telemetry from field sensors.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Telemetry Refresh Rate</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-gov-600/20 focus:border-gov-600 outline-none bg-white font-medium cursor-pointer transition-all shadow-sm">
                      <option>Real-time (WebSocket)</option>
                      <option>Every 1 minute</option>
                      <option>Every 5 minutes (Recommended)</option>
                      <option>Every 15 minutes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Default Map View</label>
                    <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-gov-600/20 focus:border-gov-600 outline-none bg-white font-medium cursor-pointer transition-all shadow-sm">
                      <option>North Eastern Region Overview</option>
                      <option>Assam (Kamrup Metro)</option>
                      <option>Meghalaya (East Khasi Hills)</option>
                    </select>
                  </div>
                </div>

                <Toggle 
                  label="Offline Caching (IndexedDB)" 
                  desc="Keep map tiles and alerts cached for periods without network coverage. Crucial for remote deployments." 
                  checked={toggles.offline} onChange={() => handleToggle('offline')} 
                />
              </FadeIn>
            )}

            {activeTab === 'appearance' && (
              <FadeIn className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Display & Appearance</h2>
                  <p className="text-sm text-slate-700 mb-8 font-medium">Customize the portal's look and accessibility settings.</p>
                </div>
                
                <div className="space-y-6">
                  <Toggle 
                    label="High Contrast Mode" 
                    desc="Maximum visibility scheme compliant with WCAG AAA for visual accessibility." 
                    checked={toggles.highContrast} onChange={() => handleToggle('highContrast')} 
                  />
                  
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <span className="block font-bold text-slate-900 mb-4">Theme Preference</span>
                    <div className="flex gap-6">
                      <label className="flex flex-col items-center gap-3 cursor-pointer group">
                        <div className="w-24 h-20 bg-slate-100 rounded-xl border-2 border-gov-600 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                           <div className="absolute top-0 w-full h-5 bg-white border-b border-slate-200 flex items-center px-2 gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                           </div>
                           <div className="absolute left-2 top-8 w-1/3 h-2 bg-slate-200 rounded-sm"></div>
                           <div className="absolute left-2 top-11 w-1/2 h-2 bg-slate-200 rounded-sm"></div>
                        </div>
                        <span className="text-sm font-bold text-blue-700">Light Mode</span>
                      </label>
                      <label className="flex flex-col items-center gap-3 cursor-pointer opacity-50 hover:opacity-100 transition-opacity group">
                        <div className="w-24 h-20 bg-slate-100 rounded-xl border-2 border-transparent relative overflow-hidden shadow-sm">
                           <div className="absolute top-0 w-full h-5 bg-white border-b border-slate-300 flex items-center px-2 gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                           </div>
                           <div className="absolute left-2 top-8 w-1/3 h-2 bg-slate-600 rounded-sm"></div>
                           <div className="absolute left-2 top-11 w-1/2 h-2 bg-slate-600 rounded-sm"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-700">Dark (Soon)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'security' && (
              <FadeIn className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Security & Authentication</h2>
                  <p className="text-sm text-slate-700 mb-8 font-medium">Manage your account access, multi-factor authentication, and connected devices.</p>
                </div>
                
                <div className="space-y-4">
                  <Toggle 
                    label="Biometric Login (FaceID / Fingerprint)" 
                    desc="Allow fast secure access using your device's biometric sensors." 
                    checked={true} onChange={() => {}} 
                  />
                  <Toggle 
                    label="Gov-SSO (Parichay) Integration" 
                    desc="Link your National Single Sign-On account for seamless portal access." 
                    checked={true} onChange={() => {}} 
                  />
                  <Toggle 
                    label="Two-Factor Authentication (OTP)" 
                    desc="Require an SMS OTP every time you log in from a new IP address." 
                    checked={false} onChange={() => {}} 
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4">Active Sessions</h3>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-8 h-8 text-slate-700" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Windows 11 • Chrome Browser</div>
                        <div className="text-xs text-slate-700">Guwahati, Assam (Current IP)</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Active Now</span>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === 'profile' && (
              <FadeIn className="py-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Profile</h3>
                <p className="text-slate-700 mt-2 max-w-sm">
                  Profile modifications must be submitted through the central HR portal (eHRMS). You cannot directly edit your official designation here.
                </p>
                <button type="button" className="mt-6 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50">
                  Go to eHRMS Portal
                </button>
              </FadeIn>
            )}

            {/* Footer Actions */}
            <div className="mt-10 pt-8 border-t border-slate-200 flex justify-end gap-3">
              <button type="button" className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                Cancel Changes
              </button>
              <button 
                type="submit" 
                disabled={isSaving} 
                className="px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-70 shadow-md shadow-gov-700/20 active:scale-[0.98]"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Applying Changes...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
