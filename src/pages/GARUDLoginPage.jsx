import React, { useState, useEffect } from 'react';

// Dual Auth Login — Citizen (Aadhaar/OTP) + Official (Govt ID/Token)
export default function GARUDLoginPage({ onLogin }) {
  const [mode, setMode]       = useState('citizen'); // 'citizen' | 'official'
  const [step, setStep]       = useState(1);          // 1=creds, 2=otp
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp]         = useState('');
  const [govtId, setGovtId]   = useState('');
  const [token, setToken]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [lang, setLang]       = useState('en');

  const LANGS = { en:'English', hi:'हिंदी', as:'অসমীয়া', mn:'मेइतेइ' };

  const UI = {
    en: { title:'GARUD Emergency Platform', citizen:'Citizen Login', official:'Official Login',
          aadhaarLabel:'Aadhaar Number', getOtp:'Get OTP', otpLabel:'Enter OTP',
          govtLabel:'Govt Employee ID', tokenLabel:'Secure Access Token',
          login:'Login', back:'Back', disclaimer:'Your data is encrypted and used only for emergency response.',
          sending:'Sending OTP...', verifying:'Verifying...' },
    hi: { title:'गरुड़ आपातकालीन प्लेटफॉर्म', citizen:'नागरिक लॉगिन', official:'अधिकारी लॉगिन',
          aadhaarLabel:'आधार नंबर', getOtp:'OTP प्राप्त करें', otpLabel:'OTP दर्ज करें',
          govtLabel:'सरकारी कर्मचारी ID', tokenLabel:'सुरक्षित एक्सेस टोकन',
          login:'लॉगिन करें', back:'वापस', disclaimer:'आपका डेटा एन्क्रिप्टेड है।',
          sending:'OTP भेजा जा रहा है...', verifying:'सत्यापन हो रहा है...' },
    as: { title:'গৰুড় জৰুৰীকালীন প্লেটফৰ্ম', citizen:'নাগৰিক লগইন', official:'বিষয়া লগইন',
          aadhaarLabel:'আধাৰ নম্বৰ', getOtp:'OTP লওক', otpLabel:'OTP দিয়ক',
          govtLabel:'চৰকাৰী কৰ্মচাৰী ID', tokenLabel:'সুৰক্ষিত টোকেন',
          login:'লগইন', back:'উভতি', disclaimer:'আপোনাৰ ডেটা সুৰক্ষিত।',
          sending:'OTP পঠোৱা হৈছে...', verifying:'পৰীক্ষা হৈছে...' },
    mn: { title:'গৰুড় জৰুৰীকালীন', citizen:'মাইকৈ লগিন', official:'অফিচিয়েল লগিন',
          aadhaarLabel:'আধার নম্বৰ', getOtp:'OTP পাওক', otpLabel:'OTP দিওক',
          govtLabel:'চৰকাৰী ID', tokenLabel:'টোকেন', login:'লগিন', back:'ঘুৰি',
          disclaimer:'ডেটা এনক্রিপ্টেড।', sending:'...', verifying:'...' },
  };
  const t = UI[lang] || UI.en;

  const sendOtp = async () => {
    if (aadhaar.replace(/\s/g,'').length < 12) { setError('Please enter a valid 12-digit Aadhaar number'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    alert(`[DEMO] OTP sent to Aadhaar-linked mobile: ${code}`);
    setStep(2); setLoading(false);
  };

  const verifyCitizen = async () => {
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (otp === generatedOtp) {
      setLoading(false);
      onLogin?.({ role: 'citizen', name: 'Citizen', aadhaar: aadhaar.slice(-4) });
    } else { setError('Invalid OTP. Please try again.'); setLoading(false); }
  };

  const loginOfficial = async () => {
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const DEMO_OFFICIALS = { 'NDRF001': 'NDRF', 'SDRF002': 'SDRF', 'ADMIN003': 'District Admin', 'IAF004': 'IAF', 'GARUD': 'GARUD Command' };
    if (DEMO_OFFICIALS[govtId.toUpperCase()] && token.length >= 6) {
      setLoading(false);
      onLogin?.({ role: 'official', agency: DEMO_OFFICIALS[govtId.toUpperCase()], govtId });
    } else { setError('Invalid credentials. Use demo ID: GARUD, Token: 123456'); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,58,138,0.3)_0%,_rgba(7,15,31,0.95)_70%)]" />
        {[...Array(20)].map((_,i) => (
          <div key={i} className="absolute rounded-full bg-blue-500/5 animate-pulse"
            style={{ width:`${20+Math.random()*80}px`, height:`${20+Math.random()*80}px`,
              top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
              animationDelay:`${Math.random()*4}s`, animationDuration:`${3+Math.random()*4}s` }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Lang selector */}
        <div className="flex justify-end gap-2 mb-4">
          {Object.entries(LANGS).map(([k,v]) => (
            <button key={k} onClick={() => setLang(k)}
              className={`text-xs px-2 py-1 rounded-lg transition-all ${lang===k?'bg-blue-600 text-white':'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-slate-50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 p-6 text-center border-b border-white/10">
            <div className="text-5xl mb-2">🦅</div>
            <h1 className="text-2xl font-black text-white tracking-tight">GARUD</h1>
            <p className="text-xs text-blue-300 mt-1">{t.title}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Geo-Rakshak Autonomous United Response & Disaster AI</p>
          </div>

          {/* Mode toggle */}
          <div className="p-4 border-b border-white/10">
            <div className="flex bg-white rounded-xl p-1">
              {[['citizen','👤 '+t.citizen],['official','🏛️ '+t.official]].map(([m,label]) => (
                <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${mode===m?'bg-blue-600 text-white shadow-lg shadow-blue-900/50':'text-slate-400 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-2.5 text-sm text-red-300">{error}</div>}

            {mode === 'citizen' ? (
              <>
                {step === 1 && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">{t.aadhaarLabel}</label>
                      <input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/\D/g,'').slice(0,12))}
                        placeholder="XXXX XXXX XXXX"
                        className="w-full bg-white border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none focus:ring-2 focus:ring-blue-500/20 font-mono tracking-widest transition-all"
                      />
                      <p className="text-[10px] text-slate-700 mt-1">🔒 Aadhaar number is masked and not stored</p>
                    </div>
                    <button onClick={sendOtp} disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-blue-900/40">
                      {loading ? t.sending : t.getOtp}
                    </button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">{t.otpLabel}</label>
                      <input value={otp} onChange={e => setOtp(e.target.value.slice(0,6))}
                        placeholder="______" maxLength={6}
                        className="w-full bg-white border border-slate-700 text-white rounded-xl px-4 py-3 text-lg font-mono tracking-[0.5em] text-center focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <button onClick={verifyCitizen} disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 text-sm">
                      {loading ? t.verifying : t.login}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-sm text-slate-400 hover:text-white py-2 transition-colors">{t.back}</button>
                  </>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">{t.govtLabel}</label>
                  <input value={govtId} onChange={e => setGovtId(e.target.value)}
                    placeholder="e.g. GARUD, NDRF001, ADMIN003"
                    className="w-full bg-white border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block font-medium">{t.tokenLabel}</label>
                  <input type="password" value={token} onChange={e => setToken(e.target.value)}
                    placeholder="Min. 6 characters (demo: 123456)"
                    className="w-full bg-white border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300">
                  🔐 Demo: ID = <strong>GARUD</strong>, Token = <strong>123456</strong>
                </div>
                <button onClick={loginOfficial} disabled={loading}
                  className="w-full bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-red-900/40">
                  {loading ? t.verifying : '🔐 ' + t.login}
                </button>
              </>
            )}

            {/* Skip demo */}
            <button onClick={() => onLogin?.({ role: 'citizen', name: 'Demo User', demo: true })}
              className="w-full text-xs text-slate-700 hover:text-slate-300 py-2 transition-colors underline underline-offset-2">
              Continue as Demo Guest (No Login)
            </button>
          </div>

          <div className="px-6 pb-5 text-center">
            <p className="text-[10px] text-slate-700">{t.disclaimer}</p>
            <p className="text-[10px] text-slate-700 mt-1">GARUD v2.0 · NER Disaster Management · MHA India</p>
          </div>
        </div>
      </div>
    </div>
  );
}
