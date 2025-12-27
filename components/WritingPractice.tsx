
import React, { useState, useRef, useEffect } from 'react';
import { Question, Language, DifficultyLevel } from '../types';
import { 
  PenTool, 
  Mic, 
  MicOff,
  Square, 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  Info, 
  BrainCircuit, 
  Play, 
  Trash2, 
  Award, 
  CheckCircle2, 
  Lightbulb, 
  Languages, 
  Target, 
  FileText,
  ClipboardCheck,
  Zap,
  Waves,
  Activity,
  Search
} from 'lucide-react';
import { analyzeWritingTask } from '../services/geminiService';
import { PronunciationButton } from './PronunciationButton';

interface WritingPracticeProps {
  questions: Question[];
  nativeLang: Language;
  difficulty: DifficultyLevel;
  onRestart: () => void;
  onComplete?: (avgScore: number) => void;
  testLanguage?: 'English' | 'German';
  testName?: string;
  isMicEnabled: boolean;
}

interface WritingFeedback {
  taskResponseScore: number;
  cohesionScore: number;
  vocabularyScore: number;
  grammarScore: number;
  writingFeedback: string;
  thoughtProcessAnalysis?: string;
  suggestions: string[];
  nativeSummary: string;
}

const WaveformVisualizer: React.FC<{ stream: MediaStream | null }> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgba(99, 102, 241, ${dataArray[i] / 255 + 0.2})`;
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

  return <canvas ref={canvasRef} width={300} height={40} className="rounded-lg w-full h-10 mt-2 bg-indigo-50/50" />;
};

export const WritingPractice: React.FC<WritingPracticeProps> = ({
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
  const [writtenText, setWrittenText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
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
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

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
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record your thought process.");
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
    if (!writtenText || !currentQuestion) return;
    
    setIsAnalyzing(true);
    try {
      let base64: string | null = null;
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const res = (reader.result as string).split(',')[1];
            resolve(res);
          };
        });
        reader.readAsDataURL(audioBlob);
        base64 = await base64Promise;
      }
      
      const result = await analyzeWritingTask(
        testName,
        currentQuestion.text,
        writtenText,
        base64,
        nativeLang,
        difficulty
      );
      setFeedback(result);
      const avg = (result.taskResponseScore + result.cohesionScore + result.vocabularyScore + result.grammarScore) / 4;
      setSessionScores(prev => [...prev, avg]);
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setWrittenText('');
      setAudioUrl(null);
      setFeedback(null);
      setRecordingTime(0);
      audioChunksRef.current = [];
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

  const wordCount = writtenText.trim() ? writtenText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 px-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Writing Portfolio • {currentIndex + 1} / {questions.length}
        </span>
        <div className="w-32 sm:w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col: Prompt & Thought Recorder */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                <MessageSquare size={14} />
                Prompt
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLookupPrompt}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Lookup Task Prompt"
                >
                  <Search size={14} />
                </button>
                <PronunciationButton text={currentQuestion.text} variant="small" language={testLanguage} />
              </div>
            </div>
            <p className="text-slate-800 font-bold leading-relaxed text-sm">
              {currentQuestion.text}
            </p>
          </div>
          {/* ... Rest of component stays same ... */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest">
                <BrainCircuit size={14} />
                Thought Process
              </div>
              {recordingTime > 0 && (
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${isRecording ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                  {formatTime(recordingTime)}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {!audioUrl || isRecording ? (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all font-black text-xs ${
                    isRecording 
                      ? 'bg-rose-50 text-rose-600 border-2 border-rose-200' 
                      : !isMicEnabled
                        ? 'bg-slate-50 text-slate-400 border-2 border-dashed border-slate-200 cursor-not-allowed opacity-50'
                        : 'bg-indigo-50 text-indigo-600 border-2 border-transparent hover:bg-indigo-100'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square size={20} fill="currentColor" />
                      <span>Stop Recording</span>
                    </>
                  ) : !isMicEnabled ? (
                    <>
                      <MicOff size={20} />
                      <span>Mic Muted</span>
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      <span>Record Strategy</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => new Audio(audioUrl).play()}
                      className="flex-grow py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-200"
                    >
                      <Play size={14} fill="currentColor" /> Play Back
                    </button>
                    <button
                      onClick={() => { setAudioUrl(null); audioChunksRef.current = []; setRecordingTime(0); }}
                      className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
              {isRecording && <WaveformVisualizer stream={stream} />}
            </div>
            
            <p className="mt-4 text-[10px] text-slate-400 font-medium italic leading-relaxed text-center">
              {isMicEnabled 
                ? "Optional: Talk through your essay structure."
                : "Microphone is muted in the header."}
            </p>
          </div>
        </div>

        {/* Right Col: Editor & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden min-h-[450px] sm:min-h-[550px] flex flex-col transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-600 font-black text-[10px] uppercase tracking-widest">
                <PenTool size={14} className="text-emerald-500" />
                Response Lab
              </div>
              <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border transition-colors ${wordCount > 150 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                {wordCount} Words
              </div>
            </div>
            
            <textarea
              value={writtenText}
              onChange={(e) => setWrittenText(e.target.value)}
              placeholder="Start drafting your response... highlight any word you don't know for an instant definition."
              className="flex-grow p-8 outline-none resize-none text-base sm:text-lg text-slate-800 leading-relaxed placeholder:text-slate-300 font-medium bg-transparent"
              spellCheck={false}
              disabled={isAnalyzing || !!feedback}
            />

            {!feedback && (
              <div className="p-6 bg-white">
                <button
                  onClick={getAIFeedback}
                  disabled={!writtenText || isAnalyzing}
                  className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 hover:-translate-y-1 active:translate-y-0"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="animate-spin" size={24} /> Analyzing Mastery...</>
                  ) : (
                    <><Sparkles size={24} /> Submit & Get Feedback</>
                  )}
                </button>
              </div>
            )}
          </div>
          {/* ... Feedback Display stays same ... */}
          {feedback && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Task Response', val: feedback.taskResponseScore, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                  { label: 'Cohesion', val: feedback.cohesionScore, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                  { label: 'Lexical Range', val: feedback.vocabularyScore, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
                  { label: 'Grammar', val: feedback.grammarScore, bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' }
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} p-5 rounded-3xl border ${s.border} text-center shadow-sm`}>
                    <div className="text-[8px] font-black uppercase mb-1 tracking-widest opacity-60">{s.label}</div>
                    <div className={`text-3xl font-black ${s.text}`}>{s.val}<span className="text-xs opacity-50">/10</span></div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="bg-slate-900 px-8 py-5 flex items-center gap-3 text-white">
                    <FileText size={20} className="text-emerald-400" />
                    <span className="font-black uppercase text-xs tracking-widest">Examiner Evaluation</span>
                  </div>
                  <div className="p-8">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                      {feedback.writingFeedback}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 font-black uppercase text-xs tracking-widest mb-6 text-indigo-200">
                      <Zap size={20} className="text-amber-400" />
                      Linguistic Bridge ({nativeLang})
                    </div>
                    <p className="font-black leading-relaxed text-2xl italic">
                      {feedback.nativeSummary}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl hover:-translate-y-2 active:translate-y-0"
                >
                  {currentIndex === questions.length - 1 ? 'Finalize Certification Unit' : 'Next Writing Task'}
                  <ChevronRight size={32} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
