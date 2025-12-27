
import React, { useState, useEffect } from 'react';
import { Question, Language } from '../types';
import { CheckCircle, XCircle, ChevronRight, RefreshCcw, Info, AudioWaveform, Play, Volume2, ChevronDown, ChevronUp, Trophy, Unlock, Loader2, Languages, Search } from 'lucide-react';
import { PronunciationButton } from './PronunciationButton';
import { generateSpeech } from '../services/geminiService';

interface MockTestProps {
  questions: Question[];
  nativeLang: Language;
  onRestart: () => void;
  onComplete?: (score: number, total: number) => void;
  testLanguage?: 'English' | 'German';
}

const EXPLANATION_THRESHOLD = 220;

export const MockTest: React.FC<MockTestProps> = ({ 
  questions, 
  nativeLang, 
  onRestart,
  onComplete,
  testLanguage = 'English'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const playPromptAudio = async () => {
    if (!currentQuestion.audioPrompt || isAudioLoading) return;
    setIsAudioLoading(true);
    try {
      const voice = testLanguage === 'English' ? 'Zephyr' : 'Kore';
      await generateSpeech(currentQuestion.audioPrompt, voice);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleLookupPrompt = () => {
    window.dispatchEvent(new CustomEvent('lingu-lookup', { detail: { term: currentQuestion.text } }));
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsExplanationExpanded(false);
    } else {
      setShowResults(true);
      if (onComplete) {
        onComplete(score, questions.length);
      }
    }
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center max-w-2xl mx-auto border border-slate-200 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600">
          <Trophy size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-4">Exam Completed!</h2>
        <div className="text-7xl font-black text-indigo-600 mb-4 tracking-tighter">
          {score} <span className="text-3xl text-slate-300">/ {questions.length}</span>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-10 flex items-center justify-center gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
            <Unlock size={24} />
          </div>
          <div className="text-left">
            <div className="text-emerald-800 font-black text-lg">Next Unit Unlocked!</div>
            <p className="text-emerald-600 text-sm font-medium">You've successfully completed this milestone.</p>
          </div>
        </div>

        <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
          {score === questions.length 
            ? "Flawless performance! Your mastery of the official format is impressive." 
            : "Strong effort! Consistency is key to mastering these standardized tests."}
        </p>

        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
        >
          <RefreshCcw size={24} />
          Return to Curriculum
        </button>
      </div>
    );
  }

  const needsToggle = currentQuestion.explanation.length > EXPLANATION_THRESHOLD;
  const displayedExplanation = (needsToggle && !isExplanationExpanded) 
    ? currentQuestion.explanation.slice(0, EXPLANATION_THRESHOLD) + '...'
    : currentQuestion.explanation;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Test Phase {currentIndex + 1} / {questions.length}
        </span>
        <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-slate-200">
        {currentQuestion.audioPrompt && (
          <div className="mb-10 p-8 bg-amber-50 rounded-[2rem] border-2 border-amber-100 flex flex-col items-center text-center group">
            <div className="bg-white p-5 rounded-full shadow-lg text-amber-600 mb-6 group-hover:scale-110 transition-transform">
              <Volume2 size={40} />
            </div>
            <h4 className="font-black text-amber-900 text-xl mb-2">Aural Evaluation</h4>
            <p className="text-sm text-amber-700 mb-8 font-medium">Please process the audio evidence before making your selection.</p>
            <button
              onClick={playPromptAudio}
              disabled={isAudioLoading}
              className="px-10 py-4 bg-amber-600 text-white rounded-2xl font-black text-lg hover:bg-amber-700 flex items-center gap-3 shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {isAudioLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <><Play size={24} fill="currentColor" /> Play Recording</>
              )}
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">Target Question</div>
            <button 
              onClick={handleLookupPrompt}
              className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              <Search size={12} /> Lookup Sentence
            </button>
          </div>
          <h3 className="text-3xl font-black text-slate-800 leading-tight">
            {currentQuestion.text}
          </h3>
        </div>

        {currentQuestion.difficultTerms && currentQuestion.difficultTerms.length > 0 && (
          <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 mb-4 text-[10px] font-black uppercase tracking-widest">
              <AudioWaveform size={14} />
              Term Lexicon
            </div>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.difficultTerms.map((term, i) => (
                <PronunciationButton key={i} text={term} language={testLanguage} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-10">
          {currentQuestion.options?.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect = isAnswered && opt === currentQuestion.correctAnswer;
            const isWrong = isAnswered && isSelected && opt !== currentQuestion.correctAnswer;

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`w-full p-6 rounded-2xl text-left border-2 transition-all flex items-center justify-between font-bold text-xl ${
                  isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                  isWrong ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
                  isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-800 ring-4 ring-indigo-50' :
                  'border-slate-100 bg-white hover:border-indigo-200 text-slate-700 hover:shadow-md'
                }`}
              >
                {opt}
                {isCorrect && <CheckCircle className="text-emerald-500" size={28} />}
                {isWrong && <XCircle className="text-rose-500" size={28} />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mb-10 p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-indigo-700 mb-4 font-black uppercase text-xs tracking-widest">
              <Info size={20} />
              Analytical Feedback
            </div>
            
            <div className="space-y-6">
              <div className="text-slate-700 leading-relaxed text-lg font-medium">
                <p>{displayedExplanation}</p>
                {needsToggle && (
                  <button 
                    onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
                    className="mt-3 text-indigo-600 font-black text-sm hover:text-indigo-800 flex items-center gap-1 transition-all"
                  >
                    {isExplanationExpanded ? (
                      <>Collapse Insight <ChevronUp size={16} /></>
                    ) : (
                      <>Expand Insight <ChevronDown size={16} /></>
                    )}
                  </button>
                )}
              </div>
              
              {currentQuestion.nativeExplanation && (
                <div className="pt-6 border-t border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
                    <Languages size={14} />
                    {nativeLang} Bridge
                  </div>
                  <p className="text-indigo-900 font-black text-xl italic leading-tight">
                    {currentQuestion.nativeExplanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl disabled:opacity-30 transform hover:-translate-y-1 active:translate-y-0"
          >
            Verify Response
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-1 active:translate-y-0"
          >
            {currentIndex === questions.length - 1 ? 'Finalize Exam' : 'Advance to Next Task'}
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};
