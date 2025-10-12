import React, { useState, useEffect } from 'react';
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
  // State untuk main tab (Kriteria vs Alternatif)
  const [mainTab, setMainTab] = useState<'criteria' | 'alternatives'>('criteria');
  
  // State untuk tab aktif kriteria (untuk perbandingan alternatif)
  const [activeAlternativeTab, setActiveAlternativeTab] = useState<number>(0);
  
  // State untuk menyimpan perbandingan antar kriteria
  const [criteriaComparison, setCriteriaComparison] = useState<{[key: string]: number}>({});

  // Update nilai perbandingan antar kriteria
  const updateCriteriaComparison = (crit1Id: number, crit2Id: number, value: number) => {
    setCriteriaComparison(prev => ({
      ...prev,
      [`${crit1Id}_${crit2Id}`]: value,
      [`${crit1Id}_${crit1Id}`]: 1, // diagonal = 1
      [`${crit2Id}_${crit2Id}`]: 1, // diagonal = 1
      [`${crit2Id}_${crit1Id}`]: value > 0 ? 1 / value : 1
    }));
  };

  const getCriteriaComparisonValue = (crit1Id: number, crit2Id: number): number => {
    const key = `${crit1Id}_${crit2Id}`;
    return criteriaComparison[key] || 1;
  };

  // Update nilai perbandingan berpasangan alternatif
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

  // Fungsi untuk load template data
  const loadTemplateData = () => {
    if (criteria.length === 5 && alternatives.length === 3) {
      // Data perbandingan antar kriteria (C01-C05)
      const criteriaData: {[key: string]: number} = {
        // Diagonal
        '1_1': 1, '2_2': 1, '3_3': 1, '4_4': 1, '5_5': 1,
        // Upper triangle
        '1_2': 1, '1_3': 3, '1_4': 1, '1_5': 3,
        '2_3': 2, '2_4': 1, '2_5': 1,
        '3_4': 1, '3_5': 2,
        '4_5': 3,
        // Lower triangle (reciprocal)
        '2_1': 1, '3_1': 0.333, '4_1': 1, '5_1': 0.333,
        '3_2': 0.5, '4_2': 1, '5_2': 1,
        '4_3': 1, '5_3': 0.5,
        '5_4': 0.333,
      };

      setCriteriaComparison(criteriaData);

      // Data perbandingan alternatif untuk setiap kriteria (A01, A02, A03)
      // Format storage: dalam alt.values, key = `${critId}_${targetAltId}`
      // Data dari tabel: A01 (altId=1), A02 (altId=2), A03 (altId=3)
      
      // Kriteria C1 (critId=1)
      const c1Data: {[key: string]: number} = {
        '1_2': 3, '1_3': 3,      // A01 ke A02=3, A01 ke A03=3
        '2_1': 0.333, '2_3': 2,  // A02 ke A01=0.333, A02 ke A03=2
        '3_1': 0.333, '3_2': 0.5, // A03 ke A01=0.333, A03 ke A02=0.5
      };
      
      // Kriteria C2 (critId=2)
      const c2Data: {[key: string]: number} = {
        '1_2': 2, '1_3': 4,
        '2_1': 0.5, '2_3': 3,
        '3_1': 0.25, '3_2': 0.333,
      };
      
      // Kriteria C3 (critId=3)
      const c3Data: {[key: string]: number} = {
        '1_2': 2, '1_3': 1,
        '2_1': 0.5, '2_3': 2,
        '3_1': 1, '3_2': 0.5,
      };
      
      // Kriteria C4 (critId=4)
      const c4Data: {[key: string]: number} = {
        '1_2': 2, '1_3': 3,
        '2_1': 0.5, '2_3': 6,
        '3_1': 0.333, '3_2': 0.167,
      };
      
      // Kriteria C5 (critId=5)
      const c5Data: {[key: string]: number} = {
        '1_2': 4, '1_3': 3,
        '2_1': 0.25, '2_3': 2,
        '3_1': 0.333, '3_2': 0.5,
      };

      // Update alternatives dengan nilai perbandingan
      setAlternatives(alternatives.map((alt: Alternative) => {
        const newValues: any = { ...alt.values };
        
        // Untuk setiap kriteria, set nilai perbandingan
        const dataByKriteria: {[key: string]: {[key: string]: number}} = {
          '1': c1Data,
          '2': c2Data,
          '3': c3Data,
          '4': c4Data,
          '5': c5Data,
        };
        
        criteria.forEach((crit) => {
          const critData = dataByKriteria[crit.id.toString()];
          if (critData) {
            alternatives.forEach((alt2) => {
              const key = `${alt.id}_${alt2.id}`;
              if (critData[key] !== undefined) {
                newValues[`${crit.id}_${alt2.id}`] = critData[key];
              }
            });
          }
          // Set diagonal = 1
          newValues[`${crit.id}_${alt.id}`] = 1;
        });
        
        return {
          ...alt,
          values: newValues
        };
      }));
    }
  };

  // Auto-fill data template AHP saat komponen dimuat
  useEffect(() => {
    loadTemplateData();
  }, [criteria.length, alternatives.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="flex items-center justify-between mb-6">
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Bandingkan setiap pasangan alternatif untuk setiap kriteria menggunakan skala 1-9
        </p>
      </div>

      {/* Info Box */}
      <div className={`mb-6 p-4 rounded-xl border-2 ${
        darkMode 
          ? 'bg-yellow-900/20 border-yellow-700' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h3 className={`font-semibold mb-3 ${
          darkMode ? 'text-yellow-300' : 'text-yellow-900'
        }`}>
          Panduan Skala Perbandingan AHP:
        </h3>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${
            darkMode ? 'text-yellow-200' : 'text-yellow-800'
          }`}>
            <thead>
              <tr className={`border-b-2 ${
                darkMode ? 'border-yellow-700' : 'border-yellow-300'
              }`}>
                <th className="px-3 py-2 text-left font-semibold">Kode</th>
                <th className="px-3 py-2 text-left font-semibold">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">1</td>
                <td className="px-3 py-2">Sama penting dengan</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">2</td>
                <td className="px-3 py-2">Mendekati sedikit lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">3</td>
                <td className="px-3 py-2">Sedikit lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">4</td>
                <td className="px-3 py-2">Mendekati lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">5</td>
                <td className="px-3 py-2">Lebih penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">6</td>
                <td className="px-3 py-2">Mendekati sangat penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
                <td className="px-3 py-2 font-semibold">7</td>
                <td className="px-3 py-2">Sangat penting dari</td>
              </tr>
              <tr className={`border-b ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`}>
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

      {/* Main Tab Navigation (Kriteria vs Alternatif) */}
      <div className="mb-6">
        <div className={`flex gap-3 p-1.5 rounded-xl ${
          darkMode ? 'bg-slate-900/50' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setMainTab('criteria')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold text-base transition-all duration-200 ${
              mainTab === 'criteria'
                ? darkMode
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-xl scale-105'
                  : 'bg-gradient-to-r from-yellow-400 to-red-400 text-white shadow-xl scale-105'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            Perbandingan Kriteria
          </button>
          <button
            onClick={() => setMainTab('alternatives')}
            className={`flex-1 px-6 py-4 rounded-lg font-bold text-base transition-all duration-200 ${
              mainTab === 'alternatives'
                ? darkMode
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-xl scale-105'
                  : 'bg-gradient-to-r from-yellow-400 to-red-400 text-white shadow-xl scale-105'
                : darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            Perbandingan Alternatif
          </button>
        </div>
      </div>

      {/* Content: Perbandingan Kriteria */}
      {mainTab === 'criteria' && (
        <div 
          className={`p-5 rounded-xl border ${
            darkMode 
              ? 'bg-slate-700/30 border-slate-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-yellow-400' : 'text-gray-900'
          }`}>
            <span className={`px-3 py-1 rounded-lg text-sm ${
              darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}>
              Bobot Prioritas
            </span>
            Perbandingan Antar Kriteria
          </h3>

          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Bandingkan setiap pasangan kriteria untuk menentukan bobot prioritas
          </p>

          {/* Tabel Perbandingan Kriteria */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${
                  darkMode ? 'bg-slate-800' : 'bg-gray-100'
                }`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Kriteria 1
                  </th>
                  <th className={`px-4 py-3 text-center text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tingkat Kepentingan
                  </th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Kriteria 2
                  </th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((crit1, i) => 
                  criteria.slice(i + 1).map((crit2) => (
                    <tr 
                      key={`${crit1.id}-${crit2.id}`}
                      className={`border-b ${
                        darkMode 
                          ? 'border-slate-700 hover:bg-slate-800/50' 
                          : 'border-gray-200 hover:bg-white'
                      }`}
                    >
                      <td className={`px-4 py-3 text-left font-medium ${
                        darkMode ? 'text-yellow-400' : 'text-red-600'
                      }`}>
                        {crit1.name}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={getCriteriaComparisonValue(crit1.id, crit2.id)}
                          onChange={(e) => updateCriteriaComparison(
                            crit1.id, 
                            crit2.id, 
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
                        darkMode ? 'text-yellow-400' : 'text-red-600'
                      }`}>
                        {crit2.name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content: Perbandingan Alternatif */}
      {mainTab === 'alternatives' && (
        <>
          {/* Tab Navigation untuk Kriteria */}
          <div className="mb-6">
            <div className={`flex gap-2 p-1 rounded-xl ${
              darkMode ? 'bg-slate-900/50' : 'bg-gray-100'
            } overflow-x-auto`}>
              {criteria.map((criterion, index) => (
                <button
                  key={criterion.id}
                  onClick={() => setActiveAlternativeTab(index)}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                    activeAlternativeTab === index
                      ? darkMode
                        ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-yellow-400 to-red-400 text-white shadow-lg scale-105'
                      : darkMode
                        ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {criterion.name}
                </button>
              ))}
            </div>
          </div>

      {/* Konten Tab - Perbandingan untuk kriteria aktif */}
      {criteria[activeAlternativeTab] && (
        <div 
          className={`p-5 rounded-xl border ${
            darkMode 
              ? 'bg-slate-700/30 border-slate-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-yellow-400' : 'text-gray-900'
          }`}>
            <span className={`px-3 py-1 rounded-lg text-sm ${
              darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}>
              {criteria[activeAlternativeTab].name}
            </span>
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
                        darkMode ? 'text-yellow-400' : 'text-red-600'
                      }`}>
                        {alt1.name}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={getPairwiseValue(criteria[activeAlternativeTab].id, alt1.id, alt2.id)}
                          onChange={(e) => updatePairwiseValue(
                            criteria[activeAlternativeTab].id, 
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
                        darkMode ? 'text-yellow-400' : 'text-red-600'
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
      )}
        </>
      )}
    </div>
  );
}
