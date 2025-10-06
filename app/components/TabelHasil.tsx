import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Result {
  id: number;
  name: string;
  score: number;
}

interface TabelHasilProps {
  results: Result[] | null;
  methodName: string;
}

export default function TabelHasil({ results, methodName }: TabelHasilProps) {
  const [showResults, setShowResults] = useState(true);

  if (!results) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setShowResults(!showResults)}
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Hasil Perhitungan - {methodName}
        </h2>
        {showResults ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {showResults && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-indigo-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Peringkat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alternatif</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Skor</th>
              </tr>
            </thead>
            <tbody>
              {results.map((alt: Result, index: number) => (
                <tr 
                  key={alt.id} 
                  className={`border-b ${index === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900 font-bold' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-300 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{alt.name}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">
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