
import React from 'react';
import { DifficultyLevel } from '../types';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface DifficultySelectorProps {
  selected: DifficultyLevel | null;
  onSelect: (level: DifficultyLevel) => void;
}

const levels = [
  { 
    id: DifficultyLevel.BEGINNER, 
    icon: ShieldCheck, 
    color: 'text-green-600 bg-green-50 border-green-200 hover:border-green-400',
    activeColor: 'bg-green-600 text-white border-green-600',
    desc: 'Foundational concepts and simple structures.' 
  },
  { 
    id: DifficultyLevel.INTERMEDIATE, 
    icon: Shield, 
    color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400',
    activeColor: 'bg-blue-600 text-white border-blue-600',
    desc: 'Complex topics and standard academic usage.' 
  },
  { 
    id: DifficultyLevel.ADVANCED, 
    icon: ShieldAlert, 
    color: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400',
    activeColor: 'bg-rose-600 text-white border-rose-600',
    desc: 'Sophisticated nuance and high-level proficiency.' 
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {levels.map((l) => {
        const isActive = selected === l.id;
        const Icon = l.icon;
        
        return (
          <button
            key={l.id}
            onClick={() => onSelect(l.id)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              isActive ? l.activeColor + ' shadow-lg scale-105' : l.color + ' bg-white'
            }`}
          >
            <Icon size={24} className="mb-2" />
            <h4 className="font-bold">{l.id}</h4>
            <p className={`text-[10px] mt-1 text-center font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
              {l.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
};
