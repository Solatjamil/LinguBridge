
import React from 'react';
import { Lock, CheckCircle2, PlayCircle } from 'lucide-react';
import { TestId, TestModule } from '../types';

interface UnitGridProps {
  total: number;
  unlockedCount: number; // The index of the furthest unit unlocked (0-indexed)
  onSelect: (index: number) => void;
  variant?: 'exercise' | 'mock';
  testId: TestId;
  module?: TestModule;
}

export const UnitGrid: React.FC<UnitGridProps> = ({ 
  total, 
  unlockedCount, 
  onSelect, 
  variant = 'exercise' 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {Array.from({ length: total }).map((_, i) => {
        const isUnlocked = i <= unlockedCount;
        const isCompleted = i < unlockedCount;
        const isActive = i === unlockedCount;

        return (
          <button
            key={i}
            disabled={!isUnlocked}
            onClick={() => onSelect(i)}
            className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center group ${
              isCompleted 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : isActive 
                ? 'bg-white border-indigo-600 shadow-md scale-105 z-10' 
                : isUnlocked
                ? 'bg-white border-slate-200 hover:border-indigo-400 text-slate-600'
                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-75'
            }`}
          >
            <div className="mb-2">
              {isCompleted ? (
                <CheckCircle2 size={24} />
              ) : !isUnlocked ? (
                <Lock size={20} />
              ) : (
                <PlayCircle size={24} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              )}
            </div>
            
            <div className="text-[10px] font-black uppercase tracking-tighter mb-1">
              {variant === 'exercise' ? `Unit` : `Mock`}
            </div>
            <div className="text-xl font-black">{i + 1}</div>
            
            {isActive && (
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] px-2 py-1 rounded-full font-bold animate-bounce">
                START
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
