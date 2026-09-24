import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Loader2, Plus, Sparkles, ShieldAlert, MapPin, Zap, FileText, MessageSquare, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

/* ─── Static data ─────────────────────────────────────────────────── */
const SUGGESTIONS = [
  'Analyze flood risk in Assam',
  'Map alternative routes to Tawang',
  'Generate evacuation protocol for Meghalaya',
  'Draft situational report for NER',
  'Show active landslide alerts',
];

const QUICK_ACTIONS = [
  { icon: <MapPin  className="w-4 h-4"/>, label: 'Live Risk Map',   prompt: 'Show current landslide risk levels across all NER districts with a concise summary and risk scores.' },
  { icon: <ShieldAlert className="w-4 h-4"/>, label: 'Active Alerts',  prompt: 'List all critical and high-severity landslide/flood alerts in NER. Include location, severity, and recommended immediate action.' },
  { icon: <Zap     className="w-4 h-4"/>, label: 'Evacuation Plan', prompt: 'Generate a step-by-step emergency evacuation protocol for a high-risk landslide zone in Meghalaya. Include assembly points and contact numbers.' },
  { icon: <FileText className="w-4 h-4"/>, label: 'Sitrep',         prompt: 'Draft a formal one-page Situation Report (SITREP) for today\'s NER disaster management status: rainfall, active alerts, road blockages, and relief camp status.' },
];

const RECENT_OPS = [
  { title: 'NH-10 Blockage – Alternate Routes',  status: 'Active' },
  { title: 'Tawang Airdrop Planning',            status: 'Completed' },
  { title: 'Sikkim GLOF Early Warning Drill',    status: 'Archived' },
];

/* ─── Gemini REST helper ──────────────────────────────────────────── */
// Working models confirmed with this key — fastest first
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
];

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `You are GARUD AI — the Geo-Rakshak Autonomous United Response & Disaster AI.
You are the intelligent command assistant for disaster management in India's North Eastern Region (NER):
Assam · Meghalaya · Manipur · Mizoram · Nagaland · Tripura · Arunachal Pradesh · Sikkim.

Specializations:
• Landslide risk analysis & early-warning sensor interpretation
• Emergency evacuation routing & relief camp logistics
• Flood / GLOF / cyclone risk assessment
• Multi-agency coordination (NDRF, SDRF, Army, IAF, ISRO)
• LoRaWAN / IoT sensor network status
• Acoustic landslide sensor alerts
• Drone corridor planning for BVLOS medicine delivery
• Tribal dialect guidance (Khasi, Garo, Mizo, Bodo, Meitei, Nyishi)

RULES:
1. Always reply in the EXACT SAME LANGUAGE the user writes in (Hindi → Hindi, Assamese → Assamese, etc.)
2. Use clear markdown: headers, bullet points, **bold** for critical info
3. Be concise and actionable — commanders need intelligence, not essays
4. End every field-critical response with a ★ IMMEDIATE ACTION recommendation`;

