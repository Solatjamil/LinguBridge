
import React, { useState, useEffect } from 'react';
import { Language, TestMetadata, Question, InfographicData, TestModule, DifficultyLevel, UserProgress, SessionResult, TestId } from './types';
import { TESTS } from './constants';
import { generateMockQuestions, generateInfographicContent } from './services/geminiService';
import { TestCard } from './components/TestCard';
import { MockTest } from './components/MockTest';
import { Infographic } from './components/Infographic';
import { ModuleSelector } from './components/ModuleSelector';
import { DifficultySelector } from './components/DifficultySelector';
import { SpeakingPractice } from './components/SpeakingPractice';
import { WritingPractice } from './components/WritingPractice';
import { ProgressDashboard } from './components/ProgressDashboard';
import { UnitGrid } from './components/UnitGrid';
import { DictionaryOverlay } from './components/DictionaryOverlay';
import { VocabularySheet } from './components/VocabularySheet';
import { GraduationCap, ChevronLeft, Loader2, Target, Trophy, BookOpen, LayoutDashboard, Sparkles, Languages, Mic, MicOff, BookMarked } from 'lucide-react';

const STORAGE_KEY = 'lingu-bridge-progress-v3';

const App: React.FC = () => {
  const [nativeLang, setNativeLang] = useState<Language>(Language.ENGLISH);
  const [selectedTest, setSelectedTest] = useState<TestMetadata | null>(null);
  const [selectedModule, setSelectedModule] = useState<TestModule | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.INTERMEDIATE);
  const [mode, setMode] = useState<'selection' | 'curriculum' | 'practice' | 'learn' | 'dashboard' | 'vocab_book'>('selection');
  const [activeTab, setActiveTab ] = useState<'learning' | 'exams'>('learning');
  const [loading, setLoading] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false); // Default to muted
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [infographic, setInfographic] = useState<InfographicData | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ 
    history: [], 
    unlockedUnits: {}, 
    unlockedMockTests: {} 
  });

  const [currentUnitIndex, setCurrentUnitIndex] = useState<number | null>(null);
  const [currentMockIndex, setCurrentMockIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const recordSession = (score?: number, total?: number) => {
    if (!selectedTest || !selectedModule) return;
    
    const isMock = activeTab === 'exams';
    const newSession: SessionResult = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      testId: selectedTest.id,
      testName: selectedTest.name,
      module: selectedModule,
      difficulty: selectedDifficulty,
      score: score,
      totalQuestions: total || 5,
      unitIndex: currentUnitIndex !== null ? currentUnitIndex : undefined,
      mockTestIndex: currentMockIndex !== null ? currentMockIndex : undefined,
      type: mode === 'learn' ? 'learn' : (isMock ? 'mock' : 'exercise')
    };

    const newHistory = [...progress.history, newSession];
    const newUnlockedUnits = { ...progress.unlockedUnits };
    const newUnlockedMockTests = { ...progress.unlockedMockTests };

    if (isMock && currentMockIndex !== null) {
      const key = selectedTest.id;
      const currentMax = progress.unlockedMockTests[key] || 0;
      if (currentMockIndex === currentMax) {
        newUnlockedMockTests[key] = currentMax + 1;
      }
    } else if (currentUnitIndex !== null) {
      const key = `${selectedTest.id}-${selectedModule}`;
      const currentMax = progress.unlockedUnits[key] || 0;
      if (currentUnitIndex === currentMax) {
        newUnlockedUnits[key] = currentMax + 1;
      }
    }

    saveProgress({
      history: newHistory,
      unlockedUnits: newUnlockedUnits,
      unlockedMockTests: newUnlockedMockTests
    });
  };

  const handleTestSelect = (test: TestMetadata) => {
    setSelectedTest(test);
    if (test.id === TestId.A1_VOCAB_BOOK) {
      setMode('vocab_book');
    } else {
      setMode('curriculum');
    }
  };

  const startExercise = async (index: number) => {
    if (!selectedTest || !selectedModule) return;
    setCurrentUnitIndex(index);
    setCurrentMockIndex(null);
    setLoading(true);
    try {
      const data = await generateMockQuestions(
        selectedTest.name, 
        selectedModule, 
        selectedDifficulty, 
        nativeLang, 
        index, 
        false
      );
      setQuestions(data);
      setMode('practice');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startMockTest = async (index: number) => {
    if (!selectedTest || !selectedModule) return;
    setCurrentMockIndex(index);
    setCurrentUnitIndex(null);
    setLoading(true);
    try {
      const data = await generateMockQuestions(
        selectedTest.name, 
        selectedModule, 
        DifficultyLevel.ADVANCED, 
        nativeLang, 
        index, 
        true
      );
      setQuestions(data);
      setMode('practice');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startInfographic = async () => {
    if (!selectedTest || !selectedModule) return;
    setLoading(true);
    try {
      const data = await generateInfographicContent(
        selectedTest.name, 
        selectedModule, 
        selectedDifficulty, 
        nativeLang
      );
      setInfographic(data);
      setMode('learn');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMode('selection');
    setSelectedTest(null);
    setSelectedModule(null);
    setQuestions([]);
    setInfographic(null);
    setCurrentUnitIndex(null);
    setCurrentMockIndex(null);
  };

  const testLanguage = selectedTest?.category as 'English' | 'German' | undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-indigo-600 p-2 rounded-lg"><GraduationCap className="text-white" size={24} /></div>
            <span className="text-xl font-extrabold tracking-tight">LinguBridge</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Microphone Toggle */}
            <button 
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                isMicEnabled 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {isMicEnabled ? <Mic size={16} className="animate-pulse" /> : <MicOff size={16} />}
              <span className="hidden sm:inline">{isMicEnabled ? 'Mic Active' : 'Mic Muted'}</span>
            </button>

            <button 
              onClick={() => {
                const bookTest = TESTS.find(t => t.id === TestId.A1_VOCAB_BOOK);
                if (bookTest) setSelectedTest(bookTest);
                setMode('vocab_book');
              }} 
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                mode === 'vocab_book' 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-slate-50 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <BookMarked size={18} />
              <span className="hidden md:inline">A1 German Vocab Book</span>
            </button>

            <button onClick={() => setMode('dashboard')} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
              <LayoutDashboard size={18} /> <span className="hidden lg:inline">My Progress</span>
            </button>
            
            <select value={nativeLang} onChange={(e) => setNativeLang(e.target.value as Language)} className="bg-slate-100 p-2 rounded-lg text-sm font-bold border-none outline-none focus:ring-2 focus:ring-indigo-200 max-w-[100px] sm:max-w-none">
              <option value={Language.ENGLISH}>English</option>
              <option value={Language.PUNJABI}>ਪੰਜਾਬੀ</option>
              <option value={Language.SINDHI}>سنڌي</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
               <Loader2 className="animate-spin text-indigo-600 mb-4" size={64} />
               <Sparkles className="absolute -top-1 -right-1 text-amber-400 animate-pulse" size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Compiling Exam Materials...</h2>
            <p className="text-slate-500 mt-2 font-medium">Generating official certification format questions for your curriculum.</p>
          </div>
        ) : mode === 'selection' ? (
          <div className="animate-in fade-in text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <h1 className="text-6xl font-black mb-6 tracking-tight">Master Your <span className="text-indigo-600">Future.</span></h1>
              <p className="text-xl text-slate-500 font-medium">Select your target language proficiency test to begin your structured course journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTS.map((t) => <TestCard key={t.id} test={t} onClick={handleTestSelect} isSelected={false} />)}
            </div>
          </div>
        ) : mode === 'dashboard' ? (
          <div>
            <button onClick={reset} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={20} /> Back to Courses
            </button>
            <ProgressDashboard progress={progress} />
          </div>
        ) : mode === 'curriculum' ? (
          <div className="max-w-5xl mx-auto">
            <button onClick={reset} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={20} /> Switch Exam
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedTest?.category}</span>
                   <span className="text-sm font-bold text-slate-400">{selectedTest?.levels}</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900">{selectedTest?.name} Certification</h2>
                <p className="text-slate-500 mt-2 font-medium max-w-xl">{selectedTest?.description}</p>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
                <button onClick={() => setActiveTab('learning')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'learning' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  <BookOpen size={18} /> Units
                </button>
                <button onClick={() => setActiveTab('exams')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'exams' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Trophy size={18} /> Mock Exams
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Skill Module</h4>
                <ModuleSelector onSelect={setSelectedModule} selected={selectedModule} />
              </section>

              {activeTab === 'learning' && (
                <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Proficiency Level</h4>
                  <DifficultySelector selected={selectedDifficulty} onSelect={setSelectedDifficulty} />
                </section>
              )}
            </div>

            <div className="mt-12">
              {selectedModule ? (
                <div className="animate-in slide-in-from-bottom-6 duration-500">
                  {activeTab === 'learning' ? (
                    <div className="space-y-12">
                      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                          <Target size={200} />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 text-amber-300 font-black uppercase tracking-widest text-xs mb-3">
                             <Sparkles size={16} /> Strategy Board
                          </div>
                          <h3 className="text-4xl font-black mb-4">Official Test Formats</h3>
                          <p className="opacity-90 text-lg max-w-md">Master the {selectedModule} module with deep visual guides and native language support in {nativeLang}.</p>
                        </div>
                        <button onClick={startInfographic} className="relative z-10 bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 whitespace-nowrap">
                          Study Strategies
                        </button>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-6 px-2">
                          <h4 className="text-2xl font-black text-slate-800">Pedagogical Sequence (15 Units)</h4>
                          <div className="text-xs font-bold text-slate-400">
                            {progress.unlockedUnits[`${selectedTest!.id}-${selectedModule}`] || 0} / 15 Complete
                          </div>
                        </div>
                        <UnitGrid 
                          total={15} 
                          unlockedCount={progress.unlockedUnits[`${selectedTest!.id}-${selectedModule}`] || 0} 
                          onSelect={startExercise}
                          testId={selectedTest!.id}
                          module={selectedModule}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-8 px-2">
                        <h4 className="text-2xl font-black text-slate-800">Official Exam Simulation (10 Mocks)</h4>
                        <div className="text-xs font-bold text-slate-400">
                          {progress.unlockedMockTests[selectedTest!.id] || 0} / 10 Complete
                        </div>
                      </div>
                      <UnitGrid 
                        total={10} 
                        unlockedCount={progress.unlockedMockTests[selectedTest!.id] || 0} 
                        onSelect={startMockTest}
                        variant="mock"
                        testId={selectedTest!.id}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                     <Target size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-700">Select a Module to Progress</h3>
                  <p className="text-slate-400 font-bold mt-2">Unlock the sequential units by focusing on one skill at a time.</p>
                </div>
              )}
            </div>
          </div>
        ) : mode === 'practice' ? (
          <div>
            <button onClick={() => setMode('curriculum')} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={20} /> Exit Session
            </button>
            {selectedModule === 'Speaking' ? (
              <SpeakingPractice 
                questions={questions} 
                nativeLang={nativeLang} 
                difficulty={selectedDifficulty}
                onRestart={() => setMode('curriculum')}
                onComplete={(avg) => recordSession(avg, 10)}
                testLanguage={testLanguage}
                testName={selectedTest?.name}
                isMicEnabled={isMicEnabled}
              />
            ) : selectedModule === 'Writing' ? (
              <WritingPractice
                questions={questions}
                nativeLang={nativeLang}
                difficulty={selectedDifficulty}
                onRestart={() => setMode('curriculum')}
                onComplete={(avg) => recordSession(avg, 10)}
                testLanguage={testLanguage}
                testName={selectedTest?.name}
                isMicEnabled={isMicEnabled}
              />
            ) : (
              <MockTest 
                questions={questions} 
                nativeLang={nativeLang} 
                onRestart={() => setMode('curriculum')}
                onComplete={(score, total) => recordSession(score, total)}
                testLanguage={testLanguage}
              />
            )}
          </div>
        ) : mode === 'vocab_book' ? (
          <div>
            <button onClick={reset} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors print:hidden">
              <ChevronLeft size={20} /> Back to Courses
            </button>
            <VocabularySheet />
          </div>
        ) : (
          <div>
            <button onClick={() => setMode('curriculum')} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors">
              <ChevronLeft size={20} /> Back
            </button>
            <Infographic data={infographic!} testLanguage={testLanguage} />
            <button
               onClick={() => { recordSession(10, 10); setMode('curriculum'); }}
               className="w-full max-w-4xl mx-auto block py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-lg text-center"
            >
               Complete Study Unit
            </button>
          </div>
        )}
      </main>

      {/* Globally active dictionary when a test is selected */}
      {selectedTest && testLanguage && (
        <DictionaryOverlay 
          nativeLang={nativeLang} 
          testLanguage={testLanguage} 
        />
      )}
    </div>
  );
};

export default App;
