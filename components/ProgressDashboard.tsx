
import React, { useState, useMemo } from 'react';
import { UserProgress, TestModule, Language, TestId } from '../types';
import { TESTS } from '../constants';
import { 
  History, 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Zap, 
  Flame, 
  BrainCircuit,
  ArrowUpRight,
  Filter,
  Globe2
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: UserProgress;
}

type ProgressView = 'Global' | 'English' | 'German';

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  const [view, setView] = useState<ProgressView>('Global');

  // Map test IDs to their categories for filtering
  const testCategoryMap = useMemo(() => {
    return TESTS.reduce((acc, test) => {
      acc[test.id] = test.category;
      return acc;
    }, {} as Record<TestId, 'English' | 'German'>);
  }, []);

  // Filter history based on view
  const filteredHistory = useMemo(() => {
    const sorted = [...progress.history].reverse();
    if (view === 'Global') return sorted;
    return sorted.filter(session => testCategoryMap[session.testId] === view);
  }, [progress.history, view, testCategoryMap]);

  // Filter unlocked units based on view
  const filteredUnits = useMemo(() => {
    if (view === 'Global') return progress.unlockedUnits;
    return Object.entries(progress.unlockedUnits).reduce((acc, [key, val]) => {
      const testIdPart = key.split('-')[0] as TestId;
      if (testCategoryMap[testIdPart] === view) {
        // Fix: Explicitly cast 'val' to 'number' to satisfy TypeScript (line 53)
        acc[key] = val as number;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [progress.unlockedUnits, view, testCategoryMap]);

  // Filter mock tests based on view
  const filteredMocks = useMemo(() => {
    if (view === 'Global') return progress.unlockedMockTests;
    return Object.entries(progress.unlockedMockTests).reduce((acc, [key, val]) => {
      if (testCategoryMap[key as TestId] === view) {
        // Fix: Explicitly cast 'val' to 'number' to satisfy TypeScript (line 64)
        acc[key] = val as number;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [progress.unlockedMockTests, view, testCategoryMap]);

  const totalSessions = filteredHistory.length;
  const scoreSessions = filteredHistory.filter(h => h.type !== 'learn');
  
  const avgScore = scoreSessions.length > 0 
    ? scoreSessions.reduce((acc, curr) => acc + (curr.score || 0) / (curr.totalQuestions || 10), 0) / scoreSessions.length * 10
    : 0;

  // Derive stats per module
  const modules: TestModule[] = ['Reading', 'Writing', 'Listening', 'Speaking'];
  const moduleStats = modules.map(m => {
    const sessions = filteredHistory.filter(h => h.module === m);
    const completedUnits = Object.entries(filteredUnits)
      .filter(([key]) => key.includes(m))
      .reduce((acc: number, [_, val]) => acc + (val as number), 0);
    
    const validScores = sessions.filter(s => s.score !== undefined);
    const avg = validScores.length > 0
      ? validScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / validScores.reduce((acc, curr) => acc + (curr.totalQuestions || 10), 0) * 10
      : 0;

    return { name: m, avg, completedUnits, totalUnits: 15, sessionCount: sessions.length };
  });

  // Calculate Standing with language specificity
  const getStanding = () => {
    if (totalSessions === 0) return { label: "New Learner", desc: `Start your first ${view === 'Global' ? '' : view} unit to begin analysis.`, color: "text-slate-400" };
    
    const levelPrefix = view === 'English' ? 'IELTS Candidate' : view === 'German' ? 'CEFR Level' : 'Candidate';
    
    if (avgScore >= 8.5) return { 
      label: `Expert ${levelPrefix}`, 
      desc: view === 'English' ? "Projected Band 8.5-9.0. Ready for Advanced Research." : "Performing at C2 Mastery level.", 
      color: "text-emerald-600" 
    };
    if (avgScore >= 7.0) return { 
      label: `Strong ${levelPrefix}`, 
      desc: view === 'English' ? "Projected Band 7.0-7.5. Great for most Universities." : "Solid B2-C1 Proficiency established.", 
      color: "text-indigo-600" 
    };
    if (avgScore >= 5.0) return { 
      label: `Developing ${levelPrefix}`, 
      desc: "Steady progress at Intermediate level.", 
      color: "text-amber-600" 
    };
    return { label: "Foundation Phase", desc: "Focus on core linguistic basics.", color: "text-rose-600" };
  };

  const standing = getStanding();
  const weakestModule = [...moduleStats].sort((a, b) => a.avg - b.avg)[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      {/* View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg">
            <Filter size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800">Analyze Progress</h2>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto shadow-inner">
          {(['Global', 'English', 'German'] as ProgressView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                view === v 
                  ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {v === 'Global' && <Globe2 size={14} />}
                {v}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Track-Specific Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{view} Sessions</div>
            <div className="text-2xl font-black text-slate-800">{totalSessions}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
            <Target size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{view} Avg</div>
            <div className="text-2xl font-black text-slate-800">{avgScore.toFixed(1)}/10</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{view} Units</div>
            <div className="text-2xl font-black text-slate-800">
              {Object.values(filteredUnits).reduce((a: number, b: number) => a + (b as number), 0)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{view} Mocks</div>
            <div className="text-2xl font-black text-slate-800">
              {Object.values(filteredMocks).reduce((a: number, b: number) => a + (b as number), 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Standing & Expert Recommendation */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Award size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-4">
                <BrainCircuit size={16} /> {view} Track Intelligence
              </div>
              <h2 className="text-3xl font-black mb-2">Projected Status</h2>
              <div className={`text-4xl font-black mb-6 ${standing.color}`}>{standing.label}</div>
              <p className="text-slate-300 text-lg mb-10 max-w-md font-medium">{standing.desc}</p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-black uppercase tracking-widest">Expert Recommendation</div>
                  <Zap size={18} className="text-amber-400" />
                </div>
                {totalSessions > 0 ? (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-400">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Focus on {weakestModule.name} Module</h4>
                      <p className="text-sm text-slate-400 font-medium">Your {weakestModule.name} score is currently lagging. Targeting this area will result in the fastest {view} band improvement.</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Complete a unit in the {view} track to receive personalized coaching.</p>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Skill Proficiency */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <TrendingUp className="text-indigo-600" />
                {view} Skill Breakdown
              </h3>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregated Results</span>
            </div>
            
            <div className="space-y-10">
              {moduleStats.map((stat, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg">{stat.name}</h4>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {stat.completedUnits} {view} Units • {stat.sessionCount} Track Sessions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600">{stat.avg.toFixed(1)}<span className="text-sm text-slate-300">/10</span></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${
                        view === 'English' ? 'bg-blue-600' : view === 'German' ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${stat.avg * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
              <Flame size={32} />
            </div>
            <div className="text-4xl font-black text-slate-800 mb-1">
              {totalSessions}
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{view} Streak</div>
            <p className="text-sm text-slate-500 font-medium px-4">Consistency in the {view} track leads to native-like intuition.</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Latest {view} Logs</h4>
            <div className="space-y-6">
              {filteredHistory.slice(0, 3).map((session) => (
                <div key={session.id} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <Calendar size={18} />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="font-black text-slate-800 text-sm truncate">{session.testName}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase truncate">{session.module}</div>
                  </div>
                  <div className="text-indigo-600 font-black text-sm">
                    {session.score !== undefined ? `${session.score}/${session.totalQuestions}` : '--'}
                  </div>
                </div>
              ))}
              {filteredHistory.length === 0 && (
                <div className="text-center py-4 text-slate-300 italic text-xs">No track activity</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track Transcript */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-md overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 font-black text-slate-800 text-lg">
            <History size={24} className="text-indigo-600" />
            {view} Transcript
          </div>
          <div className="text-xs font-bold text-slate-400">{totalSessions} Records Found</div>
        </div>
        
        <div className="overflow-x-auto">
          {totalSessions > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Course / Module track</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHistory.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                        <Calendar size={14} />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-800 text-sm">{session.testName}</div>
                      <div className="text-xs text-slate-400 font-bold">{session.module} Track</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                        session.type === 'mock' ? 'bg-rose-100 text-rose-700' :
                        session.type === 'exercise' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {session.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {session.score !== undefined ? (
                        <div className="flex items-center gap-1 font-black text-indigo-600 text-sm">
                          <Award size={16} />
                          {session.score.toFixed(1)} / {session.totalQuestions || 10}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                          <Clock size={14} /> Knowledge Intake
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Globe2 size={40} />
              </div>
              <p className="text-slate-500 font-black text-lg">No sessions found for the {view} Track.</p>
              <p className="text-slate-400 font-medium">Switch views or start learning to populate this list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
