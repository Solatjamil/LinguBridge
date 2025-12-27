
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Question, Language, DifficultyLevel } from '../types';
import { 
  Mic, 
  MicOff,
  Square, 
  Play, 
  RefreshCcw, 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  Target, 
  Award, 
  Info, 
  AudioWaveform, 
  Activity, 
  Zap, 
  PenTool, 
  TrendingUp, 
  Music, 
  Languages, 
  BookOpen, 
  Star, 
  ArrowUpRight, 
  CheckCircle2, 
  Quote, 
  Book,
  Flag,
  AlertCircle,
  Waves,
  BarChart,
  Search,
  Volume2
} from 'lucide-react';
import { analyzeSpeakingResponse, generateSpeech } from '../services/geminiService';
import { PronunciationButton } from './PronunciationButton';

interface SpeakingPracticeProps {
  questions: Question[];
  nativeLang: Language;
  difficulty: DifficultyLevel;
  onRestart: () => void;
  onComplete?: (avgScore: number) => void;
  testLanguage?: 'English' | 'German';
  testName?: string;
  isMicEnabled: boolean;
}

interface Suggestion {
  category: string;
  text: string;
}

interface SpeakingFeedback {
  transcript: string;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  pronunciationPhonemes: string;
  pronunciationIntonation: string;
  pronunciationStress: string;
  pronunciationStandardComparison: string;
  fluencyDetails: string;
  grammarDetails: string;
  feedback: string;
  suggestions: Suggestion[];
  nativeFeedback: string;
}

const WaveformVisualizer: React.FC<{ stream: MediaStream | null }> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${dataArray[i] / 255 + 0.1})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      audioCtx.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} width={400} height={80} className="rounded-2xl w-full max-w-sm mx-auto mb-6 bg-slate-900/10" />;
};

