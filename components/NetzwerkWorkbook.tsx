import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  RefreshCw, 
  Compass, 
  BookMarked, 
  GraduationCap, 
  HelpCircle, 
  ArrowRight,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { NETZWERK_A1_CHAPTETS, NetzwerkChapter, NetzwerkNoun, NetzwerkPhrase, NetzwerkExercise } from '../data/netzwerkData';
import { generateSpeech, lookupDictionary } from '../services/geminiService';

export const NetzwerkWorkbook: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary' | 'exercises'>('overview');
  
  // Quiz states
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, { answered: Record<number, string>; checked: Record<number, boolean>; score: number }>>({});
  const [expandedGrammar, setExpandedGrammar] = useState<number | null>(0);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  
  // Custom dictionary lookup sidepanel
  const [lookupWord, setLookupWord] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // active chapter selection
  const chapter = NETZWERK_A1_CHAPTETS.find(c => c.id === activeChapterId) || NETZWERK_A1_CHAPTETS[0];

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('netzwerk-workbook-progress');
    if (savedProgress) {
      try {
        setExerciseProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error loading workbook progress:', e);
      }
    }
  }, []);

  const saveProgress = (newProgress: any) => {
    setExerciseProgress(newProgress);
    localStorage.setItem('netzwerk-workbook-progress', JSON.stringify(newProgress));
  };

  // TTS handler
  const playPronunciation = async (german: string, article?: string) => {
    const phrase = article ? `${article} ${german}` : german;
    setSpeakingWord(phrase);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'de-DE';
        utterance.rate = 0.85; // slightly slower for better beginner adaptation

        const voices = window.speechSynthesis.getVoices();
        const deVoice = voices.find(v => v.lang.startsWith('de'));
        if (deVoice) utterance.voice = deVoice;

        utterance.onend = () => setSpeakingWord(null);
        utterance.onerror = () => setSpeakingWord(null);
        window.speechSynthesis.speak(utterance);
      } else {
        await generateSpeech(phrase, 'Zephyr');
        setSpeakingWord(null);
      }
    } catch (err) {
      console.error('Failed to vocalize:', err);
      setSpeakingWord(null);
    }
  };

  // Answer change handler
  const handleAnswerChange = (exerciseId: string, qIndex: number, value: string) => {
    const currentEx = exerciseProgress[exerciseId] || { answered: {}, checked: {}, score: 0 };
    const updatedAnswered = { ...currentEx.answered, [qIndex]: value };
    const updatedEx = { ...currentEx, answered: updatedAnswered };
    
    const nextProgress = { ...exerciseProgress, [exerciseId]: updatedEx };
    saveProgress(nextProgress);
  };

  // Grade an exercise
  const checkAnswers = (exercise: NetzwerkExercise) => {
    const currentEx = exerciseProgress[exercise.id] || { answered: {}, checked: {}, score: 0 };
    const checked: Record<number, boolean> = {};
    let matchedScore = 0;

    exercise.questions.forEach((q, idx) => {
      const studentAns = (currentEx.answered[idx] || '').trim().toLowerCase();
      const realAns = q.answer.trim().toLowerCase();
      const isCorrect = studentAns === realAns;
      checked[idx] = isCorrect;
      if (isCorrect) matchedScore++;
    });

    const updatedEx = {
      ...currentEx,
      checked,
      score: matchedScore
    };

    const nextProgress = { ...exerciseProgress, [exercise.id]: updatedEx };
    saveProgress(nextProgress);
  };

  const resetExercise = (exerciseId: string) => {
    const nextProgress = { ...exerciseProgress };
    delete nextProgress[exerciseId];
    saveProgress(nextProgress);
  };

  // Dictionary live lookup
  const handleDictionaryLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupWord.trim()) return;
    setLoadingLookup(true);
    setLookupError('');
    setLookupResult(null);

    try {
      const result = await lookupDictionary(lookupWord.trim(), 'German', 'English' as any);
      setLookupResult(result);
    } catch (err: any) {
      console.error(err);
      setLookupError(err.message || 'Error occurred while looking up phrase.');
    } finally {
      setLoadingLookup(false);
    }
  };

  // Print chapter worksheet helper
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-6 md:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-widest mb-3">
            <BookMarked size={16} />
            <span>Interactive Übungsbuch Companion</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 flex-wrap">
            Netzwerk Neu A1 <span className="text-indigo-400">Workbook</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium max-w-2xl text-sm md:text-base leading-relaxed">
            Practice and master the vocabulary, grammar, and interactive exercises of the original Netzwerk Neu A1 framework with smart audio pronunciations, instant workbook checking, and an AI dictionary assistant.
          </p>
        </div>

        <button 
          onClick={triggerPrint}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg transition-all"
        >
          <Printer size={16} />
          Print Chapter Study Guide
        </button>
      </div>

      {/* CHAPTER DRAWER & SELECTION SELECTOR */}
      <div className="print:hidden">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Select Course Chapter (Kapitel 1 - 12)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {NETZWERK_A1_CHAPTETS.map((ch) => {
            const isSelected = ch.id === activeChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterId(ch.id);
                  setActiveTab('overview');
                }}
                className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                  isSelected 
                    ? 'bg-indigo-50 border-indigo-600 text-slate-900 shadow-md ring-2 ring-indigo-500/10' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  Kapitel {ch.id}
                </span>
                <span className="text-xs font-extrabold tracking-tight mt-1 line-clamp-1">
                  {ch.title.split(': ')[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: Main Content & Sidebar Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAIN MODULE CONTENT */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          
          {/* TAB BAR */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 pt-4 flex gap-4 print:hidden">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-extrabold transition-all border-b-2 relative ${
                activeTab === 'overview' 
                  ? 'border-indigo-600 text-slate-900 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass size={16} /> Grammatik & Thema
              </span>
            </button>
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`pb-4 px-2 text-sm font-extrabold transition-all border-b-2 relative ${
                activeTab === 'vocabulary' 
                  ? 'border-indigo-600 text-slate-900 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen size={16} /> Wortschatz (Vocab)
              </span>
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`pb-4 px-2 text-sm font-extrabold transition-all border-b-2 relative ${
                activeTab === 'exercises' 
                  ? 'border-indigo-600 text-slate-900 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={16} /> Übungen (Exercises)
              </span>
            </button>
          </div>

          <div className="p-6 md:p-8 flex-1">
            
            {/* TAB 1: OVERVIEW & GRAMMAR */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    {chapter.title}
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">
                    {chapter.topic}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm uppercase tracking-wider">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span>Focus Grammar: {chapter.grammarTitle}</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {chapter.grammarDescription}
                  </p>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {chapter.grammarPoints.map((gp, i) => (
                      <div 
                        key={i} 
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:bg-slate-100/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedGrammar(expandedGrammar === i ? null : i)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black">
                              {i + 1}
                            </span>
                            {gp.rule}
                          </h4>
                          <span className="text-xs text-indigo-600 font-bold underline">
                            {expandedGrammar === i ? 'Collapse' : 'Show details'}
                          </span>
                        </div>

                        {expandedGrammar === i && (
                          <div className="mt-4 pl-7 space-y-3 border-l-2 border-indigo-200 animate-in slide-in-from-top-1 duration-200">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Examples</span>
                              <span className="text-base font-black text-indigo-900 tracking-tight leading-relaxed block mt-0.5">
                                {gp.example}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pedagogical Explanation</span>
                              <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                                {gp.explanation}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-3 mt-6">
                  <CheckCircle2 size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ready to test your knowledge?</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Move over to the **Vocabulary** component to study Chapter speech pronunciations, or click below to start the official exercises.
                    </p>
                    <button 
                      onClick={() => setActiveTab('exercises')}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-extrabold underline"
                    >
                      Go to Exercises <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VOCABULARY SHEET */}
            {activeTab === 'vocabulary' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* NOUN CATEGORIES / GENDER MARKERS */}
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-600" />
                    <span>Nouns with Genders (Color-Coded)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chapter.nouns.map((word, index) => {
                      // pick bg style according to gender
                      let bgStyle = 'bg-blue-50/50 hover:bg-blue-50 border-blue-100 text-blue-900';
                      let articleLabel = 'der';
                      let labelColor = 'text-blue-500';

                      if (word.article === 'das') {
                        bgStyle = 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100 text-emerald-900';
                        articleLabel = 'das';
                        labelColor = 'text-emerald-600';
                      } else if (word.article === 'die') {
                        bgStyle = 'bg-red-50/40 hover:bg-red-50 border-red-100 text-red-900';
                        articleLabel = 'die';
                        labelColor = 'text-red-500';
                      }

                      return (
                        <div 
                          key={index}
                          onClick={() => playPronunciation(word.german, word.article)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${bgStyle}`}
                        >
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className={`text-[10px] font-black uppercase tracking-wider ${labelColor}`}>{articleLabel}</span>
                              <span className="text-base font-black tracking-tight">{word.german}</span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium block mt-1">Plural: {word.plural || 'None / Unknown'}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase tracking-tight text-right">
                              {word.english}
                            </span>
                            <div className="p-1.5 bg-white border rounded-lg shadow-sm">
                              <Volume2 size={12} className={speakingWord === `${word.article} ${word.german}` ? 'animate-bounce text-indigo-600' : 'text-slate-400'} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* VERBS AND PHRASES */}
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4">
                    Verbs & Conversational Phrases
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapter.verbsPhrases.map((el, i) => (
                      <div 
                        key={i}
                        onClick={() => playPronunciation(el.german)}
                        className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{el.german}</span>
                          <span className="text-xs text-slate-500 mt-1 block">{el.english}</span>
                        </div>
                        <div className="p-1.5 bg-white border rounded-lg shadow-sm shrink-0">
                          <Volume2 size={12} className={speakingWord === el.german ? 'animate-bounce text-indigo-600' : 'text-slate-400'} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: EXERCISES */}
            {activeTab === 'exercises' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {chapter.exercises.map((ex) => {
                  const currentExState = exerciseProgress[ex.id] || { answered: {}, checked: {}, score: 0 };
                  const isChecked = Object.keys(currentExState.checked).length > 0;
                  const scorePercentage = Math.round((currentExState.score / ex.questions.length) * 100);

                  return (
                    <div key={ex.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">{ex.title}</h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{ex.instructions}</p>
                        </div>

                        {isChecked && (
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            scorePercentage >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            Score: {currentExState.score} / {ex.questions.length} ({scorePercentage}%)
                          </span>
                        )}
                      </div>

                      {/* QUESTIONS MAP */}
                      <div className="space-y-5 mt-4">
                        {ex.questions.map((q, qIdx) => {
                          const studentAnswer = currentExState.answered[qIdx] || '';
                          const isCorrect = currentExState.checked[qIdx];
                          const hasChecked = currentExState.checked[qIdx] !== undefined;

                          return (
                            <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-xs font-black text-slate-800">
                                  Frage {qIdx + 1}:
                                </span>
                                {hasChecked && (
                                  isCorrect 
                                    ? <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black"><Check size={8} /> Correct</span>
                                    : <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-black">Incorrect</span>
                                )}
                              </div>

                              <p className="text-sm font-extrabold text-slate-900 mt-2">
                                {q.prompt}
                              </p>

                              {/* MULTIPLE CHOICE TYPE */}
                              {ex.type === 'multiple-choice' && q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                  {q.options.map((option, optIdx) => {
                                    const isSelected = studentAnswer === option;
                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={hasChecked}
                                        onClick={() => handleAnswerChange(ex.id, qIdx, option)}
                                        className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                                          isSelected 
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {option}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* FILL IN THE BLANKS TYPE */}
                              {ex.type === 'fill-blanks' && (
                                <div className="mt-3">
                                  <input
                                    type="text"
                                    placeholder={q.hint || "Type German translation..."}
                                    value={studentAnswer}
                                    disabled={hasChecked}
                                    onChange={(e) => handleAnswerChange(ex.id, qIdx, e.target.value)}
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                                  />
                                  {q.hint && (
                                    <span className="text-[10px] text-slate-400 font-semibold mt-1.5 block">
                                      Hint: {q.hint}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* ALIGNMENT & ORDER TYPE */}
                              {ex.type === 'order' && (
                                <div className="mt-3">
                                  <input
                                    type="text"
                                    placeholder="Type correct full sentence..."
                                    value={studentAnswer}
                                    disabled={hasChecked}
                                    onChange={(e) => handleAnswerChange(ex.id, qIdx, e.target.value)}
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                  />
                                </div>
                              )}

                              {/* SHOW EXPLANATION OR SOLUTION KEY ON WRONG */}
                              {hasChecked && !isCorrect && (
                                <div className="mt-3 p-3 bg-amber-50 rounded-xl text-xs border border-amber-100 flex items-start gap-2 text-amber-900">
                                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold">Solution:</span> {q.answer}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* GRADE CONTROLS */}
                      <div className="flex gap-2 justify-end mt-5">
                        {isChecked ? (
                          <button
                            type="button"
                            onClick={() => resetExercise(ex.id)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            <RefreshCw size={12} /> Reset Quiz
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => checkAnswers(ex)}
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all animate-pulse"
                          >
                            <CheckCircle2 size={12} /> Check Answers
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          </div>

          {/* PRINT CARD INFO - VISIBLE ONLY DURING PRINTING */}
          <div className="hidden print:block p-8 border-t-2 border-slate-200">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-3">
              Kapitel {chapter.id} Print Companion Study sheet
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Study summary printed from LinguBridge Network Neu Companion. Contains key vocabulary and grammar rules.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-1 mb-2">Focus Grammar Rules</h4>
                {chapter.grammarPoints.map((gp, i) => (
                  <div key={i} className="mb-4">
                    <span className="font-bold block text-xs">{gp.rule}</span>
                    <span className="text-sm italic font-mono block text-indigo-900 my-1">{gp.example}</span>
                    <span className="text-xs text-slate-600 block">{gp.explanation}</span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-1 mb-2">Core Vocabulary</h4>
                <div className="grid grid-cols-2 gap-4">
                  {chapter.nouns.map((word, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-bold font-mono">{word.article} {word.german}</span> - {word.english}
                    </div>
                  ))}
                  {chapter.verbsPhrases.map((v, i) => (
                    <div key={i} className="text-xs italic">
                      <span className="font-bold">{v.german}</span> - {v.english}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SIDEBAR: DICTIONARY LOOKUP & GRAMMAR ASSISTANT */}
        <div className="lg:col-span-4 space-y-6 print:hidden">

          {/* REAL DICTIONARY SHELF */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-indigo-600 animate-spin-slow" />
              <span>AI Lexicographer</span>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              German Dictionary lookup
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Stuck on a sentence or vocabulary item in the Übungsbuch? Type it below for grammatical parses and cultural explanations from the AI Tutor.
            </p>

            <form onSubmit={handleDictionaryLookup} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="e.g., Bahnhof, Guten Appetit..."
                value={lookupWord}
                onChange={(e) => setLookupWord(e.target.value)}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                type="submit"
                disabled={loadingLookup}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-heavy text-xs rounded-xl transition-all font-black flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingLookup ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    Lookup Dictionary
                  </>
                )}
              </button>
            </form>

            {/* Error state */}
            {lookupError && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl text-xs border border-red-100 text-red-850">
                {lookupError}
              </div>
            )}

            {/* Lookup result placeholder */}
            {lookupResult && (
              <div className="mt-4 p-4 bg-white border border-slate-200 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-indigo-600">{lookupResult.word}</span>
                    {lookupResult.phonetic && <span className="text-[10px] text-slate-400 font-mono">[{lookupResult.phonetic}]</span>}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block border-b pb-1 mt-0.5">{lookupResult.partOfSpeech}</span>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">German Definition</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mt-0.5">
                    {lookupResult.definition}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">English Translation</span>
                  <p className="text-xs text-indigo-950 font-extrabold mt-0.5">
                    {lookupResult.nativeTranslation}
                  </p>
                </div>

                {lookupResult.nativeExplanation && (
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Culture & Nuances</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                      {lookupResult.nativeExplanation}
                    </p>
                  </div>
                )}

                {lookupResult.example && (
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">German Example</span>
                    <span className="text-xs font-bold text-slate-800 leading-relaxed">
                      {lookupResult.example}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NETZWERK COURSE INFO CARD */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <GraduationCap size={150} />
            </div>

            <h4 className="text-base font-bold">Flipbook Syllabus Sync</h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
              This digital Übungsbuch companion aligns perfectly with the A1 German Course Flipbook. Track your scores across all 12 Chapters to prepare for certified examinations under the CEFR Levels framework.
            </p>

            <a 
              href="https://online.fliphtml5.com/mkzfx/phnn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white font-heavy text-[11px] px-3.5 py-2 rounded-xl transition-all"
            >
              Open Original Flipbook <ArrowRight size={12} />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
