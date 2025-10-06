import React from 'react';

interface PilihMetodeProps {
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
  onCalculate: () => void;
  darkMode: boolean;
}

export default function PilihMetode({ selectedMethod, setSelectedMethod, darkMode }: PilihMetodeProps) {
  const methodDescriptions: { [key: string]: string } = {
    SAW: 'Metode sederhana dengan normalisasi nilai dan pembobotan langsung',
    WP: 'Menggunakan perkalian untuk menghubungkan rating atribut',
    AHP: 'Menggunakan perbandingan berpasangan untuk menentukan prioritas (bobot otomatis)',
    TOPSIS: 'Memilih alternatif terbaik berdasarkan jarak dari solusi ideal',
  };

  return (
    <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-800 border border-slate-700' 
        : 'bg-white'
    }`}>
      <h2 className={`text-2xl font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Pilih Metode Decision Making
      </h2>
      <p className={`text-sm mb-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Pilih metode yang akan digunakan untuk perhitungan
      </p>
      
      <div className="flex flex-col gap-4">
        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 text-lg font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500' 
              : 'bg-white border-purple-200 text-gray-900 focus:border-purple-500'
          }`}
        >
          <option value="SAW">SAW - Simple Additive Weighting</option>
          <option value="WP">WP - Weighted Product</option>
          <option value="AHP">AHP - Analytical Hierarchy Process</option>
          <option value="TOPSIS">TOPSIS - Technique for Order Preference by Similarity</option>
        </select>
      </div>
    </div>
  );
}

