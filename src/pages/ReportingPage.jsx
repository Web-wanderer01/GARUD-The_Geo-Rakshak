import React, { useState, useEffect } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import { Camera, MapPin, Satellite, WifiOff, UploadCloud, CheckCircle, AlertTriangle, Navigation, Signal, HardDrive } from 'lucide-react';
import useOnlineStatus from '../hooks/useOnlineStatus';

export default function ReportingPage({ addReport }) {
  const isOnline = useOnlineStatus();
  const [gpsStatus, setGpsStatus] = useState('IDLE'); // IDLE, SEARCHING, FOUND, FAILED
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ type: 'crack', severity: 'medium', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'SYNCED', 'QUEUED'

  // Fetch real GPS via Satellite/Network
  const fetchGPS = () => {
    setGpsStatus('SEARCHING');
    if (!navigator.geolocation) {
      setTimeout(() => {
        setCoords({ lat: 26.14, lng: 91.73, acc: '12m (Simulated)' });
        setGpsStatus('FOUND');
      }, 1500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(5),
          lng: pos.coords.longitude.toFixed(5),
          acc: `${Math.round(pos.coords.accuracy)}m`
        });
        setGpsStatus('FOUND');
      },
      (err) => {
        // Fallback for demo purposes if user denies permission
        console.warn("GPS failed, using fallback:", err);
        setCoords({ lat: 25.57, lng: 91.88, acc: 'Estimated (Shillong)' });
        setGpsStatus('FOUND');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Mock Photo Capture
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    } else {
      // Fallback demo image if they just click the button
      setPhoto('https://images.unsplash.com/photo-1542385151-efd9000785a0?w=500&auto=format&fit=crop&q=60');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      const reportData = {
        ...form,
        lat: coords?.lat || 'Unknown',
        lng: coords?.lng || 'Unknown',
        timestamp: new Date().toISOString(),
        synced: isOnline
      };
      
      // Call parent function if it exists
      if (addReport) addReport(reportData);

      setSubmitStatus(isOnline ? 'SYNCED' : 'QUEUED');
      setSubmitting(false);

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setForm({ type: 'crack', severity: 'medium', description: '' });
        setPhoto(null);
        setCoords(null);
        setGpsStatus('IDLE');
      }, 3000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-white pb-20">
      <BackgroundAnimation variant="subtle" />
      
      {/* Mobile-first Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Satellite className="w-5 h-5 text--600" /> GARUD Field App
          </h1>
          <p className="text-xs text-slate-700 mt-0.5">Phase 4: Offline PWA Reporting</p>
        </div>
        
        {/* Network / PWA Status Badge */}
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border shadow-inner ${isOnline ? 'bg-green-50 text--600 border-green-200' : 'bg-red-50 text--600 border-red-200'}`}>
          {isOnline ? <Signal className="w-3.5 h-3.5 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-5 relative z-10">
        
        {/* Connection Notice */}
        {!isOnline && (
          <FadeIn>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3 shadow-lg">
              <HardDrive className="w-5 h-5 text--600 shrink-0 mt-0.5" />
              <p className="text-xs text--600 leading-relaxed font-medium">
                You are offline. Reports and photos will be saved locally via IndexedDB. They will auto-sync (Background Sync) when 2G/3G or Satellite network is restored.
              </p>
            </div>
          </FadeIn>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* STEP 1: GPS Location */}
          <FadeIn delay={100}>
            <div className="bg-slate-100 backdrop-blur rounded-2xl border border-slate-300 p-4 shadow-xl">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text--600" /> Step 1: Satellite Fix
              </h2>
              
              {gpsStatus === 'IDLE' && (
                <button type="button" onClick={fetchGPS} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-blue-900/30">
                  <Satellite className="w-6 h-6 mb-1" />
                  Acquire GPS Location
                  <span className="text-[10px] text-blue-200 font-normal">Connects to ISRO Bhuvan / NavIC</span>
                </button>
              )}

              {gpsStatus === 'SEARCHING' && (
                <div className="w-full py-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center gap-3">
                  <Navigation className="w-6 h-6 text--600 animate-spin" />
                  <span className="text-sm font-bold text--600 animate-pulse">Triangulating satellites...</span>
                </div>
              )}

              {gpsStatus === 'FOUND' && coords && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text--600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text--600 mb-1">Location Locked</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-slate-700">
                      <span>Lat: {coords.lat}</span>
                      <span>Lng: {coords.lng}</span>
                      <span className="col-span-2 text-slate-700">Accuracy: {coords.acc}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* STEP 2: Photo Evidence */}
          <FadeIn delay={200}>
            <div className="bg-slate-100 backdrop-blur rounded-2xl border border-slate-300 p-4 shadow-xl">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text--600" /> Step 2: Visual Evidence
              </h2>
              
              {!photo ? (
                <label className="w-full h-32 rounded-xl bg-white/80 border-2 border-dashed border-slate-600 hover:border-purple-200 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                  <div className="p-3 bg-slate-100 rounded-full group-hover:bg-purple-50 transition-colors">
                    <Camera className="w-6 h-6 text-slate-700 group-hover:text--600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text--600">Tap to Capture Geo-tagged Photo</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-600">
                  <img src={photo} alt="Evidence" className="w-full h-48 object-cover" />
                  <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-white backdrop-blur p-1.5 rounded-full text-white hover:bg-red-500 transition-colors">
                    <WifiOff className="w-4 h-4 hidden" /> ✕
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] text-slate-900 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text--600"/> Geo-tagged
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* STEP 3: Incident Details */}
          <FadeIn delay={300}>
            <div className="bg-slate-100 backdrop-blur rounded-2xl border border-slate-300 p-4 shadow-xl">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text--600" /> Step 3: Incident Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Observation Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'crack', label: 'Road/Wall Crack' },
                      { id: 'water', label: 'Muddy Seepage' },
                      { id: 'slide', label: 'Active Rockfall' },
                      { id: 'flood', label: 'River Overflow' }
                    ].map(t => (
                      <button key={t.id} type="button" onClick={() => setForm({...form, type: t.id})}
                        className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${form.type === t.id ? 'bg-blue-600/20 border-blue-200 text--600' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-300'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Severity</label>
                  <div className="flex bg-white rounded-lg p-1 border border-slate-300">
                    {['low', 'medium', 'high'].map(s => (
                      <button key={s} type="button" onClick={() => setForm({...form, severity: s})}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${form.severity === s ? (s === 'high' ? 'bg-red-600 text-white' : s === 'medium' ? 'bg-amber-500 text-white' : 'bg-green-600 text-white') : 'text-slate-700 hover:bg-slate-100'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Voice/Text Description</label>
                  <textarea 
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:border-blue-200 outline-none resize-none h-24 placeholder:text-slate-700"
                    placeholder="E.g. NH-06 surface has caved in by 2 feet. Vehicles cannot pass..."
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Submit Action */}
          <FadeIn delay={400}>
            {submitStatus === 'SYNCED' ? (
              <div className="bg-green-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/50 animate-pulse">
                <UploadCloud className="w-5 h-5" /> REPORT SYNCED TO CLOUD
              </div>
            ) : submitStatus === 'QUEUED' ? (
              <div className="bg-amber-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-900/50 animate-pulse">
                <HardDrive className="w-5 h-5" /> SAVED LOCALLY (WILL SYNC)
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={submitting || !coords}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 font-black text-lg shadow-xl shadow-blue-900/50 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Navigation className="w-5 h-5 animate-spin" /> PROCESSING...</>
                ) : (
                  <><UploadCloud className="w-5 h-5" /> SUBMIT FIELD REPORT</>
                )}
              </button>
            )}
            {!coords && !submitStatus && <p className="text-center text-[10px] text--600 mt-2 font-bold">⚠ GPS Location required before submitting</p>}
          </FadeIn>
          
        </form>
      </div>
    </div>
  );
}
