import { useState, useEffect } from 'react';

// 定义语音识别事件类型
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

const VoiceInput = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join('');
      onResult(transcript);
    };

    recognition.onerror = (event: Event) => {
      console.error('Speech recognition error:', event);
    };

    return () => recognition.abort();
  }, [onResult]);

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