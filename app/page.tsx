import React, { useState } from 'react';
import InputKriteria from './components/InputKriteria';
import InputAlternatif from './components/InputAlternatif';
import PilihMetode from './components/PilihMetode';
import TabelHasil from './components/TabelHasil';
import { DSSAlgorithms } from './utils/dssAlgorithms';

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

interface Result {
  id: number;
  name: string;
  score: number;
}

export default function HomePage() {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 1, name: 'Harga', weight: 0.3, type: 'cost' }
  ]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: 1, name: 'Alternatif 1', values: { 1: 0 } }
  ]);
  const [selectedMethod, setSelectedMethod] = useState<string>('SAW');
  const [results, setResults] = useState<Result[] | null>(null);

  const handleCalculate = () => {
    const totalWeight = criteria.reduce((sum: number, c: Criterion) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      alert('Total bobot kriteria harus sama dengan 1.0!');
      return;
    }

    let result: Result[];
    switch (selectedMethod) {
      case 'SAW':
        result = DSSAlgorithms.calculateSAW(alternatives, criteria);
        break;
      case 'WP':
        result = DSSAlgorithms.calculateWP(alternatives, criteria);
        break;
      case 'AHP':
        result = DSSAlgorithms.calculateAHP(alternatives, criteria);
        break;
      case 'TOPSIS':
        result = DSSAlgorithms.calculateTOPSIS(alternatives, criteria);
        break;
      default:
        result = [];
    }

    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            Decision Support System
          </h1>
          <p className="text-gray-600 mb-4">Multi-Attribute Decision Making (MADM)</p>
          <div className="h-1 w-32 bg-indigo-600 rounded"></div>
        </div>

        <InputKriteria 
          criteria={criteria}
          setCriteria={setCriteria}
          alternatives={alternatives}
          setAlternatives={setAlternatives}
        />

        <InputAlternatif 
          alternatives={alternatives}
          setAlternatives={setAlternatives}
          criteria={criteria}
        />

        <PilihMetode 
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          onCalculate={handleCalculate}
        />

        <TabelHasil 
          results={results}
          methodName={selectedMethod}
        />
      </div>
    </div>
  );
}