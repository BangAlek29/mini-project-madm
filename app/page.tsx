"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import InputKriteria from "./components/InputKriteria";
import InputAlternatif from "./components/InputAlternatif";
import PilihMetode from "./components/PilihMetode";
import TabelHasil from "./components/TabelHasil";
import AHPPairwiseComparison from "./components/AHPPairwiseComparison";
import type { Criterion, Alternative, Result } from "./types";
import type { CalculationStep } from "./lib/madm/types";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 1, name: "Harga", weight: 0.3, type: "cost" },
  ]);

  const [alternatives, setAlternatives] = useState<Alternative[]>([
    { id: 1, name: "Alternatif 1", values: { 1: 0 } },
  ]);

  const [selectedMethod, setSelectedMethod] = useState<string>("SAW");
  const [results, setResults] = useState<Result[] | null>(null);
  const [steps, setSteps] = useState<CalculationStep[]>([]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCalculate = async () => {
    if (selectedMethod !== "AHP") {
      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
      if (Math.abs(totalWeight - 1) > 0.01) {
        alert("Total bobot kriteria harus sama dengan 1.0!");
        return;
      }
    }

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod,
          criteria,
          alternatives,
        }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResults(data.result);
        setSteps(data.steps || []);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat menghitung");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-8 mt-4">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Multi-Attribute Decision Making
          </h2>
        </div>

        {/* Pilih metode */}
        <PilihMetode
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          onCalculate={handleCalculate}
          darkMode={darkMode}
          setCriteria={setCriteria}
          setAlternatives={setAlternatives}
        />

        {/* Input kriteria */}
        <InputKriteria
          criteria={criteria}
          setCriteria={setCriteria}
          alternatives={alternatives}
          setAlternatives={setAlternatives}
          selectedMethod={selectedMethod}
          darkMode={darkMode}
        />

        {/* Input alternatif */}
        <InputAlternatif
          alternatives={alternatives}
          setAlternatives={setAlternatives}
          criteria={criteria}
          darkMode={darkMode}
          selectedMethod={selectedMethod}
        />

        {/* AHP Pairwise Comparison - hanya tampil jika metode AHP */}
        {selectedMethod === 'AHP' && (
          <AHPPairwiseComparison
            criteria={criteria}
            alternatives={alternatives}
            setAlternatives={setAlternatives}
            darkMode={darkMode}
          />
        )}

        {/* Tombol Hitung */}
        <div className={`rounded-2xl shadow-xl p-6 mb-6 transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white'
        }`}>
          <button
            onClick={handleCalculate}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 font-bold text-lg md:text-xl border-2 ${
              darkMode 
                ? 'border-slate-600 hover:border-slate-500 text-gray-200 hover:bg-slate-700/50' 
                : 'border-yellow-300 hover:border-yellow-400 text-black-600 hover:bg-yellow-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="8" y1="6" x2="16" y2="6"/>
              <line x1="16" y1="14" x2="16" y2="18"/>
              <path d="M16 10h.01"/>
              <path d="M12 10h.01"/>
              <path d="M8 10h.01"/>
              <path d="M12 14h.01"/>
              <path d="M8 14h.01"/>
              <path d="M8 18h.01"/>
            </svg>
            Hitung Hasil
          </button>
        </div>

        {/* Hasil */}
        <TabelHasil 
          results={results} 
          methodName={selectedMethod} 
          darkMode={darkMode}
          steps={steps}
          alternatives={alternatives}
        />
      </div>
    </div>
  );
}
