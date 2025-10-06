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

interface InputAlternatifProps {
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
  criteria: Criterion[];
}

export default function InputAlternatif({ alternatives, setAlternatives, criteria }: InputAlternatifProps) {
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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Alternatif</h2>
        <button
          onClick={addAlternative}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={20} />
          Tambah Alternatif
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Alternatif</th>
              {criteria.map((crit: Criterion) => (
                <th key={crit.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {crit.name}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt: Alternative) => (
              <tr key={alt.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={alt.name}
                    onChange={(e) => updateAlternative(alt.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </td>
                {criteria.map((crit: Criterion) => (
                  <td key={crit.id} className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={alt.values[crit.id]}
                      onChange={(e) => updateAlternativeValue(alt.id, crit.id, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    onClick={() => removeAlternative(alt.id)}
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
    </div>
  );
}