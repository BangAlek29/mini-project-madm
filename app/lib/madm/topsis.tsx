import { Criterion, Alternative, Result, CalculationResult, CalculationStep } from "./types";
import { sortResult } from "./utils";

export function calculateTOPSIS(alternatives: Alternative[], criteria: Criterion[]): CalculationResult {
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
  const normDenom = criteria.map((_, j) =>
    Math.sqrt(matrix.reduce((sum, row) => sum + row[j] ** 2, 0))
  );

  const normalized = matrix.map(row =>
    row.map((val, j) => (normDenom[j] ? val / normDenom[j] : 0))
  );

  steps.push({
    title: "Step 2: Normalisasi Matriks",
    description: "Normalisasi menggunakan metode euclidean: rij = xij / √(Σxij²)",
    matrix: normalized,
    headers: criteria.map(c => c.name),
    formulas: criteria.map((c, j) => `${c.name}: √(Σxij²) = ${normDenom[j].toFixed(4)}`)
  });

  // Step 3: Matriks Ternormalisasi Terbobot
  const weighted = normalized.map(row =>
    row.map((val, j) => val * criteria[j].weight)
  );

  steps.push({
    title: "Step 3: Matriks Ternormalisasi Terbobot",
    description: "Mengalikan matriks ternormalisasi dengan bobot kriteria: yij = rij × wj",
    matrix: weighted,
    headers: criteria.map(c => c.name),
    formulas: [`Bobot: ${criteria.map(c => `${c.name}=${c.weight}`).join(', ')}`]
  });

  // Step 4: Solusi Ideal Positif dan Negatif
  const idealPos = criteria.map((c, j) =>
    c.type === "benefit"
      ? Math.max(...weighted.map(row => row[j]))
      : Math.min(...weighted.map(row => row[j]))
  );

  const idealNeg = criteria.map((c, j) =>
    c.type === "benefit"
      ? Math.min(...weighted.map(row => row[j]))
      : Math.max(...weighted.map(row => row[j]))
  );

  steps.push({
    title: "Step 4: Solusi Ideal Positif (A+) dan Negatif (A-)",
    description: "A+ = nilai terbaik dari setiap kriteria, A- = nilai terburuk dari setiap kriteria",
    data: {
      positif: criteria.map((c, j) => ({ kriteria: c.name, nilai: idealPos[j].toFixed(6) })),
      negatif: criteria.map((c, j) => ({ kriteria: c.name, nilai: idealNeg[j].toFixed(6) }))
    }
  });

  // Step 5: Jarak ke Solusi Ideal
  const dPos = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealPos[j]) ** 2, 0))
  );

  const dNeg = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealNeg[j]) ** 2, 0))
  );

  steps.push({
    title: "Step 5: Jarak ke Solusi Ideal",
    description: "Menghitung jarak euclidean ke solusi ideal positif (D+) dan negatif (D-)",
    data: {
      dPlus: dPos.map((d, i) => ({ alternatif: alternatives[i].name, jarak: d.toFixed(6) })),
      dMinus: dNeg.map((d, i) => ({ alternatif: alternatives[i].name, jarak: d.toFixed(6) }))
    },
    formulas: [
      `D+ = √(Σ(yij - A+j)²)`,
      `D- = √(Σ(yij - A-j)²)`
    ]
  });

  // Step 6: Nilai Preferensi
  const scores = dNeg.map((dn, i) => dn / (dn + dPos[i]));

  steps.push({
    title: "Step 6: Nilai Preferensi (Closeness Coefficient)",
    description: "Menghitung kedekatan relatif terhadap solusi ideal positif",
    vector: scores,
    formulas: [`Ci = D- / (D+ + D-)`]
  });

  const results = sortResult(alternatives, scores);

  steps.push({
    title: "Step 7: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan nilai preferensi tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
