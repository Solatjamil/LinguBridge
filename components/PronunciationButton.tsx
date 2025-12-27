
import React, { useState } from 'react';
import { Volume2, Loader2, BookOpen, Search } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface PronunciationButtonProps {
  text: string;
  variant?: 'small' | 'normal';
  language?: 'English' | 'German';
}

export const PronunciationButton: React.FC<PronunciationButtonProps> = ({ 
  text, 
  variant = 'normal',
  language = 'English'
}) => {
  const [loading, setLoading] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    
    setLoading(true);
    try {
      const voice = language === 'English' ? 'Zephyr' : 'Kore';
      await generateSpeech(text, voice);
    } catch (err) {
      console.error("TTS Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Dispatch global lookup event for DictionaryOverlay to catch
    window.dispatchEvent(new CustomEvent('lingu-lookup', { detail: { term: text } }));
  };

  if (variant === 'small') {
    return (
      <div className="inline-flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-indigo-100 shadow-sm">
        <button 
          onClick={handleLookup}
          className="px-2 py-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
          title="Define"
        >
          {text}
        </button>
        <div className="w-px h-3 bg-indigo-200" />
        <button 
          onClick={handlePlay}
          disabled={loading}
          className="p-1 text-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
          title="Listen"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 group">
      <button
        onClick={handleLookup}
        className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-800 rounded-l-xl text-sm font-black hover:bg-indigo-50 transition-all border border-indigo-200 border-r-0 hover:shadow-inner group-hover:border-indigo-400"
      >
        <Search size={14} className="text-indigo-400" />
        {text}
      </button>
      <button 
        onClick={handlePlay}
        disabled={loading}
        className="px-3 py-2 bg-indigo-600 text-white rounded-r-xl border border-indigo-600 hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-70"
        title="Pronounce"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};
