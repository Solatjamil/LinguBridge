
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Book, Loader2, Languages, Volume2, Sparkles, ChevronRight, Quote, Info, History as HistoryIcon, Trash2 } from 'lucide-react';
import { lookupDictionary } from '../services/geminiService';
import { Language } from '../types';
import { PronunciationButton } from './PronunciationButton';

interface DictionaryOverlayProps {
  nativeLang: Language;
  testLanguage: 'English' | 'German';
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  definition: string;
  nativeTranslation: string;
  nativeExplanation?: string;
  example: string;
  synonyms?: string[];
}

const HISTORY_KEY = 'lingu-bridge-dict-history-v2';

export const DictionaryOverlay: React.FC<DictionaryOverlayProps> = ({ nativeLang, testLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));

    const handleGlobalLookup = (e: any) => {
      const term = e.detail?.term;
      if (term) {
        setIsOpen(true);
        handleSearch(term);
      }
    };

    // Text selection logic
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText && selectedText.length > 1 && selectedText.length < 100) {
        const range = window.getSelection()?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setSelection({
            text: selectedText,
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY - 40
          });
        }
      } else {
        setSelection(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't clear selection if clicking the tooltip itself
      if (!(e.target as HTMLElement).closest('.selection-tooltip')) {
        setSelection(null);
      }
    };

    window.addEventListener('lingu-lookup', handleGlobalLookup);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('lingu-lookup', handleGlobalLookup);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [history]);

  useEffect(() => {
    if (isOpen && !loading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, loading]);

  const saveToHistory = (word: string) => {
    const newHistory = [word, ...history.filter(w => w !== word)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleSearch = async (term?: string) => {
    const searchTerm = term || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setResult(null);
    setQuery(searchTerm);
    setSelection(null);
    
    try {
      const data = await lookupDictionary(searchTerm, testLanguage, nativeLang);
      setResult(data);
      saveToHistory(data.word);
    } catch (err) {
      console.error("Dictionary Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selection) {
      setIsOpen(true);
      handleSearch(selection.text);
    }
  };

  return (
    <>
      {/* Selection Tooltip */}
      {selection && !isOpen && (
        <div 
          className="selection-tooltip fixed z-[100] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ left: selection.x, top: selection.y }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent selection clear
            onClick={handleTooltipClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-black shadow-2xl hover:bg-indigo-600 transition-all border-2 border-white/20"
          >
            <Search size={14} /> Define "{selection.text.length > 15 ? selection.text.substring(0, 12) + '...' : selection.text}"
          </button>
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 mx-auto" />
        </div>
      )}

      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20 backdrop-blur-md"
        aria-label="Open Dictionary"
      >
        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
          <Search size={10} className="sm:size-12" />
        </div>
        <Book size={24} className="sm:size-28" />
      </button>

      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          onClick={() => setIsOpen(false)} 
        />
        
        <div className={`absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2.5 sm:p-3 rounded-2xl text-white shadow-xl rotate-3">
                <Languages size={18} className="sm:size-22" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-[10px] sm:text-xs tracking-[0.2em]">AI Phrase Lab</h3>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{testLanguage} &rarr; {nativeLang}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={24} className="sm:size-28" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-5 sm:p-8 bg-white sticky top-0 z-10">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type word, phrase, or paste text..."
                className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl sm:rounded-[1.5rem] outline-none transition-all font-bold text-slate-800 shadow-inner text-base sm:text-lg"
              />
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              {query && (
                <button 
                  type="submit"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </form>
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto px-5 sm:px-8 pb-12 scrollbar-hide">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Consulting AI Lexicon...</p>
              </div>
            ) : result ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-[2rem] p-8 border border-indigo-100 relative overflow-hidden shadow-sm">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-4 py-1.5 bg-white text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                        {result.partOfSpeech}
                      </span>
                      <PronunciationButton text={result.word} language={testLanguage} variant="small" />
                    </div>
                    <h4 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 tracking-tight">{result.word}</h4>
                    {result.phonetic && <p className="text-indigo-500 font-mono text-sm font-bold tracking-widest">{result.phonetic}</p>}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Info size={14} /> Semantic Definition
                    </h5>
                    <p className="text-lg font-bold text-slate-800 leading-relaxed">
                      {result.definition}
                    </p>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                     <div className="relative z-10">
                       <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Languages size={16} /> {nativeLang} Bridge
                      </h5>
                      <p className="text-2xl font-black italic leading-tight mb-4">
                        {result.nativeTranslation}
                      </p>
                      {result.nativeExplanation && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                            {result.nativeExplanation}
                          </p>
                        </div>
                      )}
                     </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                    <h5 className="text-[10px] font-black text-amber-700/60 uppercase tracking-widest mb-3">Usage Example</h5>
                    <div className="italic text-slate-800 font-bold text-lg leading-relaxed">
                      "{result.example}"
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* History Section */}
                {history.length > 0 && (
                  <div className="animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <HistoryIcon size={14} /> Recent Inquiries
                      </h5>
                      <button onClick={clearHistory} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {history.map((word, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearch(word)}
                          className="px-4 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-left transition-all group"
                        >
                          <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 truncate block">
                            {word}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Sparkles size={32} className="text-slate-200" />
                  </div>
                  <h4 className="text-slate-800 font-black uppercase text-sm tracking-[0.2em] mb-2">Lexicon Ready</h4>
                  <p className="text-slate-400 text-xs font-medium px-8 leading-relaxed">
                    Highlight any word in your mock test or type above to bridge your learning with {nativeLang}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
