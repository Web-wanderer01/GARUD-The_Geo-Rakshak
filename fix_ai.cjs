const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

const returnRegex = /  return \([\s\S]*?\);\n\}/;
const newRender = `  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050B14]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0A1128] rounded-3xl w-full max-w-4xl aspect-[16/9] flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-blue-900/50">
            
            {/* Header branding */}
            <div className="absolute top-8 text-center w-full z-10">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Voice Chat UI</h2>
              <p className="text-blue-200/60 text-sm mt-1 flex justify-center items-center gap-2">
                <Bot className="w-4 h-4" /> GARUD AI Assistant
              </p>
            </div>

            {/* Glowing Orb */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-12 mt-8">
              <div className={\`absolute inset-0 bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-600 rounded-full blur-3xl \${isListening ? 'opacity-80 animate-pulse scale-125' : 'opacity-40 animate-[pulse_4s_ease-in-out_infinite]'}\`}></div>
              <div className="absolute inset-6 bg-gradient-to-tr from-blue-500 via-cyan-300 to-indigo-600 rounded-full shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
            </div>

            {/* Subtitle / Status */}
            <div className="text-center px-12 z-10 w-full">
              <p className="text-blue-300/80 text-lg font-medium h-8 mb-4">
                {isListening ? "I'm listening... What's on your mind?" : (isTyping ? "Thinking..." : "Tap the microphone to speak")}
              </p>
              
              <div className="h-32 flex items-center justify-center">
                <p className="text-white/90 text-2xl max-w-2xl mx-auto leading-relaxed font-light whitespace-pre-line">
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

            {/* Controls */}
            <div className="absolute bottom-10 flex gap-6 z-10 items-center">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <button 
                onClick={toggleListening} 
                className={\`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-2xl \${isListening ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50 scale-110' : 'bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md'}\`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
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
