
import React from 'react';
import { TestModule } from '../types';
import { Book, PenTool, Headphones, Mic2 } from 'lucide-react';

interface ModuleSelectorProps {
  onSelect: (module: TestModule) => void;
  selected: TestModule | null;
}

const modules: { id: TestModule; icon: any; color: string; activeColor: string; desc: string }[] = [
  { id: 'Reading', icon: Book, color: 'text-blue-600 bg-blue-50 border-blue-100', activeColor: 'border-blue-500 bg-blue-50 ring-2 ring-blue-200', desc: 'Comprehension & Analysis' },
  { id: 'Writing', icon: PenTool, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', activeColor: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200', desc: 'Composition & Grammar' },
  { id: 'Listening', icon: Headphones, color: 'text-amber-600 bg-amber-50 border-amber-100', activeColor: 'border-amber-500 bg-amber-50 ring-2 ring-amber-200', desc: 'Audio Interpretation' },
  { id: 'Speaking', icon: Mic2, color: 'text-rose-600 bg-rose-50 border-rose-100', activeColor: 'border-rose-500 bg-rose-50 ring-2 ring-rose-200', desc: 'Fluency & Pronunciation' },
];

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {modules.map((m) => {
        const isActive = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
              isActive 
                ? 'bg-white border-indigo-600 shadow-lg scale-105' 
                : 'bg-white border-slate-100 hover:border-indigo-400'
            }`}
          >
            <div className={`p-4 rounded-xl mb-4 border ${isActive ? 'bg-indigo-600 text-white border-indigo-600' : m.color}`}>
              <m.icon size={32} />
            </div>
            <h3 className={`text-xl font-bold ${isActive ? 'text-indigo-600' : 'text-slate-800'}`}>{m.id}</h3>
            <p className="text-xs text-slate-500 mt-2 font-medium">{m.desc}</p>
          </button>
        );
      })}
    </div>
  );
};
