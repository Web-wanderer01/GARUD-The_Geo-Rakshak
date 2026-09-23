import { useState } from 'react';
import { BellRing, CheckCircle, ShieldAlert, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export default function SubscribeAlerts() {
  const [status, setStatus] = useState('idle');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', district: '', role: 'Citizen'
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Read existing database
    const existingStr = localStorage.getItem('garud_citizens');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    // Add new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      district: formData.district,
      role: formData.role,
      status: 'Verified'
    };
    
    const updated = [newUser, ...existing];
    
    // Save to citizen portal database
    localStorage.setItem('garud_citizens', JSON.stringify(updated));

    // Simulate network delay for UX
    setTimeout(() => setStatus('success'), 1000);
  };

  const states = [
    'Dima Hasao, Assam', 'Cachar, Assam', 'Kamrup, Assam', 'Dibrugarh, Assam',
    'East Khasi Hills, Meghalaya', 'West Garo Hills, Meghalaya', 'Cherrapunji, Meghalaya',
    'Imphal, Manipur', 'Churachandpur, Manipur', 'Ukhrul, Manipur',
    'Aizawl, Mizoram', 'Lunglei, Mizoram', 'Champhai, Mizoram',
    'Kohima, Nagaland', 'Dimapur, Nagaland', 'Mokokchung, Nagaland',
    'Agartala, Tripura', 'North Tripura, Tripura', 'South Tripura, Tripura',
    'Tawang, Arunachal Pradesh', 'Itanagar, Arunachal Pradesh', 'Ziro, Arunachal Pradesh',
    'Gangtok, Sikkim', 'Namchi, Sikkim', 'Mangan, Sikkim'
  ];

  return (
    <div className="bg-gov-800 rounded-lg p-6 sm:p-8 text-white shadow-lg relative overflow-hidden mt-12 mb-8 border-t-4 border-gov-saffron">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
        <ShieldAlert className="w-48 h-48" />
      </div>
      
      <div className="relative z-10">
        <div className="md:w-2/3 mb-6">
          <h3 className="text-2xl font-bold mb-3">Citizen Alert Registration</h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Register for the GARUD broadcasting system to receive early warnings, evacuation notices, and real-time weather advisories. Your data is securely stored in the regional citizen registry.
          </p>
        </div>
        
        {status === 'success' ? (
          <div className="flex items-start gap-3 bg-green-500/20 text-green-300 p-4 rounded border border-green-500/30 md:w-2/3">
            <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Successfully Registered!</p>
              <p className="text-sm mt-1">You are now registered in the GARUD registry. You will receive critical alerts for your selected state.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 Mobile Number" pattern="[+0-9]{10,13}" title="Enter a valid 10-digit Indian mobile number" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="" disabled>Select District/State...</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="Citizen">Citizen</option>
                <option value="Field Officer">Field Officer</option>
                <option value="NDRF Personnel">NDRF Personnel</option>
                <option value="Medical Staff">Medical Staff</option>
                <option value="Government Official">Government Official</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'} 
              className="bg-gov-saffron hover:bg-orange-600 text-white font-bold px-6 py-3 rounded transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center h-full"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>
        )}
        <p className="text-[10px] text-slate-400 mt-6 md:w-2/3 border-t border-slate-700 pt-3">
          * Standard messaging rates apply. Your data is protected under the Digital Personal Data Protection Act, 2023. Registration automatically adds your profile to the centralized disaster management database. Service provided by NDMA.
        </p>
      </div>
    </div>
  );
}
