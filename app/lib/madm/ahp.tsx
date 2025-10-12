import { Criterion, Alternative, Result, CalculationResult, CalculationStep } from "./types";
import { sortResult } from "./utils";

// Catatan: ini AHP sederhana, pakai bobot langsung, tanpa perbandingan berpasangan
export function calculateAHP(alternatives: Alternative[], criteria: Criterion[]): CalculationResult {
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

  // Step 2: Normalisasi Kolom
  const colSums = criteria.map((_, j) =>
    matrix.reduce((sum, row) => sum + row[j], 0)
  );

  const normalized = matrix.map(row =>
    row.map((val, j) => (colSums[j] ? val / colSums[j] : 0))
  );

  steps.push({
    title: "Step 2: Normalisasi Matriks per Kolom",
    description: "Normalisasi setiap elemen dengan membagi nilai total kolom",
    matrix: normalized,
    headers: criteria.map(c => c.name),
    formulas: criteria.map((c, j) => `${c.name}: Total = ${colSums[j].toFixed(2)}, rij = xij / total`)
  });

  // Step 3: Perhitungan Skor (Weighted Sum)
  const scores = normalized.map(row =>
    row.reduce((sum, val, j) => sum + val * criteria[j].weight, 0)
  );

  steps.push({
    title: "Step 3: Perhitungan Nilai Prioritas",
    description: "Mengalikan matriks ternormalisasi dengan bobot kriteria (catatan: AHP ini disederhanakan)",
    vector: scores,
    formulas: [
      `Pi = Σ(wj × rij)`,
      `Bobot: ${criteria.map(c => `${c.name}=${c.weight}`).join(', ')}`
    ]
  });

  const results = sortResult(alternatives, scores);

  steps.push({
    title: "Step 4: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan nilai prioritas tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
