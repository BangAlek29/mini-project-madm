import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Criterion {
  id: number;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

interface Alternative {
  id: number;
  name: string;
  values: { [key: number]: number };
}

interface InputKriteriaProps {
  criteria: Criterion[];
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
}

export default function InputKriteria({ criteria, setCriteria, alternatives, setAlternatives }: InputKriteriaProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Kriteria</h2>
        <button
          onClick={addCriterion}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={20} />
          Tambah Kriteria
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Kriteria</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bobot</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipe</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((crit: Criterion) => (
              <tr key={crit.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={crit.name}
                    onChange={(e) => updateCriterion(crit.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    value={crit.weight}
                    onChange={(e) => updateCriterion(crit.id, 'weight', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={crit.type}
                    onChange={(e) => updateCriterion(crit.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeCriterion(crit.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        Total Bobot: <span className={`font-semibold ${isValidWeight ? 'text-green-600' : 'text-red-600'}`}>
          {totalWeight.toFixed(2)}
        </span> (harus = 1.0)
      </div>
    </div>
  );
}