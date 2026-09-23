import React, { useState, useEffect, useRef } from 'react';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import FadeIn from '../components/common/FadeIn';
import { Mic, MicOff, Volume2, VolumeX, Globe, Radio, Send, CheckCircle, Bell, Play, Languages, X } from 'lucide-react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';

const LANGUAGES = [
  { id:'khasi',    name:'Khasi',    region:'Meghalaya',  speakers:'1.4M',  flag:'🏔️' },
  { id:'garo',     name:'Garo',     region:'Meghalaya',  speakers:'1.1M',  flag:'🌿' },
  { id:'mizo',     name:'Mizo',     region:'Mizoram',    speakers:'0.9M',  flag:'🏡' },
  { id:'bodo',     name:'Bodo',     region:'Assam',      speakers:'1.5M',  flag:'🌾' },
  { id:'meitei',   name:'Meitei',   region:'Manipur',    speakers:'1.8M',  flag:'🎭' },
  { id:'assamese', name:'Assamese', region:'Assam',      speakers:'15M',   flag:'🌊' },
  { id:'ao',       name:'Ao Naga',  region:'Nagaland',   speakers:'0.3M',  flag:'🦅' },
  { id:'nyishi',   name:'Nyishi',   region:'Arunachal',  speakers:'0.4M',  flag:'⛰️' },
];

const TRANSLATIONS = {
  'Flood warning':     { khasi:'Shong Rymphaw Ktah', garo:'Dak·kang Chengchi', mizo:'Tuipui Hlim Tur', bodo:'Bai Pani Alarm', meitei:'Tril Alarm Oikhre', assamese:'বানপানীৰ সতৰ্কবাৰ্তা', ao:'Nung Tala Alarm', nyishi:'Khe Alarm Pata' },
  'Evacuate now':      { khasi:'Ia leit mynta!', garo:'Songenga angan!', mizo:'Rawn dan rawh!', bodo:'Dao jakhon!', meitei:'Chatpa mateng!', assamese:'এতিয়াই সৰি যাওক!', ao:'Nok temsang!', nyishi:'Pa lo pio!' },
  'Help needed':       { khasi:'Dei ban kynnmaw', garo:'Dok·ko daban', mizo:'Thiam tur a ngai', bodo:'Sahajya chai', meitei:'Haiba thoubal', assamese:'সাহায্যৰ প্ৰয়োজন', ao:'Pong tala', nyishi:'Yullo hai' },
  'Medical emergency': { khasi:'Kordor jaied', garo:'Dok·a·ni grik', mizo:'Zairawl tur a tel', bodo:'Swastha khobor', meitei:'Mami khara', assamese:'চিকিৎসাৰ জৰুৰী অৱস্থা', ao:'Imna tala', nyishi:'Mede pipi' },
  'Road blocked':      { khasi:'Siala ka dieng', garo:'Rangsa angan', mizo:'Lam a khat', bodo:'Ras bandha', meitei:'Lam athing', assamese:'ৰাস্তা বন্ধ', ao:'Tela sum', nyishi:'Mendo piye' },
  'Landslide risk':    { khasi:'Ri Ïew Ka Jynud', garo:'Mande Dokmang', mizo:'Lei a tla thla', bodo:'Mati Khasao', meitei:'Makhol Yawkhom', assamese:'ভূস্খলনৰ আশংকা', ao:'Pung tala asang', nyishi:'Mendo chu risk' },
};

const BROADCAST_MSG = {
  khasi:    'GARUD IAIPHUD: Pyrthei ka sah ha nongkyndong. Ia leit mynta sha relief camp. Ioh 112.',
  garo:     'GARUD ALARM: Da·bita·a songenga angan. Dok·ko relief camp. 112 cha·on.',
  mizo:     'GARUD HRIATTHIAM: Phung buatsaih a awm. Rawn dan tur. 112 en rawh.',
  bodo:     'GARUD KHOBOR: Mati khisaw alarm. Dao jakhon relief camp. 112 phone khou.',
  meitei:   'GARUD ALARM: Yum lum alarm oikhre. Chatpa mateng relief camp. 112 kari.',
  assamese: 'GARUD সকীয়নী: আপোনাৰ অঞ্চলত ভূস্খলনৰ আশংকা। এতিয়াই সৰি যাওক। ১১২ নম্বৰত ফোন কৰক।',
  ao:       'GARUD ALARM: Pung tala asang. Nok temsang relief camp. 112 kari.',
  nyishi:   'GARUD ALARM: Mendo chu alarm. Pa lo pio relief camp. 112 pata.',
};

const INIT_LOG = [
  { time:'06:12', lang:'Assamese', region:'Assam',    count:12847 },
  { time:'06:08', lang:'Khasi',    region:'Meghalaya',count:8234  },
  { time:'05:54', lang:'Meitei',   region:'Manipur',  count:6712  },
  { time:'05:41', lang:'Mizo',     region:'Mizoram',  count:9104  },
  { time:'05:30', lang:'Bodo',     region:'Assam',    count:4521  },
];

