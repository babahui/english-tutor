// src/components/VoiceInput.tsx
import { useState, useEffect } from 'react';

const VoiceInput = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onResult(transcript);
    };

    return () => recognition.abort();
  }, []);

  return (
    <button
      onMouseDown={() => setIsListening(true)}
      onMouseUp={() => setIsListening(false)}
    >
      {isListening ? '🎤 Listening...' : '🎤 Hold to Speak'}
    </button>
  );
};

export default VoiceInput;
