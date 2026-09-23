import React, { useState, useEffect, useRef, useContext } from 'react';
import { LiveDataContext } from '../contexts/LiveDataContext';
import { AlertTriangle, Radio, Activity, CheckCircle2, Smartphone, Cpu, Volume2, Zap } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';
import Geological3DVisualizer from '../components/demo/Geological3DVisualizer';
import LandslideMechanics3D from '../components/demo/LandslideMechanics3D';
import LogisticsDemo from '../components/demo/LogisticsDemo';
import MultiModalLogisticsDemo from '../components/demo/MultiModalLogisticsDemo';
import EvacuationSimulation from '../components/demo/EvacuationSimulation';
import DroneSwarmSimulation from '../components/demo/DroneSwarmSimulation';

export default function DisasterDemoPage() {
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scenario, setScenario] = useState('landslide');
  const [dispatchTarget, setDispatchTarget] = useState('district'); // 'district' or 'all'
  const [location, setLocation] = useState('Dima Hasao, Assam');
    const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const { dispatchFleet } = useContext(LiveDataContext) || { dispatchFleet: () => {} };
  const [showDispatchApproval, setShowDispatchApproval] = useState(false);
  const [isDispatchApproved, setIsDispatchApproved] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState('Meitei');
  const logsEndRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const sirenOscillatorRef = useRef(null);
  const audioCtxRef = useRef(null);

  
  // Trigger Dispatch Approval Pop-up when simulation ends
  useEffect(() => {
    if (progress === 100 && !isDispatchApproved) {
      setTimeout(() => {
        setShowDispatchApproval(true);
      }, 1000);
    }
  }, [progress, isDispatchApproved]);

  const handleApproveDispatch = () => {
    // Dispatch a new truck to LiveDataContext
    dispatchFleet({
      id: 'TRK-' + Math.floor(Math.random() * 900 + 100),
      category: 'medicine',
      cargo: 'Emergency First-Aid Kits',
      origin: 'Guwahati Depot',
      destination: location,
      status: 'on-time',
      eta: '1.5 hrs',
      lat: 26.14,
      lng: 91.73,
      speed: 65,
      delayReason: null,
      routeHistory: [[26.14, 91.73]],
      route: 'Emergency Corridor'
    });
    setShowDispatchApproval(false);
    setIsDispatchApproved(true);
    setLogs(prev => [...prev, '[SYSTEM] AI Dispatch Approved. NDRF Fleet en route to ' + location]);
  };

  const stopSiren = () => {
    if (sirenOscillatorRef.current) {
      try { sirenOscillatorRef.current.stop(); } catch (e) {}
      sirenOscillatorRef.current = null;
    }
    setIsSirenPlaying(false);
  };

  const nerDistricts = [
    'Dima Hasao, Assam', 'Cachar, Assam', 'Kamrup, Assam', 'Dibrugarh, Assam',
    'East Khasi Hills, Meghalaya', 'West Garo Hills, Meghalaya', 'Cherrapunji, Meghalaya',
    'Imphal, Manipur', 'Churachandpur, Manipur', 'Ukhrul, Manipur',
    'Aizawl, Mizoram', 'Lunglei, Mizoram', 'Champhai, Mizoram',
    'Kohima, Nagaland', 'Dimapur, Nagaland', 'Mokokchung, Nagaland',
    'Agartala, Tripura', 'North Tripura, Tripura', 'South Tripura, Tripura',
    'Tawang, Arunachal Pradesh', 'Itanagar, Arunachal Pradesh', 'Ziro, Arunachal Pradesh',
    'Gangtok, Sikkim', 'Namchi, Sikkim', 'Mangan, Sikkim'
  ];

  const scenarios = {
    landslide: {
      title: 'Landslide',
      alertMsg: 'CRITICAL LANDSLIDE WARNING for {LOCATION}. Evacuate to relief camps immediately. Avoid hilly terrain.',
      translations: {
        hi: '{LOCATION} के लिए गंभीर भूस्खलन चेतावनी। तुरंत राहत शिविरों में जाएँ। पहाड़ी इलाकों से बचें।',
        as: '{LOCATION} ৰ বাবে গুৰুতৰ ভূমিস্খলনৰ সতৰ্কবাণী। লগে লগে সাহায্য শিবিৰলৈ যাওক। পাহাৰীয়া অঞ্চলৰ পৰা আঁতৰি থাকক।',
        bn: '{LOCATION}-এর জন্য গুরুতর ভূমিধসের সতর্কতা। অবিলম্বে ত্রাণ শিবিরে সরে যান। পাহাড়ি এলাকা এড়িয়ে চলুন।',
        mni: '{LOCATION} গীদেমক খুদোংথিনিংঙাই ওইবা লৈহাউ-চেংবা ৱার্নিং। য়ামদ্রবদা রিলিফ কেম্পশিংদা চত্থোকউ। চীংগী মফমশিংদগী লাপ্না লৈয়ু।'
      },
      logs: [
        { delay: 500, msg: '[SENSOR API] Receiving abnormal telemetry from {LOCATION}...' },
        { delay: 1500, msg: '[TELEMETRY] Soil Moisture spike detected: 96% (CRITICAL)' },
        { delay: 2500, msg: '[TELEMETRY] Rainfall 24h: 185mm (EXTREME)' },
        { delay: 3500, msg: '[AI CORE] Recalculating 7-parameter risk score...' },
        { delay: 5000, msg: '[AI CORE] Risk Score updated: 94/100 (CRITICAL LANDSLIDE)' },
        { delay: 6000, msg: '[SYSTEM] Activating Emergency Protocol Alpha.' },
        { delay: 7500, msg: '[ALERT] Generating multilingual warning (English, Assamese, Bengali, Hindi)...' },
        { delay: 9000, msg: '[DISPATCH] Connecting to SMS Gateway API...' },
        { delay: 10000, msg: '[DISPATCH] Fetching registered contacts for {LOCATION}...' },
        { delay: 11000, msg: '[DISPATCH] Initiating mass broadcast...' }
      ]
    },
    flood: {
      title: 'Flash Flood',
      alertMsg: 'FLASH FLOOD WARNING for {LOCATION}. Move to higher ground immediately. Do not cross flowing water.',
      translations: {
        hi: '{LOCATION} के लिए अचानक बाढ़ की चेतावनी। तुरंत ऊंचे स्थानों पर जाएँ। बहते पानी को पार न करें।',
        as: '{LOCATION} ৰ বাবে আকস্মিক বানপানীৰ সতৰ্কবাণী। লগে লগে ওখ ঠাইলৈ যাওক। বৈ থকা পানী পাৰ নহ\'ব।',
        bn: '{LOCATION}-এর জন্য আকস্মিক বন্যার সতর্কতা। অবিলম্বে উঁচু স্থানে সরে যান। প্রবাহিত জল পার হবেনআগ।',
        mni: '{LOCATION} গীদেমক ফ্লেশ ফ্লড ৱার্নিং। য়ামদ্রবদা ৱাংবা মফমশিংদা চত্থোকউ। চেল্লিবা ঈশিং লান্থোক্কনু।'
      },
      logs: [
        { delay: 500, msg: '[RIVER GAUGE] Local river water level rising rapidly in {LOCATION}...' },
        { delay: 1500, msg: '[TELEMETRY] Water level: +2.5m (DANGER MARK CROSSED)' },
        { delay: 2500, msg: '[TELEMETRY] Rainfall upstream: 210mm/12h' },
        { delay: 3500, msg: '[AI CORE] Simulating inundation spread...' },
        { delay: 5000, msg: '[AI CORE] Inundation detected in low-lying areas of {LOCATION}.' },
        { delay: 6000, msg: '[SYSTEM] Activating Emergency Protocol Beta.' },
        { delay: 7500, msg: '[ALERT] Generating flood warnings...' },
        { delay: 9000, msg: '[DISPATCH] Connecting to SMS Gateway API...' },
        { delay: 10000, msg: '[DISPATCH] Fetching registered contacts for {LOCATION}...' },
        { delay: 11000, msg: '[DISPATCH] Initiating mass broadcast...' }
      ]
    },
    earthquake: {
      title: 'Earthquake',
      alertMsg: 'M6.5 EARTHQUAKE DETECTED near {LOCATION}. Expect aftershocks. Drop, Cover, and Hold on. Stay away from buildings.',
      translations: {
        hi: '{LOCATION} के पास M6.5 भूकंप का पता चला है। झटकों की उम्मीद करें। झुकें, ढंकें, और पकड़ें। इमारतों से दूर रहें।',
        as: '{LOCATION} ৰ ওচৰত M6.5 ভূমিকম্পৰ অৱস্থান। পিছৰ জোকাৰণিৰ বাবে প্ৰস্তুত থাকক। তললৈ নামি, আৱৰি, ধৰি ৰাখক।',
        bn: '{LOCATION}-এর কাছাকাছি M6.5 ভূমিকম্প শনাক্ত হয়েছে। পরবর্তী কম্পনের জন্য প্রস্তুত থাকুন। নিচে নামুন, ঢেকে রাখুন এবং ধরে রাখুন।',
        mni: '{LOCATION} নকপদা M6.5 য়ুহা হাবা খঙলে। মতুংদা লাক্কদবা শোকশিংগীদমক শেম-শাদুনা লৈয়ু। মখাদা কুমথৌ, কুপশিনৌ অমসুং চেৎনা পায়য়ু।'
      },
      logs: [
        { delay: 500, msg: '[SEISMIC NET] P-Wave detected at {LOCATION} observatory...' },
        { delay: 1000, msg: '[AI CORE] Estimating magnitude: M6.5, Depth: 15km' },
        { delay: 2000, msg: '[WARNING] S-Wave arrival in 8 seconds.' },
        { delay: 3000, msg: '[SYSTEM] Activating EARLY EARTHQUAKE WARNING.' },
        { delay: 4000, msg: '[ALERT] Triggering sirens and automated shutdown protocols in {LOCATION}...' },
        { delay: 5500, msg: '[SYSTEM] Activating Emergency Protocol Gamma.' },
        { delay: 7000, msg: '[ALERT] Generating mass earthquake alert...' },
        { delay: 8000, msg: '[DISPATCH] Connecting to SMS Gateway API...' },
        { delay: 9000, msg: '[DISPATCH] Fetching registered contacts for {LOCATION}...' },
        { delay: 10000, msg: '[DISPATCH] Initiating mass broadcast...' }
      ]
    },
    cyclone: {
      title: 'Cyclone',
      alertMsg: 'SEVERE CYCLONIC STORM approaching {LOCATION}. Wind speeds up to 120km/h expected. Stay indoors.',
      translations: {
        hi: 'गंभीर चक्रवाती तूफान {LOCATION} के करीब आ रहा है। 120 किमी/घंटा तक की हवा की गति अपेक्षित है। घर के अंदर रहें।',
        as: 'ভয়ংকৰ ঘূৰ্ণীবতাহ {LOCATION} ৰ ফালে আগবাঢ়িছে। ১২০ কিলোমিটাৰ প্ৰতি ঘণ্টা লৈকে বতাহৰ গতি আশা কৰা হৈছে। ঘৰৰ ভিতৰত থাকক।',
        bn: 'গুরুতর ঘূর্ণিঝড় {LOCATION}-এর দিকে এগিয়ে আসছে। ১২০ কিমি/ঘন্টা পর্যন্ত বাতাসের গতিবেগ প্রত্যাশিত। ঘরে থাকুন।',
        mni: 'অকন্নবা নোংলৈ-নুংশিৎ {LOCATION} নকশিনলক্লি। পুংদা কিলোমিতর ১২০ ফাওবগী নুংশিৎকী খোংজেল লাক্কনি হায়না পারি। য়ুম মনুংদা লৈয়ু।'
      },
      logs: [
        { delay: 500, msg: '[IMD RADAR] Tracking cyclonic depression moving towards {LOCATION}...' },
        { delay: 1500, msg: '[TELEMETRY] Barometric pressure dropping rapidly (980 hPa)' },
        { delay: 2500, msg: '[TELEMETRY] Wind gust speeds: 85 km/h and rising' },
        { delay: 3500, msg: '[AI CORE] Projecting impact trajectory over next 6 hours...' },
        { delay: 5000, msg: '[AI CORE] {LOCATION} is in the direct path of the eye wall.' },
        { delay: 6000, msg: '[SYSTEM] Activating Emergency Protocol Delta.' },
        { delay: 7500, msg: '[ALERT] Generating cyclone evacuation warnings...' },
        { delay: 9000, msg: '[DISPATCH] Connecting to SMS Gateway API...' },
        { delay: 10000, msg: '[DISPATCH] Fetching registered contacts for {LOCATION}...' },
        { delay: 11000, msg: '[DISPATCH] Initiating mass broadcast...' }
      ]
    },
    fire: {
      title: 'Forest Fire',
      alertMsg: 'MAJOR FOREST FIRE DETECTED near {LOCATION}. Poor air quality and fire spread risk. Follow evacuation orders.',
      logs: [
        { delay: 500, msg: '[SATELLITE FIRMS] Thermal anomalies detected near {LOCATION}...' },
        { delay: 1500, msg: '[TELEMETRY] High temperature (38°C) and low humidity (15%)' },
        { delay: 2500, msg: '[TELEMETRY] Wind direction accelerating fire spread towards settlements.' },
        { delay: 3500, msg: '[AI CORE] Mapping fire perimeter and smoke dispersion...' },
        { delay: 5000, msg: '[AI CORE] Fire expanding rapidly. Critical threat to {LOCATION}.' },
        { delay: 6000, msg: '[SYSTEM] Activating Emergency Protocol Epsilon.' },
        { delay: 7500, msg: '[ALERT] Generating fire evacuation and air quality warnings...' },
        { delay: 9000, msg: '[DISPATCH] Connecting to SMS Gateway API...' },
        { delay: 10000, msg: '[DISPATCH] Fetching registered contacts for {LOCATION}...' },
        { delay: 11000, msg: '[DISPATCH] Initiating mass broadcast...' }
      ]
    }
  };

  const sendEmailAlert = async (email, name, message) => {
    try {
      // 100% Free EmailJS account gives 200 emails/month to ANY address
      const SERVICE_ID = 'service_dawxawl';
      const TEMPLATE_ID = 'template_rvizrce';
      const PUBLIC_KEY = 'xkNKgnvjp9C8sijNJ';
      const PRIVATE_KEY = '9la7HcFtozjWQxKMIoIV7';
      
      // If user hasn't set keys yet, simulate success for the virtual simulation
      if (SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID') {
        return { ok: true, simulated: true };
      }

      const activeScenario = scenarios[scenario];
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          accessToken: PRIVATE_KEY,
          template_params: {
            to_email: email,
            to_name: name,
            message: message,
            event_type: activeScenario.title.toUpperCase(),
            subject: `GARUD ALERT: ${activeScenario.title.toUpperCase()} in ${location}`,
            reply_to: "noreply@garud.gov.in"
          }
        })
      });
      
      if (res.ok) {
        return { ok: true };
      } else {
        const errorText = await res.text();
        return { ok: false, description: errorText };
      }
    } catch (e) {
      console.error("Email failed:", e);
      return { ok: false, description: e.message };
    }
  };

  const triggerPushNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('GARUD EMERGENCY ALERT', {
        body: message,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
        vibrate: [200, 100, 200, 100, 200]
      });
    }
  };

  const playDispatcherAudio = () => {
    const messages = {
      Meitei: 'Emergency alert. Move to the nearest relief camp. Avoid the Imphal Dimapur highway.',
      Mizo: 'Emergency alert. Move to safe ground and wait for rescue teams.',
      Khasi: 'Emergency alert. Move away from the slope and report to the relief camp.'
    };
    if (!('speechSynthesis' in window)) {
      setLogs(prev => [...prev, '[AUDIO] Browser speech synthesis is unavailable. Text dispatch queued.']);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(messages[audioLanguage]);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    setLogs(prev => [...prev, `[AUDIO] GARUD AI dispatcher preview generated in ${audioLanguage}.`]);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setLogs([]);
    setProgress(0);
    setIsDispatchApproved(false);
    setShowDispatchApproval(false);

    const activeScenario = scenarios[scenario];
    
    // Generate the translated alert message
    const finalAlertMsg = activeScenario.alertMsg.replace(/{LOCATION}/g, location);

    // Load all registered users from DB
    const citizensStr = localStorage.getItem('garud_citizens');
    let citizens = [];
    if (citizensStr) {
      try { citizens = JSON.parse(citizensStr); } catch (e) {}
    }
    
    // Inject the real users into the scenario
    const baseLogs = activeScenario.logs.map(l => ({ ...l, msg: l.msg.replace(/{LOCATION}/g, location) }));
    if (citizens.length > 0) {
      baseLogs.splice(7, 0, { delay: 8500, msg: `[SYSTEM] Found ${citizens.length} registered citizens in active database.` });
    } else {
      baseLogs.splice(7, 0, { delay: 8500, msg: `[SYSTEM] WARNING: No citizens registered in local database. Sending to mock numbers.` });
    }

    baseLogs.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log.msg]);
        
        // At the 'Generating Warning' stage, fire the real notifications!
        if (log.msg.includes('Emergency Protocol')) {
          // Play continuous siren
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          // Realistic City-Wide Emergency Warning Siren (Tsunami/Tornado style)
          const lfo = ctx.createOscillator();
          lfo.type = 'triangle';
          lfo.frequency.value = 0.2; // 5 seconds per full sweep cycle
          
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 250; // Sweep up and down by 250Hz
          
          osc.type = 'sawtooth'; // Harsh mechanical motor sound
          osc.frequency.value = 650; // Base frequency (sweeps between 400Hz and 900Hz)
          
          // Connect LFO to Oscillator Frequency
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNode.gain.value = 0.15; // Volume
          
          osc.start();
          lfo.start();
          
          sirenOscillatorRef.current = {
            stop: () => {
              try { osc.stop(); lfo.stop(); } catch(e) {}
            }
          };
          setIsSirenPlaying(true);
          
          const finalAlertMsg = activeScenario.alertMsg.replace(/{LOCATION}/g, location);
          triggerPushNotification(finalAlertMsg);

          // FIRE LIVE EMAIL ALERTS
          let targetCitizens = citizens;
          if (dispatchTarget === 'district') {
            targetCitizens = citizens.filter(c => c.district === location);
            setLogs((prev) => [...prev, `[SYSTEM] Isolating targets for ${location}... Found ${targetCitizens.length} citizens.`]);
          } else {
            setLogs((prev) => [...prev, `[SYSTEM] Broadcast mode activated. Targeting all ${citizens.length} registered citizens.`]);
          }

          if (targetCitizens.length > 0) {
            targetCitizens.forEach((user, idx) => {
              if (user && user.email) {
                setTimeout(() => {
                  setLogs((prev) => [...prev, `[DISPATCH] Routing Email to ${user.name} (${user.email}) [${user.language || 'en'}]...`]);

                    // Retrieve translation for this specific user
                    const userLang = user.language || 'en';
                    const baseMsgForUser = userLang === 'en' ? activeScenario.alertMsg : (activeScenario.translations?.[userLang] || activeScenario.alertMsg);
                    const finalAlertMsgForUser = baseMsgForUser.replace(/{LOCATION}/g, location);

                    sendEmailAlert(user.email, user.name, finalAlertMsgForUser).then(result => {
                    if (result && result.ok) {
                      if (result.simulated) {
                        setLogs((prev) => [...prev, `[EMAIL] Simulated delivery for ${user.email} (Awaiting EmailJS Keys)`]);
                          setTimeout(() => { setLogs((prev) => [...prev, `[WHATSAPP] Alert pushed to +91-${user.phone || '9XXXX'} via WhatsApp Business API`]); }, 600);
                          setTimeout(() => { setLogs((prev) => [...prev, `[MESH-NET] Relayed offline alert via Bluetooth P2P Mesh`]); }, 1200);
                      } else {
                        setLogs((prev) => [...prev, `[EMAIL] SUCCESS: Delivered to ${user.email}`]);
                      }
                    } else {
                      setLogs((prev) => [...prev, `[EMAIL] FAILED for ${user.email}: ${result.description}`]);
                      // FORCE POPUP SO USER SEES THE ERROR
                      window.alert(`EmailJS Failed to send to ${user.email}!\n\nExact Error from EmailJS:\n"${result.description}"\n\nPlease copy this error and tell the AI!`);
                    }
                  });
                }, idx * 1000); // Stagger API requests to prevent rate limiting
              } else if (user && !user.email) {
                setLogs((prev) => [...prev, `[DISPATCH] Skipped ${user.name} (No email provided)`]);
              }
            });
          }
        }
      }, log.delay);
    });

    // Simulate the rest of the SMS sending progress
    setTimeout(() => {
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 2;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressInterval);
          setLogs((prev) => [
            ...prev, 
            '[DISPATCH] SUCCESS: Alert broadcast complete.',
            `[DISPATCH] ${citizens.length > 0 ? citizens.length : '10,000+'} SMS messages processed.`,
            '[SYSTEM] Disaster simulation concluded.'
          ]);
          setIsSimulating(false);
        }
        setProgress(currentProgress);
      }, 300);
    }, 11000);
  };

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, progress]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  return (
    <div className="page-enter mx-auto w-full max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3">
            <Activity className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text--600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Simulation sandbox online
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Virtual Environment Simulation</h1>
            <p className="mt-1 text-sm leading-6 text-slate-700">Test automated early-warning, multilingual dispatch, and response coordination without waiting for a real disaster.</p>
          </div>
        </div>
        {isSirenPlaying && (
          <button 
            onClick={stopSiren}
            className="animate-pulse bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            STOP SIREN
          </button>
        )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-700">Scenario</div><strong className="mt-1 block text-slate-900">{scenarios[scenario].title}</strong></div>
          <div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-700">Target</div><strong className="mt-1 block truncate text-slate-900">{location}</strong></div>
          <div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-700">Dispatch scope</div><strong className="mt-1 block text-slate-900">{dispatchTarget === 'all' ? 'All citizens' : 'District only'}</strong></div>
          <div className={`rounded-xl p-3 ${isSimulating ? 'bg-amber-50' : 'bg-emerald-50'}`}><div className={isSimulating ? 'text--600' : 'text-emerald-700'}>Engine status</div><strong className={`mt-1 block ${isSimulating ? 'text-amber-900' : 'text-emerald-900'}`}>{isSimulating ? `${progress}% processing` : 'Ready to run'}</strong></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-blue-800"><Zap className="h-4 w-4" /> One-click crisis injector</div>
          <p className="mt-1 text-xs text--600">Load a stakeholder-ready scenario and watch the dispatch timeline, rerouting, and multilingual broadcast respond together.</p>
          <div className="mt-3 inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-blue-100/50 p-1.5 rounded-2xl border border-blue-200/60 shadow-inner w-full sm:w-auto">
            {[
              ['earthquake', 'M7.2 Manipur + NH-2 slides', '🌋'],
              ['landslide', 'NH-6 Meghalaya blockage', '⛰️'],
              ['flood', 'Brahmaputra flash flood', '🌊'],
            ].map(([key, label, icon]) => (
              <button 
                key={key} 
                onClick={() => { setScenario(key); setLocation(key === 'earthquake' ? 'Imphal, Manipur' : key === 'flood' ? 'Cachar, Assam' : 'Dima Hasao, Assam'); }} 
                disabled={isSimulating} 
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-300 ease-out rounded-xl ${
                  scenario === key 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-1 ring-blue-500 scale-100' 
                    : 'text-blue-700 hover:text-blue-900 hover:bg-white/80 scale-95 opacity-90 hover:opacity-100 hover:scale-100'
                }`}
              >
                <span className="text-base">{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-900"><Volume2 className="h-4 w-4 text-emerald-600" /> AI audio dispatcher</div>
          <div className="mt-3 flex gap-2">
            <select value={audioLanguage} onChange={event => setAudioLanguage(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-semibold"><option>Meitei</option><option>Mizo</option><option>Khasi</option></select>
            <button onClick={playDispatcherAudio} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">Play alert</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wider text-slate-700">Manual coordination</div><div className="mt-2 flex items-end justify-between"><b className="text-4xl text-slate-700">4h</b><span className="text-xs font-semibold text-slate-700">historical baseline</span></div><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-2 w-full rounded-full bg-slate-400" /></div></div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="text-xs font-black uppercase tracking-wider text-emerald-700">GARUD AI response</div><div className="mt-2 flex items-end justify-between"><b className="text-4xl text-emerald-700">45s</b><span className="text-xs font-semibold text-emerald-700">automated dispatch</span></div><div className="mt-3 h-2 rounded-full bg-emerald-100"><div className="h-2 w-1/5 rounded-full bg-emerald-500" /></div></div>
      </div>

      {/* Row 1: Control Panel and Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Control Panel */}
        
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500 w-5 h-5" />
              Scenario Control
            </h2>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              Trigger a simulated extreme weather event to see how GARUD's AI automatically detects risk, elevates the threat level, and dispatches multi-lingual SMS alerts.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Event Type</label>
                <select 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  disabled={isSimulating}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all cursor-pointer font-medium"
                >
                  {Object.entries(scenarios).map(([key, data]) => (
                    <option key={key} value={key}>{data.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Affected District (NER)</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSimulating}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all cursor-pointer font-medium"
                >
                  {nerDistricts.map((dist, idx) => (
                    <option key={idx} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                Dispatch Target Audience
              </label>
              <div className="flex flex-col gap-2">
                <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${dispatchTarget === 'district' ? 'bg-blue-50 border-blue-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                  <input 
                    type="radio" 
                    name="dispatchTarget" 
                    value="district" 
                    checked={dispatchTarget === 'district'} 
                    onChange={() => setDispatchTarget('district')}
                    className="w-4 h-4 text-blue-600"
                    disabled={isSimulating}
                  />
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Affected District Only</div>
                    <div className="text-xs text-slate-700">Only send emails to citizens living in {location}</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${dispatchTarget === 'all' ? 'bg-red-50 border-red-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                  <input 
                    type="radio" 
                    name="dispatchTarget" 
                    value="all" 
                    checked={dispatchTarget === 'all'} 
                    onChange={() => setDispatchTarget('all')}
                    className="w-4 h-4 text-red-600"
                    disabled={isSimulating}
                  />
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Broadcast to All (Test Mode)</div>
                    <div className="text-xs text-slate-700">Send the email to EVERY registered citizen in the DB</div>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={startSimulation}
              disabled={isSimulating}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${isSimulating ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'}`}
            >
              {isSimulating ? (
                <> <Radio className="w-5 h-5 animate-pulse" /> Simulation Running... </>
              ) : (
                <> <AlertTriangle className="w-5 h-5" /> Trigger Simulation </>
              )}
            </button>
          </div>

          {/* SMS Preview Panel */}
          {logs.length > 6 && (
            <FadeIn>
              <div className="bg-slate-100 rounded-xl shadow-lg border-4 border-slate-300 p-4 relative overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white rounded-b-xl z-10"></div>
                <div className="flex items-center gap-2 text-slate-700 mb-4 pb-2 border-b border-slate-300">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">User Device Preview</span>
                </div>
                <div className="bg-green-50 rounded-lg p-3 relative">
                  <p className="text-xs font-bold text-green-800 mb-1">GARUD EMERGENCY ALERT</p>
                  <p className="text-sm text-slate-900 font-medium">{scenarios[scenario].alertMsg.replace(/{LOCATION}/g, location)}</p>
                  <p className="text-[10px] text-slate-700 mt-2 pt-2 border-t border-green-200">
                    Received: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </FadeIn>
          )}
        
        </div>
        <div className="lg:col-span-2 h-[600px]">
          {/* System Terminal Log */}
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white font-mono shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-amber-400"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
            </div>
            <span className="text-xs tracking-wider text-slate-700">GARUD DISPATCH TERMINAL</span>
          </div>
          
          <div ref={terminalContainerRef} className="flex-1 overflow-y-auto bg-white p-5 text-sm">
            {logs.length === 0 && !isSimulating && (
              <div className="mt-20 text-center text-slate-700">
                GARUD Intelligence Engine Online. Monitoring live telemetry...
              </div>
            )}
            
            {logs.map((log, idx) => (
              <div key={idx} className="mb-2 flex items-start gap-3">
                <span className="text-slate-700">[{new Date().toISOString().substring(11, 19)}]</span>
                <span className={`flex-1 ${
                  log.includes('CRITICAL') ? 'font-bold text-red-600' :
                  log.includes('SUCCESS') ? 'font-bold text-emerald-600' :
                  log.includes('[DISPATCH]') ? 'text--600' :
                  'text-emerald-700'
                }`}>
                  {log}
                </span>
              </div>
            ))}

            {isSimulating && logs.length > 9 && progress < 100 && (
              <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex justify-between text-xs text-slate-700">
                  <span>Dispatch Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 truncate text-xs text-slate-700 animate-pulse">
                  Sending to +91-{Math.floor(Math.random() * 90000) + 10000}*****...
                </div>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
        </div>
      </div>

      

      {/* Row 2: 3D Scenarios and Concept */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
        <div className="lg:col-span-2 space-y-6">
          <LandslideMechanics3D isSimulating={isSimulating} />
            {/* 3D Geological Visualizer (Now below terminal) */}
          <Geological3DVisualizer isSimulating={isSimulating} dispatchTarget={dispatchTarget} />
        </div>
        <div className="lg:col-span-1 h-full">
          {/* Concept & Working Side Column */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
           <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
             <Activity className="w-5 h-5 text-blue-600" />
             How This Simulation Works
           </h3>
           <div className="space-y-4 text-sm text-slate-700 flex-1 overflow-y-auto pr-2">
             <p>
               <strong>Concept:</strong> The Virtual Environment Simulation is designed to demonstrate GARUD's automated capabilities during a high-stress emergency event, without waiting for a real disaster to occur.
             </p>
             <p>
               <strong>The AI Dispatcher:</strong> When you initiate the simulation, the system mocks live telemetry from IoT sensors across the selected zone. Once risk thresholds cross <span className="font-mono text-red-500 bg-red-50 px-1 rounded">90%</span>, the AI engine autonomously takes control.
             </p>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 text-xs">
                <ol className="list-decimal pl-4 space-y-2">
                  <li><strong>Detection:</strong> Predicts impending slope failure using meteorological spikes.</li>
                  <li><strong>Alerting:</strong> Sounds regional sirens and broadcasts automated SMS warnings to registered citizens.</li>
                  <li><strong>Mobilization:</strong> Dispatches NDRF/SDRF field units based on nearest geolocation.</li>
                </ol>
             </div>
             <p>
               <strong>Zero-Latency Action:</strong> Notice how the terminal streams commands in real-time. In a genuine deployment, this eliminates the critical "human deliberation" delay that often costs lives during sudden flash floods or night-time landslides.
             </p>
           </div>

           {/* Live Diagnostics Metrics to fill the vertical space */}
           <div className="mt-6 pt-6 border-t border-slate-100">
             <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                 <Cpu className="w-4 h-4" /> Engine Status
               </span>
               <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isSimulating ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
                 {isSimulating ? 'LIVE DISPATCH MODE' : 'STANDBY'}
               </span>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 rounded p-3 border border-slate-100 relative overflow-hidden">
                 <div className="text-[10px] text-slate-700 uppercase font-bold mb-1">Latency</div>
                 <div className="text-lg font-mono font-bold text-slate-700 flex items-baseline gap-1">
                   {isSimulating ? (Math.floor(Math.random() * 8) + 4) : '0'} <span className="text-[10px] text-slate-700 font-sans">ms</span>
                 </div>
                 {isSimulating && <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-400"></div>}
               </div>
               
               <div className="bg-slate-50 rounded p-3 border border-slate-100 relative overflow-hidden">
                 <div className="text-[10px] text-slate-700 uppercase font-bold mb-1">AI Confidence</div>
                 <div className="text-lg font-mono font-bold text-slate-700 flex items-baseline gap-1">
                   {isSimulating ? '99.9' : '---'}<span className="text-[10px] text-slate-700 font-sans">%</span>
                 </div>
                 {isSimulating && <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>}
               </div>
               
               <div className="bg-slate-50 rounded p-3 border border-slate-100 col-span-2 relative">
                 <div className="flex justify-between items-end mb-2">
                   <div className="text-[10px] text-slate-700 uppercase font-bold">Network Load</div>
                   <div className="text-[10px] font-mono text-slate-700">{isSimulating ? 'HIGH THROUGHOUT' : 'IDLE'}</div>
                 </div>
                 <div className="flex items-end gap-[2px] h-8 w-full">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className={`flex-1 rounded-t-sm transition-all duration-300 ${isSimulating ? 'bg-blue-500' : 'bg-slate-200'}`} style={{
                        height: isSimulating ? `${Math.floor(Math.random() * 80) + 20}%` : '10%'
                      }}></div>
                    ))}
                 </div>
               </div>
             </div>
           </div>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <EvacuationSimulation />
        <LogisticsDemo />
        <div className="xl:col-span-2">
          <MultiModalLogisticsDemo />
        </div>
      </div>
    </div>
  );
}
