
import React from 'react';
import { InfographicData } from '../types';
import { Lightbulb, CheckCircle2, Layout, BookOpen, AudioWaveform, Gavel, Sparkles, Languages, ChevronRight, Volume2, Search } from 'lucide-react';
import { PronunciationButton } from './PronunciationButton';

interface InfographicProps {
  data: InfographicData;
  testLanguage?: 'English' | 'German';
}

export const Infographic: React.FC<InfographicProps> = ({ data, testLanguage = 'English' }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 max-w-5xl mx-auto mb-10 transition-all">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
          <Layout size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
              Study Material
            </span>
          </div>
          <h2 className="text-4xl font-black mb-3 leading-tight">{data.title}</h2>
          <p className="text-indigo-100 text-xl font-medium max-w-2xl leading-relaxed">{data.concept}</p>
        </div>
      </div>
      
      <div className="p-10 grid lg:grid-cols-12 gap-10">
        {/* Left Column: Examples & Core Info (7/12) */}
        <div className="lg:col-span-7 space-y-10">
          {/* Main Examples Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 text-slate-800">
              <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                <BookOpen size={24} />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Essential Phrases</h3>
            </div>
            <div className="grid gap-4">
              {data.examples.map((ex, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <p className="font-black text-slate-800 text-xl group-hover:text-indigo-600 transition-colors">{ex.original}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Languages size={14} className="text-indigo-400" />
                        <p className="text-indigo-600 font-bold text-sm italic">{ex.translation}</p>
                      </div>
                    </div>
                    <PronunciationButton text={ex.original} variant="normal" language={testLanguage} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Context</span>
                    <p className="text-xs text-slate-500 font-medium">{ex.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Grammar Lab: Comprehensive Rule Explanations */}
          <section className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100 shadow-inner">
            <div className="flex items-center gap-3 mb-6 text-emerald-800">
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                <Gavel size={24} />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Grammar Lab</h3>
            </div>
            
            <div className="space-y-6">
              {data.grammarRules.map((gr, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                    <Sparkles size={40} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-black text-emerald-900 text-lg mb-2 flex items-center gap-2">
                      <ChevronRight size={18} className="text-emerald-400" />
                      {gr.rule}
                    </h4>
                    <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
                      {gr.explanation}
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Example Application</span>
                        <PronunciationButton text={gr.example} variant="small" language={testLanguage} />
                      </div>
                      <p className="text-base font-black text-slate-800">{gr.example}</p>
                      <div className="flex items-center gap-2 py-1 px-3 bg-emerald-100/50 rounded-lg w-fit">
                        <Languages size={14} className="text-emerald-600" />
                        <p className="text-sm font-bold text-emerald-700 italic">{gr.exampleTranslation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Tips & Vocabulary (5/12) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Vocabulary Spotlight with Pronunciation & Dictionary Integration */}
          {data.difficultTerms && data.difficultTerms.length > 0 && (
            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                <Search size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-black uppercase tracking-widest">
                    <AudioWaveform size={18} />
                    Vocabulary Spotlight
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 uppercase">
                    <Sparkles size={10} /> AI Enhanced
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {data.difficultTerms.map((term, i) => (
                    <PronunciationButton 
                      key={i} 
                      text={term} 
                      language={testLanguage} 
                    />
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-indigo-100">
                  <p className="text-[11px] text-indigo-700 font-black uppercase tracking-wider mb-2">Interactive Learning</p>
                  <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
                    Click any term to trigger the <strong>AI Dictionary</strong> for deep contextual analysis, translations, and native explanations. Tap the speaker to master pronunciation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pro Tips Section */}
          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-amber-700">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Lightbulb size={24} />
              </div>
              <h3 className="font-black text-xl tracking-tight">Exam Strategy</h3>
            </div>
            <ul className="space-y-4">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex gap-4 text-slate-700 items-start group">
                  <div className="mt-1 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  </div>
                  <span className="font-medium text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Structure Guide */}
          <div className="bg-violet-50 rounded-3xl p-8 border border-violet-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-violet-700">
              <div className="bg-violet-100 p-2 rounded-xl">
                <Layout size={24} />
              </div>
              <h3 className="font-black text-xl tracking-tight">Structure Map</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {data.visualElements.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-violet-100 flex items-center justify-between group hover:border-violet-300 transition-all">
                  <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{item.label}</div>
                  <div className="text-sm font-black text-violet-800">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
