
import React from 'react';
import { TestMetadata } from '../types';

interface TestCardProps {
  test: TestMetadata;
  onClick: (test: TestMetadata) => void;
  isSelected: boolean;
}

export const TestCard: React.FC<TestCardProps> = ({ test, onClick, isSelected }) => {
  return (
    <button
      onClick={() => onClick(test)}
      className={`p-6 rounded-xl border-2 transition-all text-left flex flex-col h-full ${
        isSelected 
          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          test.category === 'English' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {test.category}
        </span>
        <span className="text-sm font-medium text-slate-500">{test.levels}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{test.name}</h3>
      <p className="text-sm text-slate-600 flex-grow mb-4">{test.description}</p>
      <div className="text-xs font-semibold text-slate-400 mt-auto pt-4 border-t border-slate-100">
        {test.purpose}
      </div>
    </button>
  );
};
