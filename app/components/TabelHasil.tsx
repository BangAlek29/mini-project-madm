import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Result } from '../types';

interface TabelHasilProps {
  results: Result[] | null;
  methodName: string;
  darkMode: boolean;
}

export default function TabelHasil({ results, methodName, darkMode }: TabelHasilProps) {
  const [showResults, setShowResults] = useState(true);

  if (!results) return null;

  return (
    <div className={`rounded-2xl shadow-xl p-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700' 
        : 'bg-white'
    }`}>
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setShowResults(!showResults)}
      >
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          🏆 Hasil Perhitungan - {methodName}
        </h2>
        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
          {showResults ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </span>
      </div>
      
      {showResults && (
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full">
            <thead>
              <tr className={`${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50' 
                  : 'bg-gradient-to-r from-purple-100 to-indigo-100'
              }`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Peringkat</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Alternatif</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Skor</th>
              </tr>
            </thead>
            <tbody>
              {results.map((alt: Result, index: number) => (
                <tr 
                  key={alt.id} 
                  className={`border-b transition-colors duration-200 ${
                    darkMode 
                      ? `border-slate-700 ${index === 0 ? 'bg-yellow-900/20' : 'hover:bg-slate-700/50'}` 
                      : `border-gray-200 ${index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900 font-bold' :
                      index === 1 ? (darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-700') :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>{alt.name}</td>
                  <td className={`px-4 py-3 font-semibold ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {alt.score.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}