const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the bad useEffect
content = content.replace(/\/\/ Auto-start listening when opened[\s\S]*?\}, \[isOpen\]\);/, '');

// 2. Add playSiriBeep and handleOpenVoiceAI
const injectLogic = `
  const playSiriBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(800, ctx.currentTime);
      osc2.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.2);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.3);
    } catch(e) {}
  };

  const handleOpenVoiceAI = () => {
    setIsOpen(true);
    // Play siri activation sound
    playSiriBeep();
    // Synchronously request permission and start listening (fixes iOS Safari issue)
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {}
    }
  };
`;
content = content.replace(/const toggleListening = \(\) => \{/, injectLogic + '\n  const toggleListening = () => {');

// 3. Replace onClick={() => setIsOpen(true)} with onClick={handleOpenVoiceAI}
content = content.replace(/onClick=\{.*?setIsOpen\(true\).*?\}/, 'onClick={handleOpenVoiceAI}');

fs.writeFileSync(file, content);