async function callGemini(apiKey, messages, userMsg) {
  const contents = [
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMsg }] },
  ];

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `${API_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              temperature: 0.65,
              maxOutputTokens: 1500,
              topP: 0.9,
            },
          }),
        }
      );

      if (res.status === 404 || res.status === 400) continue; // model not available → try next
      if (res.status === 503 || res.status === 429) continue; // busy → try next

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }

      return res; // return the streaming response
    } catch (err) {
      if (model === MODELS[MODELS.length - 1]) throw err; // last model — rethrow
    }
  }
  throw new Error('All Gemini models are currently busy. Please try again in a moment.');
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function AIAssistant() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [isTyping,   setIsTyping]   = useState(false);
  const [isListening,setIsListening]= useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef       = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  // Accept both formats: old AIzaSy... and newer AQ. format from Google AI Studio
  const isKeyValid = apiKey && apiKey !== 'PASTE_YOUR_GEMINI_KEY_HERE' && (apiKey.startsWith('AIza') || apiKey.startsWith('AQ.'));


  /* auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* speech recognition setup */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-IN';
    rec.onresult = e => setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onerror  = () => setIsListening(false);
    rec.onend    = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) { alert('Voice input needs Chrome/Edge browser.'); return; }
    if (isListening) { recognitionRef.current.stop(); }
    else             { setIsListening(true); recognitionRef.current.start(); }
  };

  /* ── Send message ─────────────────────────────────────────────── */
  const sendMessage = async (text) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || isTyping) return;

    setInput('');
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    /* No valid key — show setup guide */
    if (!isKeyValid) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `## 🔑 API Key Required\n\nTo activate **GARUD Intelligence Engine**, you need a free Google Gemini API key.\n\n**3 quick steps:**\n1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**\n2. Click **"Create API key"** and copy it (starts with \`AIzaSy...\`)\n3. Open \`.env\` in your project root and set:\n\`\`\`\nVITE_GEMINI_API_KEY=AIzaSy...\n\`\`\`\n4. Restart the dev server: \`npm run dev\`\n\n> ✅ The Gemini API is **completely free** for development.`,
        }]);
        setIsTyping(false);
      }, 300);
      return;
    }

    /* Streaming response */
    try {
      const res = await callGemini(apiKey, messages, userMsg);

      // Insert blank assistant bubble
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      setIsTyping(false);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        for (const line of rawChunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const token  = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            if (token) {
              full += token;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', content: full };
                return next;
              });
            }
          } catch { /* skip malformed SSE chunks */ }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **GARUD Engine Error**\n\n${err.message}\n\n_Try again in a moment, or check your API key in \`.env\`._`,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const newChat = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const isLanding = messages.length === 0;

  /* ── JSX ──────────────────────────────────────────────────────── */
  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open GARUD AI"
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white shadow-[0_8px_32px_rgba(30,64,175,0.28),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-110 hover:bg-white/30 hover:shadow-[0_10px_40px_rgba(30,64,175,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)] animate-bounce"
        >
          <span className="absolute inset-1 rounded-full border border-white/25 bg-gradient-to-br from-blue-400/25 via-indigo-400/20 to-purple-500/25" />
          <Sparkles className="relative z-10 h-7 w-7 drop-shadow-[0_2px_4px_rgba(15,23,42,0.35)]" />
        </button>
      )}

      {/* Full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex text-white font-sans overflow-hidden backdrop-blur-sm">

          {/* Northeast India terrain background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85"
              alt="Misty Himalayan terrain in Northeast India"
              className="h-full w-full object-cover opacity-[0.42]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,35,58,0.78),rgba(8,55,47,0.54)_48%,rgba(12,30,55,0.78))]" />
            <div className="radar-grid absolute inset-0 opacity-20" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06172b]/70 to-transparent" />
            <div className="absolute left-6 top-6 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100/80 backdrop-blur-sm">
              NER terrain intelligence
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col w-full h-full">

            {/* Close button */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 transition-all hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto">

              {/* ══ LANDING ══════════════════════════════════════════ */}
              {isLanding ? (
                <div className="min-h-full flex flex-col items-center justify-center px-4 pt-16 pb-10 max-w-4xl mx-auto">

                  {/* Logo + Greeting */}
                  <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_44px_rgba(99,102,241,0.45)] border-2 border-white/20">
                      <Sparkles className="w-9 h-9" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-2 tracking-tight leading-tight">
                      System Online, Commander.
                      <br />
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        What's the situation?
                      </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-3">
                      GARUD Intelligence Engine · NER Disaster Management · Multi-Language
                      {!isKeyValid && <span className="garud-alert-badge ml-2 rounded-md px-2 py-1">⚠ API Key Missing</span>}
                    </p>
                  </div>

                  {/* Input box */}
                  <div className="garud-ai-container w-full max-w-3xl rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-blue-400/40 transition-all">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Message GARUD Intelligence Engine..."
                      rows={2}
                      className="w-full bg-transparent text-slate-900 placeholder-slate-500 resize-none outline-none border-none focus:ring-0 px-6 pt-5 pb-2 text-[17px] leading-relaxed min-h-[80px]"
                    />
                    <div className="flex items-center justify-between px-4 pb-4">
                      <button onClick={newChat} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-blue-300 hover:text-white transition-colors" title="Clear">
                        <Plus className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMic}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse shadow-red-500/50' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`}
                          title="Voice Input"
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => sendMessage()}
                          disabled={!input.trim() || isTyping}
                          className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center disabled:opacity-40 hover:from-blue-400 hover:to-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
                          title="Send"
                        >
                          <Send className="w-5 h-5 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion pills */}
                  <div className="flex flex-wrap justify-center gap-2.5 mt-7 max-w-3xl">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="garud-ai-container px-4 py-2.5 rounded-full text-sm text-slate-800 hover:bg-white/90 hover:border-blue-400/40 transition-all active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Quick action grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 w-full max-w-3xl">
                    {QUICK_ACTIONS.map(qa => (
                      <button
                        key={qa.label}
                        onClick={() => sendMessage(qa.prompt)}
                        className="garud-ai-container rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-white/90 hover:border-blue-400/40 transition-all group active:scale-95"
                      >
                        <span className="text-blue-300 group-hover:text-blue-200 transition-colors">{qa.icon}</span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">{qa.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Bottom cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 w-full max-w-3xl">

                    {/* Telemetry card */}
                    <button
                      onClick={() => sendMessage('Analyze current NER sensor telemetry. What are the top 3 highest-risk districts right now based on rainfall and soil moisture data?')}
                      className="garud-ai-container rounded-2xl p-6 hover:bg-white/90 hover:border-blue-400/40 transition-all group text-left active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2 text-blue-300 text-xs mb-3 font-bold uppercase tracking-widest">
                        📡 Telemetry Integration
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">Analyze Sensor Data</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Cross-reference live rainfall, soil moisture, and acoustic sensor data across NER.
                      </p>
                    </button>

                    {/* Operations card */}
                    <div className="garud-ai-container rounded-2xl p-6">
                      <div className="flex items-center gap-2 text-blue-700 text-xs mb-4 font-bold uppercase tracking-widest">
                        <MessageSquare className="w-4 h-4" /> Ongoing Operations
                      </div>
                      <div className="space-y-2">
                        {RECENT_OPS.map(op => (
                          <button
                            key={op.title}
                            onClick={() => sendMessage(`Give me a status update and strategic recommendations for the operation: "${op.title}"`)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-slate-200 group text-left active:scale-[0.98]"
                          >
                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white font-medium truncate group-hover:text-blue-300 transition-colors">{op.title}</div>
                              <div className={`text-xs mt-0.5 ${op.status === 'Active' ? 'text-green-400' : op.status === 'Completed' ? 'text-slate-400' : 'text-yellow-400'}`}>
                                ● {op.status}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-8 text-xs text-slate-500 text-center uppercase tracking-widest">
                    Supports Hindi · Assamese · Bengali · Meitei · Khasi · Garo · English & more
                  </p>
                </div>

              ) : (

                /* ══ CHAT VIEW ═══════════════════════════════════════ */
                <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pt-16 pb-8 space-y-6">

                  <div className="flex justify-center">
                    <button
                      onClick={newChat}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-slate-300 hover:bg-white/20 hover:text-white transition-all"
                    >
                      <Plus className="w-4 h-4 text-blue-400" /> New Intelligence Brief
                    </button>
                  </div>

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center mt-1 shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-white/20">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`rounded-2xl px-5 py-4 max-w-[82%] shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600/80 backdrop-blur border border-blue-400/30 text-white'
                          : 'bg-white/10 backdrop-blur-xl border border-white/15 text-slate-100'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-blue-300 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-headings:text-blue-200 prose-code:text-cyan-300">
                            <ReactMarkdown>{msg.content || '▌'}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center border border-white/20">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl border border-white/15 px-5 py-4 rounded-2xl flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Fixed bottom input (chat view only) */}
            {!isLanding && (
              <div className="shrink-0 px-4 pb-6 pt-2 bg-gradient-to-t from-[#080f1f]/95 to-transparent">
                <div className="garud-ai-container max-w-3xl mx-auto rounded-2xl flex items-end gap-2 p-2 focus-within:ring-2 focus-within:ring-blue-400/50 transition-all">
                  <button onClick={newChat} className="p-3 text-blue-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="New Chat">
                    <Plus className="w-5 h-5" />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Message GARUD Intelligence Engine..."
                    className="flex-1 max-h-40 min-h-[50px] bg-transparent border-none focus:ring-0 resize-none py-3.5 text-[15px] text-white placeholder-slate-400 outline-none leading-relaxed"
                    rows={1}
                  />
                  <div className="flex items-center gap-2 pb-1 pr-1">
                    <button
                      onClick={toggleMic}
                      className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                      title="Voice Input"
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isTyping}
                      className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 disabled:opacity-40 transition-all shadow-lg shadow-indigo-900/40"
                      title="Send"
                    >
                      {isTyping
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <Send className="w-5 h-5 ml-0.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
