const fs = require('fs');
const file = 'src/components/ai/AIAssistant.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update SpeechRecognition setup
const speechCode = `
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true; // MUST BE TRUE FOR LIVE TRANSCRIPTION
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Show live typing
        setInput(finalTranscript || interimTranscript);
        
        // Only submit when user finishes the sentence
        if (finalTranscript) {
          setTimeout(() => {
            document.getElementById('ai-send-btn')?.click();
          }, 500);
        }
      };`;

content = content.replace(/\/\/ Setup Speech Recognition[\s\S]*?\}, 500\);\n      \};/, speechCode);

fs.writeFileSync(file, content);
