const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite speakText for maximum compatibility
const speakTextCode = `  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown, asterisks, and basic emojis
      const cleanText = text.replace(/[*#_]/g, '').replace(/[^\x00-\x7F]/g, '');
      const msg = new SpeechSynthesisUtterance(cleanText);
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find Google UK or US female, or just English
        const voice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || 
                      voices.find(v => v.lang.includes('en')) || 
                      voices[0];
        if (voice) msg.voice = voice;
      }
      
      msg.rate = 1.0;
      msg.pitch = 1.0;
      msg.volume = 1.0;
      
      // Auto-restart listening after AI finishes speaking to make it fully interactive!
      msg.onend = () => {
        // Check if the modal is still open
        if (document.getElementById('garud-voice-modal')) {
          playSiriBeep();
          setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch(e) {}
            }
          }, 300);
        }
      };
      
      msg.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
      };
      
      window.speechSynthesis.speak(msg);
    }
  };`;

content = content.replace(/  const speakText = \(\text\) => \{[\s\S]*?window\.speechSynthesis\.speak\(msg\);\n    \}\n  \};/, speakTextCode);

// 2. Add unlock to handleOpenVoiceAI
const handleOpenVoiceAICode = `  const handleOpenVoiceAI = () => {
    setIsOpen(true);
    // Unlock SpeechSynthesis on user gesture
    if ('speechSynthesis' in window) {
      const unlockMsg = new SpeechSynthesisUtterance('');
      unlockMsg.volume = 0;
      window.speechSynthesis.speak(unlockMsg);
    }
    
    // Play siri activation sound
    playSiriBeep();
    // Synchronously request permission and start listening (fixes iOS Safari issue)
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {}
    }
  };`;

content = content.replace(/  const handleOpenVoiceAI = \(\) => \{[\s\S]*?catch\(e\) \{\}\n    \}\n  \};/, handleOpenVoiceAICode);

fs.writeFileSync(file, content);
