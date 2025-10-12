import React from 'react';
import type { Criterion, Alternative } from '../types';

interface PilihMetodeProps {
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
  onCalculate: () => void;
  darkMode: boolean;
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
}

export default function PilihMetode({ selectedMethod, setSelectedMethod, darkMode, setCriteria, setAlternatives }: PilihMetodeProps) {
  const methodDescriptions: { [key: string]: string } = {
    SAW: 'Metode sederhana dengan normalisasi nilai dan pembobotan langsung',
    WP: 'Menggunakan perkalian untuk menghubungkan rating atribut',
    AHP: 'Menggunakan perbandingan berpasangan untuk menentukan prioritas (bobot otomatis)',
    TOPSIS: 'Memilih alternatif terbaik berdasarkan jarak dari solusi ideal',
  };

  // Template data untuk setiap metode
  const templates: { [key: string]: { criteria: Criterion[], alternatives: Alternative[] } } = {
    SAW: {
      criteria: [
        { id: 1, name: 'Harga', weight: 0.35, type: 'cost' },
        { id: 2, name: 'Kualitas', weight: 0.30, type: 'benefit' },
        { id: 3, name: 'Durabilitas', weight: 0.20, type: 'benefit' },
        { id: 4, name: 'Desain', weight: 0.15, type: 'benefit' },
      ],
      alternatives: [
        { id: 1, name: 'Laptop A', values: { 1: 8000000, 2: 85, 3: 90, 4: 80 } },
        { id: 2, name: 'Laptop B', values: { 1: 12000000, 2: 90, 3: 85, 4: 90 } },
        { id: 3, name: 'Laptop C', values: { 1: 10000000, 2: 80, 3: 95, 4: 85 } },
        { id: 4, name: 'Laptop D', values: { 1: 9000000, 2: 88, 3: 88, 4: 92 } },
      ]
    },
    WP: {
      criteria: [
        { id: 1, name: 'Harga', weight: 0.30, type: 'cost' },
        { id: 2, name: 'Kecepatan', weight: 0.25, type: 'benefit' },
        { id: 3, name: 'Kapasitas', weight: 0.25, type: 'benefit' },
        { id: 4, name: 'Efisiensi', weight: 0.20, type: 'benefit' },
      ],
      alternatives: [
        { id: 1, name: 'Smartphone A', values: { 1: 5000000, 2: 80, 3: 128, 4: 85 } },
        { id: 2, name: 'Smartphone B', values: { 1: 7000000, 2: 90, 3: 256, 4: 90 } },
        { id: 3, name: 'Smartphone C', values: { 1: 6000000, 2: 85, 3: 128, 4: 88 } },
        { id: 4, name: 'Smartphone D', values: { 1: 8000000, 2: 95, 3: 512, 4: 92 } },
      ]
    },
    AHP: {
      criteria: [
        { id: 1, name: 'Lokasi', weight: 0, type: 'benefit' },
        { id: 2, name: 'Harga Sewa', weight: 0, type: 'cost' },
        { id: 3, name: 'Fasilitas', weight: 0, type: 'benefit' },
        { id: 4, name: 'Keamanan', weight: 0, type: 'benefit' },
      ],
      alternatives: [
        { id: 1, name: 'Rumah A', values: { 1: 90, 2: 15000000, 3: 85, 4: 88 } },
        { id: 2, name: 'Rumah B', values: { 1: 85, 2: 12000000, 3: 90, 4: 92 } },
        { id: 3, name: 'Rumah C', values: { 1: 88, 2: 18000000, 3: 95, 4: 85 } },
        { id: 4, name: 'Rumah D', values: { 1: 92, 2: 20000000, 3: 88, 4: 90 } },
      ]
    },
    TOPSIS: {
      criteria: [
        { id: 1, name: 'Gaji', weight: 0.40, type: 'benefit' },
        { id: 2, name: 'Jarak', weight: 0.20, type: 'cost' },
        { id: 3, name: 'Fasilitas', weight: 0.25, type: 'benefit' },
        { id: 4, name: 'Karir', weight: 0.15, type: 'benefit' },
      ],
      alternatives: [
        { id: 1, name: 'Perusahaan A', values: { 1: 8000000, 2: 15, 3: 85, 4: 80 } },
        { id: 2, name: 'Perusahaan B', values: { 1: 10000000, 2: 25, 3: 90, 4: 90 } },
        { id: 3, name: 'Perusahaan C', values: { 1: 9000000, 2: 10, 3: 80, 4: 85 } },
        { id: 4, name: 'Perusahaan D', values: { 1: 12000000, 2: 30, 3: 95, 4: 92 } },
      ]
    }
  };

  const loadTemplate = () => {
    const template = templates[selectedMethod];
    if (template) {
      setCriteria(template.criteria);
      setAlternatives(template.alternatives);
    }
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
          className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-yellow-500 text-lg font-medium transition-colors duration-300 ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-white focus:border-yellow-500' 
              : 'bg-white border-yellow-200 text-gray-900 focus:border-yellow-500'
          }`}
        >
          <option value="SAW">SAW - Simple Additive Weighting</option>
          <option value="WP">WP - Weighted Product</option>
          <option value="AHP">AHP - Analytical Hierarchy Process</option>
          <option value="TOPSIS">TOPSIS - Technique for Order Preference by Similarity</option>
        </select>

        {/* Template Button Section */}
        <div className={`p-4 rounded-xl border-2 ${
          darkMode 
            ? 'bg-slate-700/50 border-slate-600' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Gunakan Template Data
              </h3>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Isi otomatis dengan contoh data untuk metode {selectedMethod}
              </p>
            </div>
            <button
              onClick={loadTemplate}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium border-2 whitespace-nowrap ${
                darkMode 
                  ? 'bg-slate-800 border-slate-500 hover:border-slate-400 text-gray-200 hover:bg-slate-700' 
                  : 'bg-white border-yellow-300 hover:border-yellow-400 text-gray-800 hover:bg-yellow-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              Gunakan Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


