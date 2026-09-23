const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update speakText to restart listening
const speakTextCode = `  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#]/g, '').replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
      const msg = new SpeechSynthesisUtterance(cleanText);
      msg.lang = 'en-IN';
      msg.rate = 1.0;
      
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
      
      window.speechSynthesis.speak(msg);
    }
  };`;

content = content.replace(/  const speakText = \(\text\) => \{[\s\S]*?window\.speechSynthesis\.speak\(msg\);\n    \}\n  \};/, speakTextCode);

// Add the ID to the modal so the onend event knows if it's still open
content = content.replace(/<div className="fixed inset-0 z-\[100\]/, '<div id="garud-voice-modal" className="fixed inset-0 z-[100]');

fs.writeFileSync(file, content);