const SpeechSpectrogram: React.FC<{ audioUrl: string | null }> = ({ audioUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const renderSpectrogram = async () => {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const width = canvas.width;
      const height = canvas.height;

      const rawData = audioBuffer.getChannelData(0);
      const samplesPerPixel = Math.floor(rawData.length / width);
      
      ctx.clearRect(0, 0, width, height);

      // Pitch tracking logic
      const pitchPoints: number[] = [];
      for (let i = 0; i < width; i++) {
        const offset = i * samplesPerPixel;
        let min = 1.0;
        let max = -1.0;
        
        for (let j = 0; j < Math.min(samplesPerPixel, rawData.length - offset); j++) {
          const datum = rawData[offset + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }

        const barHeight = (max - min) * height;
        const opacity = Math.min(1, (max - min) + 0.1);
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(244, 63, 94, ${opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, ${opacity * 0.4})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i, height / 2 - barHeight / 2, 1, barHeight);

        if (max - min > 0.05) {
          pitchPoints.push(height - ((max + 1) / 2) * height);
        } else {
          pitchPoints.push(-1);
        }
      }

      ctx.beginPath();
      ctx.strokeStyle = '#FCD34D';
      ctx.lineWidth = 3;
      let drawing = false;
      for (let i = 0; i < pitchPoints.length; i++) {
        if (pitchPoints[i] !== -1) {
          if (!drawing) {
            ctx.moveTo(i, pitchPoints[i]);
            drawing = true;
          } else {
            ctx.lineTo(i, pitchPoints[i]);
          }
        } else {
          drawing = false;
        }
      }
      ctx.stroke();
      
      audioCtx.close();
    };

    renderSpectrogram();
  }, [audioUrl]);

  return (
    <div className="bg-slate-950 rounded-[2rem] p-8 shadow-inner border border-slate-800 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-widest">
            <Waves size={16} /> Intensity
          </div>
          <div className="flex items-center gap-2 text-amber-300 font-black uppercase text-[10px] tracking-widest">
            <Activity size={16} /> Intonation Line
          </div>
        </div>
        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Timeline Analysis (Time &rarr;)</div>
      </div>
      <canvas ref={canvasRef} width={1200} height={200} className="w-full h-32 relative z-10" />
    </div>
  );
};

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({ 
  questions, 
  nativeLang, 
  difficulty,
  onRestart,
  onComplete,
  testLanguage = 'English',
  testName = 'IELTS',
  isMicEnabled
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleLookupPrompt = () => {
    window.dispatchEvent(new CustomEvent('lingu-lookup', { detail: { term: currentQuestion.text } }));
  };

  const startRecording = async () => {
    if (!isMicEnabled) {
      alert("Microphone is currently muted in the header. Please unmute to continue.");
      return;
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      const recorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setFeedback(null);
      setAudioUrl(null);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for Speaking tasks.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const getAIFeedback = async () => {
    if (!audioUrl || !currentQuestion) return;
    
    setIsAnalyzing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      
      const audioBase64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      
      reader.readAsDataURL(audioBlob);
      const base64 = await audioBase64Promise;
      
      const result = await analyzeSpeakingResponse(
        testName,
        currentQuestion.text,
        base64,
        nativeLang,
        difficulty
      );
      setFeedback(result);
      const avg = (result.pronunciationScore + result.fluencyScore + result.grammarScore) / 3;
      setSessionScores(prev => [...prev, avg]);
    } catch (err) {
      console.error("Feedback analysis error:", err);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAudioUrl(null);
      setFeedback(null);
      setRecordingTime(0);
    } else {
      if (onComplete) {
        const total = sessionScores.reduce((a, b) => a + b, 0);
        onComplete(total / Math.max(1, sessionScores.length));
      }
      onRestart();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSuggestionConfig = (category: string, score: number = 7) => {
    const cat = category.toLowerCase();
    let config = { 
      icon: <Target size={20} />, 
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200', 
      dot: 'bg-indigo-500', 
      label: 'Strategy',
      priority: 'Polish'
    };

    if (cat.includes('pronun')) {
      config = { ...config, icon: <Mic size={20} />, color: 'bg-rose-50 text-rose-600 border-rose-200', dot: 'bg-rose-500', label: 'Pronunciation' };
    } else if (cat.includes('fluen')) {
      config = { ...config, icon: <Zap size={20} />, color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500', label: 'Fluency' };
    } else if (cat.includes('gramm')) {
      config = { ...config, icon: <PenTool size={20} />, color: 'bg-violet-50 text-violet-600 border-violet-200', dot: 'bg-violet-500', label: 'Grammar' };
    } else if (cat.includes('vocab')) {
      config = { ...config, icon: <Book size={20} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500', label: 'Vocabulary' };
    }

    if (score < 5) config.priority = 'Critical Focus';
    else if (score < 7.5) config.priority = 'Needs Work';
    else config.priority = 'Fine Tuning';

    return config;
  };

  const getCategoryScore = (category: string) => {
    if (!feedback) return 7;
    const cat = category.toLowerCase();
    if (cat.includes('pronun')) return feedback.pronunciationScore;
    if (cat.includes('fluen')) return feedback.fluencyScore;
    if (cat.includes('gramm')) return feedback.grammarScore;
    return 7;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Speaking Task {currentIndex + 1} of {questions.length}
        </span>
        <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-rose-600 transition-all duration-700 ease-out" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-xs tracking-widest">
              <MessageSquare size={16} />
              Test Prompt
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLookupPrompt}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                <Search size={12} /> Lookup Sentence
              </button>
              {!isMicEnabled && (
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 animate-pulse">
                  <MicOff size={12} /> Mic Disabled
                </div>
              )}
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 leading-tight">
            {currentQuestion.text}
          </h3>
          
          <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-400"><Info size={16} /></div>
              <p className="text-sm text-slate-600 italic font-medium">
                Official <strong>{testName}</strong> evaluation criteria.
              </p>
            </div>
            <PronunciationButton text={currentQuestion.text} language={testLanguage} />
          </div>
        </div>
        {/* ... Rest of component stays same ... */}
        <div className="p-10 space-y-10">
          <div className="flex flex-col items-center justify-center space-y-8 py-4">
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping scale-150" />
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 hover:scale-105 active:scale-95 ${
                  isRecording 
                    ? 'bg-rose-100 text-rose-600 border-4 border-rose-200' 
                    : !isMicEnabled 
                      ? 'bg-slate-200 text-slate-400 border-4 border-slate-100 cursor-not-allowed'
                      : 'bg-rose-600 text-white'
                }`}
              >
                {isRecording ? <Square size={40} fill="currentColor" /> : !isMicEnabled ? <MicOff size={40} /> : <Mic size={40} />}
              </button>
            </div>
            
            <div className="text-center w-full">
              <div className={`text-5xl font-mono font-black tracking-tighter ${isRecording ? 'text-rose-600' : 'text-slate-300'}`}>
                {formatTime(recordingTime)}
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-3">
                {isRecording ? 'Voice Capture Active' : !isMicEnabled ? 'Please Unmute Mic to Start' : 'Voice Capture Ready'}
              </p>
            </div>
          </div>

          {audioUrl && !isRecording && (
            <div className="flex items-center justify-center gap-4 py-8 border-y border-slate-50">
              <button
                onClick={() => new Audio(audioUrl).play()}
                className="flex items-center gap-3 px-10 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black hover:bg-indigo-100 transition-all shadow-sm"
              >
                <Play size={24} fill="currentColor" /> Listen Back
              </button>
              <button
                onClick={startRecording}
                className="flex items-center gap-3 px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                <RefreshCcw size={24} /> Redo Capture
              </button>
            </div>
          )}

          {audioUrl && !isRecording && !feedback && (
            <button
              onClick={getAIFeedback}
              disabled={isAnalyzing}
              className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 hover:-translate-y-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={28} /> Analyzing Performance...
                </>
              ) : (
                <>
                  <Sparkles size={28} /> Analyze Speaking Performance
                </>
              )}
            </button>
          )}

          {feedback && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-6">
              
              <section className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity size={18} /></div>
                  <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Acoustic Visualization</span>
                </div>
                <SpeechSpectrogram audioUrl={audioUrl} />
              </section>

              {/* Transcript Section */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Quote size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-indigo-400 font-black uppercase text-xs tracking-widest mb-6">
                    <Activity size={20} /> AI Verbatim Capture
                  </div>
                  <p className="text-2xl font-medium leading-relaxed italic text-slate-200 border-l-4 border-indigo-500 pl-8">
                    "{feedback.transcript}"
                  </p>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Pronunciation', score: feedback.pronunciationScore, bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: <Mic size={18} /> },
                  { label: 'Fluency', score: feedback.fluencyScore, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: <Zap size={18} /> },
                  { label: 'Grammar', score: feedback.grammarScore, bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', icon: <PenTool size={18} /> }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-8 rounded-[2rem] border ${stat.border} text-center shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase mb-3 tracking-widest opacity-60">
                      {stat.icon} {stat.label}
                    </div>
                    <div className={`text-5xl font-black ${stat.text}`}>{stat.score}<span className="text-xl opacity-40">/10</span></div>
                  </div>
                ))}
              </div>

              {/* Improvement Roadmap Section */}
              <div className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Award size={140} />
                  </div>
                  <div className="flex items-center gap-3 text-slate-800 font-black text-2xl mb-8 relative z-10">
                    <Award size={32} className="text-amber-500" />
                    Expert Verdict
                  </div>
                  <p className="text-slate-800 leading-relaxed text-xl font-bold bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8 relative z-10">
                    {feedback.feedback}
                  </p>
                </div>

                {/* Native Language bridge summary */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Languages size={220} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 font-black uppercase text-xs tracking-[0.3em] mb-8 text-indigo-200">
                      <Sparkles size={24} className="text-amber-400" />
                      Linguistic Bridge ({nativeLang})
                    </div>
                    <p className="font-black leading-relaxed text-3xl italic max-w-2xl">
                      {feedback.nativeFeedback}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-black transition-all flex items-center justify-center gap-6 shadow-2xl hover:-translate-y-2 active:translate-y-0"
              >
                {currentIndex === questions.length - 1 ? 'Finalize Certification Unit' : 'Advance to Next Task'}
                <ChevronRight size={36} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
