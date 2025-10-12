import { Criterion, Alternative, Result, CalculationResult, CalculationStep } from "./types";
import { sortResult } from "./utils";

export function calculateSAW(alternatives: Alternative[], criteria: Criterion[]): CalculationResult {
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

  // Step 2: Normalisasi
  const normalized = matrix.map(row => [...row]);

  criteria.forEach((c, j) => {
    const col = matrix.map(row => row[j]);
    if (c.type === "benefit") {
      const max = Math.max(...col);
      normalized.forEach((row, i) => row[j] = col[i] / max);
    } else {
      const min = Math.min(...col);
      normalized.forEach((row, i) => row[j] = min / col[i]);
    }
  });

  steps.push({
    title: "Step 2: Normalisasi Matriks",
    description: "Normalisasi menggunakan rumus: Benefit = Xij/Max(Xij), Cost = Min(Xij)/Xij",
    matrix: normalized,
    headers: criteria.map(c => c.name),
    formulas: criteria.map(c => 
      c.type === "benefit" 
        ? `${c.name}: rij = xij / max(xij)` 
        : `${c.name}: rij = min(xij) / xij`
    )
  });

  // Step 3: Perhitungan Skor
  const scores = normalized.map(row =>
    row.reduce((sum, val, j) => sum + val * criteria[j].weight, 0)
  );

  steps.push({
    title: "Step 3: Perhitungan Nilai Preferensi",
    description: "Mengalikan matriks ternormalisasi dengan bobot dan menjumlahkannya",
    vector: scores,
    formulas: [`Vi = Σ(wj × rij)`, `Bobot: ${criteria.map(c => `${c.name}=${c.weight}`).join(', ')}`]
  });

  const results = sortResult(alternatives, scores);

  steps.push({
    title: "Step 4: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan nilai preferensi tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
