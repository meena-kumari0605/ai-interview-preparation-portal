import React from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function SpeechToTextButton({ onTranscript, className = '' }) {
  const { isListening, isSupported, error, toggleListening } = useSpeechToText(onTranscript);

  if (!isSupported) {
    return (
      <div className="flex items-center space-x-1.5 text-xs text-slate-500">
        <button
          disabled
          type="button"
          title="Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
          className={`p-2 rounded-xl border border-slate-800 text-slate-600 cursor-not-allowed flex items-center space-x-1.5 ${className}`}
        >
          <MicOff className="w-4 h-4" />
          <span>Voice</span>
        </button>
        <span className="text-[11px] text-slate-500 font-mono">
          Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <span className="text-[11px] text-red-400 font-medium flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </span>
      )}
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
          isListening
            ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-lg shadow-red-500/20'
            : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300'
        } ${className}`}
        title={isListening ? 'Stop Recording' : 'Start Speech-to-Text Recording'}
      >
        {isListening ? (
          <>
            <Mic className="w-4 h-4 text-red-400 animate-bounce" />
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-indigo-400" />
            <span>Voice</span>
          </>
        )}
      </button>
    </div>
  );
}
