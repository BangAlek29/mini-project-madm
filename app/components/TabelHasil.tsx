import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Result, Alternative } from '../types';
import type { CalculationStep } from '../lib/madm/types';

interface TabelHasilProps {
  results: Result[] | null;
  methodName: string;
  darkMode: boolean;
  steps: CalculationStep[];
  alternatives: Alternative[];
}

export default function TabelHasil({ results, methodName, darkMode, steps, alternatives }: TabelHasilProps) {
  const [showResults, setShowResults] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  if (!results) return null;

  // Helper function to render matrix
  const renderMatrix = (matrix: number[][], headers?: string[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
            <th className={`px-3 py-2 text-left font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alternatif
            </th>
            {headers?.map((h, i) => (
              <th key={i} className={`px-3 py-2 text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <td className={`px-3 py-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {alternatives[i]?.name || `A${i + 1}`}
              </td>
              {row.map((val, j) => (
                <td key={j} className={`px-3 py-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {val.toFixed(4)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Helper function to render vector
  const renderVector = (vector: number[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
            <th className={`px-3 py-2 text-left font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alternatif
            </th>
            <th className={`px-3 py-2 text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nilai
            </th>
          </tr>
        </thead>
        <tbody>
          {vector.map((val, i) => (
            <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <td className={`px-3 py-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {alternatives[i]?.name || `A${i + 1}`}
              </td>
              <td className={`px-3 py-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {val.toFixed(6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Langkah-langkah Perhitungan */}
      {steps && steps.length > 0 && (
        <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white'
        }`}>
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => setShowSteps(!showSteps)}
          >
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Langkah-langkah Perhitungan {methodName}
            </h2>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {showSteps ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </span>
          </div>
          
          {showSteps && (
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-slate-700/30 border-slate-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      darkMode 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-yellow-400 text-gray-900'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${
                        darkMode ? 'text-yellow-400' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Formulas */}
                  {step.formulas && step.formulas.length > 0 && (
                    <div className={`mb-3 p-3 rounded-lg font-mono text-sm ${
                      darkMode 
                        ? 'bg-slate-900/50 text-yellow-300' 
                        : 'bg-white text-gray-800'
                    }`}>
                      {step.formulas.map((formula, i) => (
                        <div key={i} className="mb-1">
                          {formula}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matrix */}
                  {step.matrix && renderMatrix(step.matrix, step.headers)}

                  {/* Vector */}
                  {step.vector && renderVector(step.vector)}

                  {/* Custom Data */}
                  {step.data && !Array.isArray(step.data) && (
                    <div className="space-y-3">
                      {/* For TOPSIS ideal solutions */}
                      {step.data.positif && step.data.negatif && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                              Solusi Ideal Positif (A+)
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <tbody>
                                  {step.data.positif.map((item: any, i: number) => (
                                    <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                      <td className={`px-2 py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.kriteria}
                                      </td>
                                      <td className={`px-2 py-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.nilai}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                              Solusi Ideal Negatif (A-)
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <tbody>
                                  {step.data.negatif.map((item: any, i: number) => (
                                    <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                      <td className={`px-2 py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.kriteria}
                                      </td>
                                      <td className={`px-2 py-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.nilai}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* For TOPSIS distances */}
                      {step.data.dPlus && step.data.dMinus && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                              Jarak ke A+ (D+)
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <tbody>
                                  {step.data.dPlus.map((item: any, i: number) => (
                                    <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                      <td className={`px-2 py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.alternatif}
                                      </td>
                                      <td className={`px-2 py-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.jarak}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                              Jarak ke A- (D-)
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <tbody>
                                  {step.data.dMinus.map((item: any, i: number) => (
                                    <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                      <td className={`px-2 py-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {item.alternatif}
                                      </td>
                                      <td className={`px-2 py-1 text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {item.jarak}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Array data (for final ranking) */}
                  {Array.isArray(step.data) && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={darkMode ? 'bg-slate-700' : 'bg-gray-100'}>
                            {Object.keys(step.data[0] || {}).map((key) => (
                              <th key={key} className={`px-3 py-2 text-left font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {step.data.map((row: any, i: number) => (
                            <tr key={i} className={`border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                              {Object.values(row).map((val: any, j: number) => (
                                <td key={j} className={`px-3 py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Final Results Table */}
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
            Hasil Perhitungan - {methodName}
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
                    ? 'bg-gradient-to-r from-yellow-900/30 to-red-900/30' 
                    : 'bg-gradient-to-r from-yellow-100 to-red-100'
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
                        index === 2 ? 'bg-red-400 text-red-900' :
                        (darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>{alt.name}</td>
                    <td className={`px-4 py-3 font-semibold ${
                      darkMode ? 'text-yellow-400' : 'text-red-600'
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
    </>
  );
}
