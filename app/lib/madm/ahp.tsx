import { Criterion, Alternative, Result, CalculationResult, CalculationStep } from "./types";
import { sortResult } from "./utils";

// Implementasi AHP (Analytical Hierarchy Process) dengan perbandingan berpasangan
export function calculateAHP(alternatives: Alternative[], criteria: Criterion[]): CalculationResult {
  const steps: CalculationStep[] = [];

  // Fungsi untuk menghitung eigenvalue dan eigenvector
  const calculatePriorityVector = (matrix: number[][]): number[] => {
    const n = matrix.length;
    
    // Normalisasi kolom
    const colSums = matrix[0].map((_, j) => 
      matrix.reduce((sum, row) => sum + row[j], 0)
    );
    
    const normalized = matrix.map(row =>
      row.map((val, j) => val / colSums[j])
    );
    
    // Hitung rata-rata baris untuk mendapatkan priority vector
    return normalized.map(row =>
      row.reduce((sum, val) => sum + val, 0) / n
    );
  };

  // Hitung Consistency Ratio
  const calculateConsistencyRatio = (matrix: number[][], priorityVector: number[]): number => {
    const n = matrix.length;
    
    // Hitung weighted sum vector
    const weightedSum = matrix.map((row, i) =>
      row.reduce((sum, val, j) => sum + val * priorityVector[j], 0)
    );
    
    // Hitung lambda max
    const lambdaMax = weightedSum.reduce((sum, val, i) => 
      sum + val / priorityVector[i], 0
    ) / n;
    
    // Consistency Index
    const CI = (lambdaMax - n) / (n - 1);
    
    // Random Index (RI) untuk n = 1 sampai 10
    const RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    const ri = n <= 10 ? RI[n - 1] : 1.49;
    
    // Consistency Ratio
    return CI / ri;
  };

  // Step 1: Matriks Perbandingan Berpasangan untuk Kriteria
  // Untuk kesederhanaan, kita gunakan bobot yang sudah ada sebagai priority vector kriteria
  const criteriaWeights = criteria.map(c => c.weight);
  const totalWeight = criteriaWeights.reduce((sum, w) => sum + w, 0);
  const normalizedCriteriaWeights = criteriaWeights.map(w => w / (totalWeight || 1));

  steps.push({
    title: "Step 1: Bobot Prioritas Kriteria",
    description: "Bobot kepentingan relatif dari setiap kriteria (dalam AHP sebenarnya dihitung dari matriks perbandingan berpasangan)",
    data: criteria.map((c, i) => ({
      kriteria: c.name,
      bobot: normalizedCriteriaWeights[i].toFixed(4)
    }))
  });

  // Step 2 & 3: Matriks Perbandingan Berpasangan dan Priority Vector untuk setiap Kriteria
  const alternativePriorities: { [critId: number]: number[] } = {};

  criteria.forEach((criterion) => {
    // Bangun matriks perbandingan berpasangan dari nilai yang diinput
    const pairwiseMatrix: number[][] = alternatives.map((alt1, i) =>
      alternatives.map((alt2, j) => {
        if (i === j) return 1;
        const key = `${criterion.id}_${alt2.id}`;
        const value = (alt1.values as any)[key];
        return value || 1;
      })
    );

    steps.push({
      title: `Step 2.${criterion.id}: Matriks Perbandingan Berpasangan - ${criterion.name}`,
      description: `Matriks perbandingan tingkat kepentingan antar alternatif untuk kriteria ${criterion.name}`,
      matrix: pairwiseMatrix,
      headers: alternatives.map(a => a.name)
    });

    // Hitung priority vector
    const priorityVector = calculatePriorityVector(pairwiseMatrix);
    alternativePriorities[criterion.id] = priorityVector;

    // Hitung Consistency Ratio
    const CR = calculateConsistencyRatio(pairwiseMatrix, priorityVector);

    steps.push({
      title: `Step 3.${criterion.id}: Priority Vector - ${criterion.name}`,
      description: `Vektor prioritas lokal alternatif terhadap kriteria ${criterion.name}. CR = ${CR.toFixed(4)} ${CR < 0.1 ? '✓ (Konsisten)' : '✗ (Tidak Konsisten)'}`,
      vector: priorityVector,
      formulas: [
        `Consistency Ratio (CR) = ${CR.toFixed(4)}`,
        `CR < 0.1 berarti matriks konsisten`,
        `Metode: Normalisasi kolom → Rata-rata baris`
      ]
    });
  });

  // Step 4: Perhitungan Skor Global
  const globalScores = alternatives.map((alt, i) => {
    let score = 0;
    criteria.forEach((crit, j) => {
      const localPriority = alternativePriorities[crit.id][i];
      const criteriaWeight = normalizedCriteriaWeights[j];
      score += localPriority * criteriaWeight;
    });
    return score;
  });

  steps.push({
    title: "Step 4: Perhitungan Skor Global",
    description: "Mengalikan priority vector lokal dengan bobot kriteria untuk mendapatkan prioritas global",
    vector: globalScores,
    formulas: [
      `Global Score = Σ(Priority Vector × Bobot Kriteria)`,
      `Bobot Kriteria: ${criteria.map((c, i) => `${c.name}=${normalizedCriteriaWeights[i].toFixed(4)}`).join(', ')}`
    ]
  });

  const results = sortResult(alternatives, globalScores);

  steps.push({
    title: "Step 5: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan skor global tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
