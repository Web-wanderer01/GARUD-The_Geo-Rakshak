import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { zones } from '../../data/zones';
import { roads } from '../../data/roads';
import { Bot, User, Loader2, Send, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GEMINI_PLACEHOLDER_VALUES = new Set([
  'paste_your_gemini_key_here',
  'your_gemini_api_key_here',
  'your_api_key_here',
]);

export default function GeminiAssistant() {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Hello Commander. I am the Geo-Rakshak AI Logistics Engine. I have real-time access to the landslide risk map and road blockages across the NER. How can I assist with triage or routing today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  const apiKey = rawApiKey && !GEMINI_PLACEHOLDER_VALUES.has(rawApiKey.toLowerCase()) ? rawApiKey : '';
  const client = apiKey ? new GoogleGenAI({ apiKey }) : null;
  console.log("DIAGNOSTICS: GeminiAssistant API key length is", apiKey ? apiKey.length : 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !client) return;

    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      // Build a contextual prompt with live data
      const systemContext = `
You are Geo-Rakshak, an advanced AI Logistics and Triage Commander for the North Eastern Region (NER) of India.
You help disaster management authorities route medical convoys and evaluate landslide risks.

CURRENT RISK ZONES (0-100 scale, >75 is critical):
${zones.map(z => `- ${z.name}, ${z.state}: Risk ${z.riskScore}/100, Rainfall ${z.rainfall24h}mm, Slope ${z.slopeAngle}°`).join('\n')}

CURRENT ROAD BLOCKAGES:
${roads.map(r => `- ${r.name} (${r.from} to ${r.to}): ${r.status.replace('_', ' ')} (Delay: ${r.delay})`).join('\n')}

INSTRUCTIONS:
1. When asked for a route, avoid roads marked as BLOCKED or PARTIALLY BLOCKED if possible.
2. If forced to route through high-risk zones (>75 risk), explicitly warn the user.
3. Keep responses concise, authoritative, and focused on logistics/safety.
4. Format responses using Markdown (bullet points, bold text).
      `;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction: systemContext,
        }
      });

      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: `❌ Error: ${error.message || 'Failed to connect to the Gemini AI Engine. Please check your API key or network connection.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center h-full text-center">
        <ShieldAlert className="w-12 h-12 text-slate-400 mb-3" />
        <h3 className="text-lg font-bold text-slate-700">AI Engine Offline</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md">The Gemini AI Logistics Engine requires a valid API key. Add VITE_GEMINI_API_KEY to your .env.local file to activate autonomous routing.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">Gemini AI Command</h3>
          <p className="text-xs text-blue-300">Geo-Rakshak Logistics Engine</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-sm prose-blue max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-slate-500 font-medium">Calculating logistics...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., Safest route from Guwahati to Silchar?"
            className="w-full bg-slate-100 border-none rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
