import React from 'react';
import type { Criterion, Alternative } from '../types';

interface AHPPairwiseComparisonProps {
  criteria: Criterion[];
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
  darkMode: boolean;
}

export default function AHPPairwiseComparison({ 
  criteria, 
  alternatives, 
  setAlternatives, 
  darkMode 
}: AHPPairwiseComparisonProps) {

  // Update nilai perbandingan berpasangan
  const updatePairwiseValue = (critId: number, alt1Id: number, alt2Id: number, value: number) => {
    setAlternatives(alternatives.map((alt: Alternative) => {
      if (alt.id === alt1Id) {
        return {
          ...alt,
          values: {
            ...alt.values,
            [`${critId}_${alt2Id}`]: value,
            [`${critId}_${alt1Id}`]: 1 // diagonal = 1
          }
        };
      } else if (alt.id === alt2Id) {
        return {
          ...alt,
          values: {
            ...alt.values,
            [`${critId}_${alt1Id}`]: value > 0 ? 1 / value : 1,
            [`${critId}_${alt2Id}`]: 1 // diagonal = 1
          }
        };
      }
      return alt;
    }));
  };

  const getPairwiseValue = (critId: number, alt1Id: number, alt2Id: number): number => {
    const alt1 = alternatives.find(a => a.id === alt1Id);
    if (!alt1) return 1;
    const key = `${critId}_${alt2Id}`;
    const value = (alt1.values as any)[key];
    return value || 1;
  };

  // Skala perbandingan AHP
  const scaleOptions = [
    { value: 1, label: '1 - Sama penting dengan' },
    { value: 2, label: '2 - Mendekati sedikit lebih penting dari' },
    { value: 3, label: '3 - Sedikit lebih penting dari' },
    { value: 4, label: '4 - Mendekati lebih penting dari' },
    { value: 5, label: '5 - Lebih penting dari' },
    { value: 6, label: '6 - Mendekati sangat penting dari' },
    { value: 7, label: '7 - Sangat penting dari' },
    { value: 8, label: '8 - Mendekati mutlak dari' },
    { value: 9, label: '9 - Mutlak sangat penting dari' },
  ];

  if (criteria.length === 0 || alternatives.length === 0) {
    return (
      <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Perbandingan Berpasangan AHP
        </h2>
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Silakan tambahkan kriteria dan alternatif terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700' 
        : 'bg-white'
    }`}>
      <h2 className={`text-2xl font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Perbandingan Berpasangan AHP
      </h2>
      <p className={`text-sm mb-6 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Bandingkan setiap pasangan alternatif untuk setiap kriteria menggunakan skala 1-9
      </p>

      {/* Info Box */}
      <div className={`mb-6 p-4 rounded-xl border-2 ${
        darkMode 
          ? 'bg-blue-900/20 border-blue-700' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className={`font-semibold mb-3 ${
          darkMode ? 'text-blue-300' : 'text-blue-900'
        }`}>
          📌 Panduan Skala Perbandingan AHP:
        </h3>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${
            darkMode ? 'text-blue-200' : 'text-blue-800'
          }`}>
            <thead>
              <tr className={`border-b-2 ${
                darkMode ? 'border-blue-700' : 'border-blue-300'
              }`}>
                <th className="px-3 py-2 text-left font-semibold">Kode</th>
                <th className="px-3 py-2 text-left font-semibold">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">1</td>
                <td className="px-3 py-2">Sama penting dengan</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">2</td>
                <td className="px-3 py-2">Mendekati sedikit lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">3</td>
                <td className="px-3 py-2">Sedikit lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">4</td>
                <td className="px-3 py-2">Mendekati lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">5</td>
                <td className="px-3 py-2">Lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">6</td>
                <td className="px-3 py-2">Mendekati sangat penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">7</td>
                <td className="px-3 py-2">Sangat penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                <td className="px-3 py-2 font-semibold">8</td>
                <td className="px-3 py-2">Mendekati mutlak dari</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold">9</td>
                <td className="px-3 py-2">Mutlak sangat penting dari</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Perbandingan untuk setiap kriteria */}
      <div className="space-y-6">
        {criteria.map((criterion) => (
          <div 
            key={criterion.id}
            className={`p-5 rounded-xl border ${
              darkMode 
                ? 'bg-slate-700/30 border-slate-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 ${
              darkMode ? 'text-yellow-400' : 'text-gray-900'
            }`}>
              Kriteria: {criterion.name}
            </h3>

            {/* Tabel Perbandingan */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${
                    darkMode ? 'bg-slate-800' : 'bg-gray-100'
                  }`}>
                    <th className={`px-4 py-3 text-left text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Alternatif 1
                    </th>
                    <th className={`px-4 py-3 text-center text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tingkat Kepentingan
                    </th>
                    <th className={`px-4 py-3 text-right text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Alternatif 2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt1, i) => 
                    alternatives.slice(i + 1).map((alt2) => (
                      <tr 
                        key={`${alt1.id}-${alt2.id}`}
                        className={`border-b ${
                          darkMode 
                            ? 'border-slate-700 hover:bg-slate-800/50' 
                            : 'border-gray-200 hover:bg-white'
                        }`}
                      >
                        <td className={`px-4 py-3 text-left font-medium ${
                          darkMode ? 'text-yellow-400' : 'text-blue-600'
                        }`}>
                          {alt1.name}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={getPairwiseValue(criterion.id, alt1.id, alt2.id)}
                            onChange={(e) => updatePairwiseValue(
                              criterion.id, 
                              alt1.id, 
                              alt2.id, 
                              parseFloat(e.target.value)
                            )}
                            className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 text-sm ${
                              darkMode 
                                ? 'bg-slate-900 border-slate-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            {scaleOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${
                          darkMode ? 'text-yellow-400' : 'text-blue-600'
                        }`}>
                          {alt2.name}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
