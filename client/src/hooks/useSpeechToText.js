import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechToText(onTranscript) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);

  // Keep onTranscriptRef updated without re-creating SpeechRecognition
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const isSupported = !!SpeechRecognition;

  // Initialize single SpeechRecognition instance once
  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      if (!event || !event.results) return;

      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }

      if (onTranscriptRef.current) {
        onTranscriptRef.current(fullTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error !== 'no-speech') {
        setError('Unable to recognize speech. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [isSupported, SpeechRecognition]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      if (!isSupported) {
        setError('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      }
      return;
    }

    setError('');

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening
  };
}
