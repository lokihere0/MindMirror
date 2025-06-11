'use client';
import { useEffect, useState } from 'react';

export default function VoiceInput() {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.onresult = (event: any) => {
      setTranscript(event.results[0][0].transcript);
    };
    recognition.start();
  }, []);

  return <p>🎙️ You said: {transcript}</p>;
}
