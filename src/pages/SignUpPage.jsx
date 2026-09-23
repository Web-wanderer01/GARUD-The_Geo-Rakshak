import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, User, Phone, Building, Briefcase, ChevronRight, CheckCircle2, BellRing, MapPin, Mail } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const requestPermissions = async () => {
    try {
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }
    } catch (e) {
      console.warn('Permissions denied or unsupported.');
    }
  };

  const handleCompleteRegistration = () => {
    // Save to local storage for the virtual simulations page
    const userData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      district: formData.district || 'General',
      type: formData.role || 'Citizen',
      language: formData.language,
      status: 'Active',
      registeredAt: new Date().toISOString()
    };
    
    // Save current active user
    localStorage.setItem('garud_user', JSON.stringify(userData));

    // Append to the permanent Citizen DB array
    const existingCitizensStr = localStorage.getItem('garud_citizens');
    let citizens = [];
    if (existingCitizensStr) {
      try { citizens = JSON.parse(existingCitizensStr); } catch (e) {}
    }
    
    // Generate unique ID
    userData.id = 'USR-' + Math.floor(1000 + Math.random() * 9000);
    citizens.unshift(userData);
    localStorage.setItem('garud_citizens', JSON.stringify(citizens));

    requestPermissions();
    setStep(3); // success state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handleCompleteRegistration();
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col md:flex-row-reverse">
      {/* Right Panel - Image */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-slate-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1599708153386-62bf231efa57?auto=format&fit=crop&w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gov-900/60 via-transparent to-gov-900" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 w-full h-full text-white pb-16">
          <Shield className="w-10 h-10 text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Citizen Alert Network</h2>
          <p className="text-blue-100 max-w-sm leading-relaxed">
            Register your mobile number to receive instant SMS and Push Notification alerts if a landslide or flood is detected in your exact GPS location.
          </p>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center p-8 sm:p-12 lg:px-20 xl:px-28 bg-slate-50">
        <FadeIn direction="down">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Register for Alerts</h3>
            <p className="text-slate-700 mt-2 font-medium">
              Step {Math.min(step, 2)} of 2: {step === 1 ? 'Contact Details' : step === 2 ? 'Permissions' : 'Complete'}
            </p>
          </div>

          {step === 3 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">Registration Active!</h4>
              <p className="text-slate-700 mb-8 leading-relaxed max-w-sm mx-auto">
                Your phone number {formData.phone} is now registered. You can test this by running the "Virtual Simulations" page.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/demo" className="inline-flex items-center justify-center py-3 px-8 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md">
                  Test SMS via Virtual Simulations
                </Link>
                <Link to="/" className="inline-flex items-center justify-center py-3 px-8 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              {step === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                      <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all focus:bg-white font-medium" placeholder="Your Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number (WhatsApp Enabled) (For Live SMS)</label>
                    <div className="relative group">
                      <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all focus:bg-white font-medium" placeholder="e.g. 9876543210" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all focus:bg-white font-medium" placeholder="e.g. name@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alert Language Preference</label>
                    <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all focus:bg-white font-medium">
                      <option value="en">English (Default)</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="as">অসমীয়া (Assamese)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="mni">ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md mt-4 active:scale-[0.98]">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                    <BellRing className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">Allow Push Notifications</h4>
                      <p className="text-xs text--600 mt-1">We need this permission to send you instant desktop/mobile popups when a disaster strikes.</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 text-sm">Allow GPS Tracking</h4>
                      <p className="text-xs text--600 mt-1">We need this permission to calculate if you are standing inside an active landslide zone.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="w-2/3 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">
                      Grant & Finish
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
