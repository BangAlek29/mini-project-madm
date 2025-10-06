import React from 'react';
import { Calculator } from 'lucide-react';

interface PilihMetodeProps {
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
  onCalculate: () => void;
}

export default function PilihMetode({ selectedMethod, setSelectedMethod, onCalculate }: PilihMetodeProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Pilih Metode & Hitung</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        >
          <option value="SAW">Simple Additive Weighting (SAW)</option>
          <option value="WP">Weighted Product (WP)</option>
          <option value="AHP">Analytical Hierarchy Process (AHP)</option>
          <option value="TOPSIS">TOPSIS</option>
        </select>
        <button
          onClick={onCalculate}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
        >
          <Calculator size={24} />
          Hitung
        </button>
      </div>
    </div>
  );
}

