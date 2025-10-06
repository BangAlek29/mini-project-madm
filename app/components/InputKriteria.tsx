import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Criterion, Alternative } from '../types';

interface InputKriteriaProps {
  criteria: Criterion[];
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
  selectedMethod: string;
  darkMode: boolean;
}

export default function InputKriteria({ criteria, setCriteria, alternatives, setAlternatives, selectedMethod, darkMode }: InputKriteriaProps) {
  const addCriterion = () => {
    const newId = Math.max(...criteria.map((c: Criterion) => c.id), 0) + 1;
    setCriteria([...criteria, { id: newId, name: `Kriteria ${newId}`, weight: 0, type: 'benefit' }]);
    setAlternatives(alternatives.map((alt: Alternative) => ({
      ...alt,
      values: { ...alt.values, [newId]: 0 }
    })));
  };

  const removeCriterion = (id: number) => {
    if (criteria.length <= 1) {
      alert('Minimal harus ada 1 kriteria!');
      return;
    }
    setCriteria(criteria.filter((c: Criterion) => c.id !== id));
    setAlternatives(alternatives.map((alt: Alternative) => {
      const newValues = { ...alt.values };
      delete newValues[id];
      return { ...alt, values: newValues };
    }));
  };

  const updateCriterion = (id: number, field: string, value: string) => {
    setCriteria(criteria.map((c: Criterion) => 
      c.id === id ? { ...c, [field]: field === 'weight' ? parseFloat(value) || 0 : value } : c
    ));
  };

  const totalWeight = criteria.reduce((sum: number, c: Criterion) => sum + c.weight, 0);
  const isValidWeight = Math.abs(totalWeight - 1) < 0.01;
  const isAHP = selectedMethod === 'AHP';

  return (
    <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700' 
        : 'bg-white'
    }`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Kriteria
          </h2>
        </div>
        <button
          onClick={addCriterion}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium border-2 ${
            darkMode 
              ? 'border-slate-600 hover:border-slate-500 text-gray-200 hover:bg-slate-700/50' 
              : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Plus size={20} />
          Tambah Kriteria
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
              }`}>Nama Kriteria</th>
              {!isAHP && <th className={`px-4 py-3 text-left text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Bobot</th>}
              <th className={`px-4 py-3 text-left text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Tipe</th>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((crit: Criterion) => (
              <tr key={crit.id} className={`border-b transition-colors duration-200 ${
                darkMode 
                  ? 'border-slate-700 hover:bg-slate-700/50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={crit.name}
                    onChange={(e) => updateCriterion(crit.id, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </td>
                {!isAHP && (
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={crit.weight}
                      onChange={(e) => updateCriterion(crit.id, 'weight', e.target.value)}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300 ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-600 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <select
                    value={crit.type}
                    onChange={(e) => updateCriterion(crit.id, 'type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeCriterion(crit.id)}
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
      {!isAHP && (
        <div className={`mt-3 text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Total Bobot: <span className={`font-semibold ${isValidWeight ? 'text-green-500' : 'text-red-500'}`}>
            {totalWeight.toFixed(2)}
          </span> (harus = 1.0)
        </div>
      )}
    </div>
  );
}