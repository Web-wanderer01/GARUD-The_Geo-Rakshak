const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change the initial message to be short
content = content.replace(
  /content: \`Hello! I am the GARUD AI Assistant[\s\S]*?How can I help you stay safe today\?\`/,
  "content: 'Hello! I am GARUD Voice AI. How can I assist you today?'"
);

// 2. Add auto-listen when opened
// Find the useEffect for isOpen and replace it
content = content.replace(
  /\/\/ Focus input when chat opens[\s\S]*?\}, \[isOpen\]\);/,
  `// Auto-start listening when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch(e) {}
        }
      }, 500);
    } else {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);`
);

// 3. Replace the entire return statement with a full-screen, ultra-clean UI without scrollbars.
const returnRegex = /  return \([\s\S]*?\n\}/;
const newRender = `  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712] animate-in fade-in duration-500">
          
          {/* 3D Interactive Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <div className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
            <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
          </div>

          <div className="relative w-full h-full flex flex-col items-center justify-center z-10 p-6 sm:p-12">
            
            {/* Header / Top Nav */}
            <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-8">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-medium tracking-widest uppercase text-blue-100/80">GARUD Voice</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Glowing Orb (Massive and Centered) */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-16">
              {/* Dynamic Aura */}
              <div className={\`absolute inset-0 bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 rounded-full blur-3xl transition-all duration-700 \${isListening ? 'opacity-100 scale-125 animate-pulse' : (isTyping ? 'opacity-80 scale-110 animate-[spin_3s_linear_infinite]' : 'opacity-30 scale-95 animate-[pulse_4s_ease-in-out_infinite]')}\`}></div>
              
              {/* Core Orb */}
              <div className="absolute inset-8 sm:inset-10 bg-gradient-to-tr from-blue-600 via-cyan-300 to-indigo-700 rounded-full shadow-[inset_0_-30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center overflow-hidden border-2 border-white/20">
                <div className="w-full h-full bg-gradient-to-b from-white/40 to-transparent"></div>
              </div>
            </div>

            {/* Single Line Clean Caption */}
            <div className="text-center w-full max-w-4xl px-4 flex flex-col items-center">
              <p className="text-blue-400 text-sm sm:text-base font-medium tracking-widest uppercase mb-6 opacity-80 h-6">
                {isListening ? "Listening..." : (isTyping ? "GARUD is thinking..." : "Tap orb or mic to speak")}
              </p>
              
              <div className="min-h-[120px] flex items-center justify-center w-full">
                <p className="text-white text-3xl sm:text-4xl md:text-5xl leading-tight font-light tracking-wide text-center">
                  {input ? (
                    <span className="text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{input}</span>
                  ) : (
                    <span className="drop-shadow-lg">
                      {messages[messages.length - 1]?.role === 'assistant' 
                        ? messages[messages.length - 1].content.split('\\n')[0] // Only show the first sentence/line!
                        : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20 items-center">
              <button 
                onClick={toggleListening} 
                className={\`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white transition-all duration-500 shadow-2xl \${isListening ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 scale-110' : 'bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md'}\`}
              >
                {isListening ? <MicOff className="w-8 h-8 sm:w-10 sm:h-10" /> : <Mic className="w-8 h-8 sm:w-10 sm:h-10" />}
              </button>

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