export default function DialectsPage() {
  const [selLang, setSelLang] = useState('assamese');
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [ttsText, setTtsText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState(INIT_LOG);
  const [broadcastCount, setBroadcastCount] = useState({});
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.0);
  const [autoVoice, setAutoVoice] = useState(true);
  const recRef = useRef(null);

  const curLang = LANGUAGES.find(l => l.id === selLang) || LANGUAGES[5];

  // Speech Recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = selLang === 'assamese' ? 'as-IN' : 'en-IN';
    rec.onresult = e => setTranscript(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    recRef.current = rec;
  }, [selLang]);

  const toggleMic = () => {
    if (!recRef.current) { alert('Voice requires Chrome/Edge browser.'); return; }
    if (isRecording) { recRef.current.stop(); }
    else { setIsRecording(true); recRef.current.start(); }
  };

  const translate = () => {
    const match = Object.keys(TRANSLATIONS).find(k => transcript.toLowerCase().includes(k.toLowerCase()));
    if (match) setTranslation(TRANSLATIONS[match][selLang] || 'Translation available in demo phrases only.');
    else setTranslation(`[Auto-translate demo] "${transcript}" → ${curLang.name}: Phrase not in demo dictionary. In production, Bhashini API provides full translation.`);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = selLang === 'assamese' ? 'as-IN' : 'en-IN';
    utt.rate = rate;
    utt.pitch = pitch;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeech = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); };

  const broadcast = (langId) => {
    const lang = LANGUAGES.find(l => l.id === langId);
    if (autoVoice) speak(BROADCAST_MSG[langId]);
    setBroadcastCount(prev => ({ ...prev, [langId]: (prev[langId] || 0) + 1 }));
    setBroadcastLog(prev => [{
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      lang: lang.name, region: lang.region,
      count: Math.floor(2000 + Math.random() * 15000)
    }, ...prev.slice(0, 9)]);
  };

  return (
    <div className="page-enter relative pb-10 bg-white min-h-screen">
      <BackgroundAnimation variant="pulse" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">

        <FadeIn direction="down">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-black text-slate-900">🗣️ CommHub — बहुभाषी केंद्र</h1>
              <p className="text-slate-700 text-sm">Tribal & Local Multilingual Emergency Communication · NER</p>
            </div>
            <div className="flex items-center gap-3">
              <SimulatedDataBadge />
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <div className={`relative w-10 h-5 rounded-full transition-colors ${autoVoice?'bg-purple-600':'bg-slate-200'}`}
                  onClick={() => setAutoVoice(!autoVoice)}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${autoVoice?'translate-x-5':'translate-x-0.5'}`} />
                </div>
                Auto-Voice Alerts
              </label>
            </div>
          </div>
        </FadeIn>

        {/* Language Selector */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-purple-200 p-5">
            <h2 className="text-sm font-bold text--600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4"/> Select Language / भाषा चुनें
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LANGUAGES.map(l => (
                <button key={l.id} onClick={() => { setSelLang(l.id); setTranslation(''); }}
                  className={`p-3 rounded-xl border text-left transition-all ${selLang===l.id?'border-purple-200 bg-purple-500/20 shadow-lg shadow-purple-900/30':'border-slate-200 bg-white hover:border-purple-200'}`}>
                  <div className="text-xl mb-1">{l.flag}</div>
                  <div className="font-bold text-slate-900 text-sm">{l.name}</div>
                  <div className="text-xs text-slate-700">{l.region}</div>
                  <div className="text-[10px] text--600 mt-0.5">{l.speakers} speakers</div>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Voice to Text */}
          <FadeIn>
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-blue-200 p-5 space-y-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><Mic className="w-5 h-5 text--600"/> Voice-to-Text / आवाज़ से टेक्स्ट</h2>
              <div className="flex justify-center">
                <button onClick={toggleMic}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl font-bold text-white border-4 ${isRecording?'bg-red-500 border-red-200 animate-pulse scale-110 shadow-red-900/50':'bg-blue-600 border-blue-200 hover:bg-blue-500 hover:scale-105'}`}>
                  {isRecording ? <MicOff className="w-8 h-8"/> : <Mic className="w-8 h-8"/>}
                </button>
              </div>
              {isRecording && <div className="text-center text--600 text-sm font-semibold animate-pulse">● Recording... ({curLang.name})</div>}
              <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
                placeholder={`Speak or type in ${curLang.name} or English...`} rows={3}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm resize-none focus:border-blue-200 outline-none"/>

              {/* Phrase quick-add */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(TRANSLATIONS).map(phrase => (
                  <button key={phrase} onClick={() => setTranscript(phrase)}
                    className="text-xs px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text--600 hover:bg-blue-50 transition-colors">
                    {phrase}
                  </button>
                ))}
              </div>

              <button onClick={translate}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all">
                🔄 Translate to {curLang.name}
              </button>

              {translation && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="text-xs text--600 mb-1 font-bold">{curLang.flag} {curLang.name} Translation:</div>
                  <div className="text-slate-900 font-medium text-lg leading-relaxed">{translation}</div>
                  <button onClick={() => speak(translation)} className="mt-2 text-xs text--600 hover:text-slate-900 flex items-center gap-1">
                    <Volume2 className="w-3 h-3"/> Speak
                  </button>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Text to Speech */}
          <FadeIn>
            <div className="bg-slate-50 backdrop-blur rounded-2xl border border-green-200 p-5 space-y-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2"><Volume2 className="w-5 h-5 text--600"/> Text-to-Speech / वॉइस अलर्ट</h2>
              <textarea value={ttsText} onChange={e => setTtsText(e.target.value)} rows={4}
                placeholder={`Type emergency message in ${curLang.name} or English...`}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm resize-none focus:border-green-200 outline-none"/>

              {/* Quick templates */}
              <div className="flex flex-wrap gap-2">
                {['⚠️ Flood warning in your area!', '🏃 Evacuate immediately!', '🏥 Medical help coming.', '📍 Move to relief camp.'].map(t => (
                  <button key={t} onClick={() => setTtsText(t)} className="text-xs px-2 py-1 rounded-lg bg-green-50 border border-green-200 text--600 hover:bg-green-50 transition-colors">{t}</button>
                ))}
              </div>

              {/* Rate/Pitch */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-700 block mb-1">Speed: {rate.toFixed(1)}x</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e=>setRate(+e.target.value)} className="w-full accent-green-500"/>
                </div>
                <div>
                  <label className="text-xs text-slate-700 block mb-1">Pitch: {pitch.toFixed(1)}</label>
                  <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e=>setPitch(+e.target.value)} className="w-full accent-green-500"/>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => speak(ttsText || BROADCAST_MSG[selLang])} disabled={isSpeaking}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                  {isSpeaking ? <><span className="animate-pulse">●</span> Speaking...</> : <><Play className="w-4 h-4"/> Speak in {curLang.name}</>}
                </button>
                <button onClick={stopSpeech} className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-600 text-slate-900 transition-all">
                  <VolumeX className="w-5 h-5"/>
                </button>
              </div>

              {isSpeaking && (
                <div className="flex items-center justify-center gap-1 py-2">
                  {[...Array(8)].map((_,i) => (
                    <div key={i} className="w-1.5 bg-green-400 rounded-full animate-bounce"
                      style={{height:`${8+Math.random()*16}px`, animationDelay:`${i*0.1}s`}}/>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Emergency Broadcast Panel */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-red-200 p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text--600"/> Emergency Broadcast Panel — सभी भाषाओं में
            </h2>
            <p className="text-xs text-slate-700 mb-4">Pre-composed GARUD emergency alert. Click Broadcast to send to all registered devices in that language region.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {LANGUAGES.map(l => (
                <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{l.flag}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{l.name}</div>
                      <div className="text-xs text-slate-700">{l.region}</div>
                    </div>
                    {(broadcastCount[l.id] || 0) > 0 && (
                      <span className="ml-auto text-xs bg-red-50 text--600 border border-red-200 px-2 py-0.5 rounded-full">{broadcastCount[l.id]}×</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-700 leading-relaxed line-clamp-2">{BROADCAST_MSG[l.id]}</p>
                  <div className="flex gap-2">
                    <button onClick={() => speak(BROADCAST_MSG[l.id])}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-green-50 text--600 border border-green-200 hover:bg-green-600/50 transition-colors flex items-center justify-center gap-1">
                      <Volume2 className="w-3 h-3"/> Speak
                    </button>
                    <button onClick={() => broadcast(l.id)}
                      className="flex-1 text-xs py-1.5 rounded-lg bg-red-600/40 text-red-200 border border-red-200 hover:bg-red-600/60 transition-colors font-bold flex items-center justify-center gap-1">
                      <Radio className="w-3 h-3"/> Broadcast
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Broadcast Log */}
        <FadeIn>
          <div className="bg-slate-50 backdrop-blur rounded-2xl border border-slate-300/50 p-5">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text--600"/> Broadcast Log</h2>
            <div className="space-y-2">
              {broadcastLog.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm">
                  <span className="text-slate-700 font-mono text-xs shrink-0">{entry.time}</span>
                  <span className="font-bold text--600">{entry.lang}</span>
                  <span className="text-slate-700 text-xs">→ {entry.region}</span>
                  <span className="ml-auto text--600 font-bold text-xs">{entry.count.toLocaleString()} devices ✅</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
