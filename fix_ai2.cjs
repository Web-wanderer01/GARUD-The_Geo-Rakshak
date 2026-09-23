const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

const returnRegex = /  return \([\s\S]*?\);\n\}/;
const newRender = `  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050B14]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          
          {/* 3D Interactive / Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col items-center relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] border border-white/10 z-10">
            
            {/* Header branding */}
            <div className="pt-8 pb-4 text-center w-full z-10 flex-shrink-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-wider uppercase text-sm">GARUD Voice AI</h2>
            </div>

            {/* Glowing Orb Container */}
            <div className="relative w-48 h-48 flex items-center justify-center mt-6 mb-8 flex-shrink-0">
              {/* Dynamic Aura */}
              <div className={\`absolute inset-0 bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 rounded-full blur-3xl transition-all duration-700 \${isListening ? 'opacity-100 scale-150 animate-pulse' : (isTyping ? 'opacity-80 scale-110 animate-[spin_3s_linear_infinite]' : 'opacity-40 scale-100 animate-[pulse_4s_ease-in-out_infinite]')}\`}></div>
              
              {/* Core Orb */}
              <div className="absolute inset-6 bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-700 rounded-full shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden border border-white/20">
                <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
              </div>
            </div>

            {/* Subtitle / Status */}
            <div className="text-center px-12 z-10 w-full flex-1 flex flex-col min-h-0 pb-32">
              <p className="text-blue-300/80 text-sm font-medium uppercase tracking-widest mb-6 flex-shrink-0">
                {isListening ? "Listening..." : (isTyping ? "Thinking..." : "Tap to Speak")}
              </p>
              
              {/* Scrollable Text Area */}
              <div className="flex-1 overflow-y-auto w-full px-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                <div className="flex items-center justify-center min-h-full pb-8">
                  <p className="text-white/90 text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed font-light whitespace-pre-line">
                    {input ? (
                      <span className="text-cyan-300">{input}</span>
                    ) : (
                      messages[messages.length - 1]?.role === 'assistant' 
                        ? messages[messages.length - 1].content 
                        : ''
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-20 items-center bg-gradient-to-t from-slate-900/80 to-transparent pt-10 pb-2">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>
              
              <button 
                onClick={toggleListening} 
                className={\`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl \${isListening ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 scale-110' : 'bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md hover:scale-105'}\`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              {/* Hidden form to allow submit via enter if they somehow type */}
              <form onSubmit={handleSend} className="hidden">
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} />
                <button id="ai-send-btn" type="submit"></button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-500 transition-all duration-300 flex items-center justify-center hover:scale-110 animate-bounce"
          aria-label="Open AI Voice Assistant"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}
    </>
  );
}
`;

content = content.replace(returnRegex, newRender);
fs.writeFileSync(file, content);
