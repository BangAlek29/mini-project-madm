import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Criterion, Alternative } from '../types';

interface InputAlternatifProps {
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
  criteria: Criterion[];
  darkMode: boolean;
}

export default function InputAlternatif({ alternatives, setAlternatives, criteria, darkMode }: InputAlternatifProps) {
  const addAlternative = () => {
    const newId = Math.max(...alternatives.map((a: Alternative) => a.id), 0) + 1;
    const values: { [key: number]: number } = {};
    criteria.forEach((c: Criterion) => values[c.id] = 0);
    setAlternatives([...alternatives, { id: newId, name: `Alternatif ${newId}`, values }]);
  };

  const removeAlternative = (id: number) => {
    if (alternatives.length <= 1) {
      alert('Minimal harus ada 1 alternatif!');
      return;
    }
    setAlternatives(alternatives.filter((a: Alternative) => a.id !== id));
  };

  const updateAlternative = (id: number, field: string, value: string) => {
    setAlternatives(alternatives.map((a: Alternative) => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const updateAlternativeValue = (altId: number, critId: number, value: string) => {
    setAlternatives(alternatives.map((a: Alternative) => 
      a.id === altId ? { ...a, values: { ...a.values, [critId]: parseFloat(value) || 0 } } : a
    ));
  };

  return (
    <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700' 
        : 'bg-white'
    }`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Alternatif
        </h2>
        <button
          onClick={addAlternative}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium border-2 ${
            darkMode 
              ? 'border-slate-600 hover:border-slate-500 text-gray-200 hover:bg-slate-700/50' 
              : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Plus size={20} />
          Tambah Alternatif
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={`${
              darkMode ? 'bg-slate-700' : 'bg-gray-50'
            }`}>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Nama Alternatif</th>
              {criteria.map((crit: Criterion) => (
                <th key={crit.id} className={`px-4 py-3 text-left text-sm font-semibold ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {crit.name}
                </th>
              ))}
              <th className={`px-4 py-3 text-left text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt: Alternative) => (
              <tr key={alt.id} className={`border-b transition-colors duration-200 ${
                darkMode 
                  ? 'border-slate-700 hover:bg-slate-700/50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={alt.name}
                    onChange={(e) => updateAlternative(alt.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </td>
                {criteria.map((crit: Criterion) => (
                  <td key={crit.id} className="px-4 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={alt.values[crit.id] || ''}
                      onChange={(e) => updateAlternativeValue(alt.id, crit.id, e.target.value)}
                      placeholder="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeAlternative(alt.id)}
                    className={`transition-colors duration-200 ${
                      darkMode 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}