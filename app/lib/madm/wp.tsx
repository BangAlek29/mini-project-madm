import { Criterion, Alternative, Result, CalculationResult, CalculationStep } from "./types";
import { sortResult } from "./utils";

export function calculateWP(alternatives: Alternative[], criteria: Criterion[]): CalculationResult {
  const steps: CalculationStep[] = [];

  // Step 1: Matriks Keputusan
  const matrix = alternatives.map(alt =>
    criteria.map(c => alt.values[c.id] || 0)
  );

  steps.push({
    title: "Step 1: Matriks Keputusan",
    description: "Membentuk matriks keputusan awal dari nilai setiap alternatif terhadap kriteria",
    matrix: matrix,
    headers: criteria.map(c => c.name)
  });

  // Step 2: Perhitungan Vektor S
  const scores = alternatives.map(alt => {
    let product = 1;
    criteria.forEach(c => {
      const val = alt.values[c.id] || 0.0001;
      if (c.type === "benefit") {
        product *= Math.pow(val, c.weight);
      } else {
        product *= Math.pow(1 / val, c.weight);
      }
    });
    return product;
  });

  steps.push({
    title: "Step 2: Perhitungan Vektor S",
    description: "Menghitung nilai S untuk setiap alternatif dengan rumus perkalian perpangkatan",
    vector: scores,
    formulas: [
      `Si = Π(Xij^wj) untuk benefit`,
      `Si = Π((1/Xij)^wj) untuk cost`,
      `Bobot: ${criteria.map(c => `${c.name}=${c.weight}`).join(', ')}`
    ]
  });

  // Step 3: Normalisasi Vektor V
  const total = scores.reduce((a, b) => a + b, 0);
  const normalizedScores = scores.map(s => s / total);

  steps.push({
    title: "Step 3: Perhitungan Vektor V (Normalisasi)",
    description: "Normalisasi nilai S dengan membagi terhadap total semua nilai S",
    vector: normalizedScores,
    formulas: [
      `Vi = Si / Σ(Si)`,
      `Total S = ${total.toFixed(6)}`
    ]
  });

  const results = sortResult(alternatives, normalizedScores);

  steps.push({
    title: "Step 4: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan nilai V tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
