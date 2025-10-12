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

  // Hitung Consistency Ratio dan return detail
  const calculateConsistencyDetails = (matrix: number[][], priorityVector: number[]): {
    lambdaMax: number;
    CI: number;
    RI: number;
    CR: number;
  } => {
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
    const RI_VALUES = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    const RI = n <= 10 ? RI_VALUES[n - 1] : 1.49;
    
    // Consistency Ratio
    const CR = RI > 0 ? CI / RI : 0;
    
    return { lambdaMax, CI, RI, CR };
  };

  // ============================================================
  // BAGIAN A: PERHITUNGAN ANTAR KRITERIA (BOBOT PRIORITAS)
  // ============================================================
  
  steps.push({
    title: "═══════════════════════════════════════════",
    description: "BAGIAN A: PERHITUNGAN BOBOT PRIORITAS KRITERIA",
    data: []
  });

  // Step A.1: Matriks Perbandingan Berpasangan untuk Kriteria
  // Untuk demo, kita buat matriks identitas yang sudah diisi dengan perbandingan
  // Dalam implementasi nyata, ini harus diambil dari input user
  const criteriaMatrix: number[][] = criteria.map((c1, i) =>
    criteria.map((c2, j) => {
      if (i === j) return 1;
      // Menggunakan ratio bobot sebagai perbandingan (simplified)
      return criteria[i].weight / criteria[j].weight;
    })
  );

  steps.push({
    title: "Step A.1: Matriks Perbandingan Kriteria",
    description: "Matriks perbandingan berpasangan antar kriteria",
    matrix: criteriaMatrix,
    headers: criteria.map(c => c.name)
  });

  // Step A.2: Hitung Priority Vector untuk Kriteria
  const criteriaPriorityVector = calculatePriorityVector(criteriaMatrix);
  
  steps.push({
    title: "Step A.2: Priority Vector Kriteria",
    description: "Vektor prioritas (bobot) setiap kriteria dari hasil normalisasi matriks",
    vector: criteriaPriorityVector,
    formulas: [
      `Metode: Normalisasi kolom → Rata-rata baris`,
      `Bobot kriteria: ${criteria.map((c, i) => `${c.name}=${criteriaPriorityVector[i].toFixed(4)}`).join(', ')}`
    ]
  });

  // Step A.3: Hitung Consistency Ratio untuk Kriteria
  const criteriaConsistency = calculateConsistencyDetails(criteriaMatrix, criteriaPriorityVector);
  
  steps.push({
    title: "Step A.3: Uji Konsistensi Kriteria",
    description: "Menghitung Consistency Ratio untuk memastikan penilaian konsisten",
    data: [
      { parameter: 'λmax (Lambda Max)', nilai: criteriaConsistency.lambdaMax.toFixed(4) },
      { parameter: 'n (Jumlah Kriteria)', nilai: criteria.length.toString() },
      { parameter: 'CI (Consistency Index)', nilai: criteriaConsistency.CI.toFixed(4), formula: '(λmax - n) / (n - 1)' },
      { parameter: 'RI (Random Index)', nilai: criteriaConsistency.RI.toFixed(2), formula: `RI untuk n=${criteria.length}` },
      { parameter: 'CR (Consistency Ratio)', nilai: criteriaConsistency.CR.toFixed(4), formula: 'CI / RI' },
      { 
        parameter: 'Status Konsistensi', 
        nilai: criteriaConsistency.CR < 0.1 ? 'KONSISTEN' : 'TIDAK KONSISTEN',
        formula: criteriaConsistency.CR < 0.1 ? 'CR < 0.1' : 'CR ≥ 0.1'
      }
    ],
    formulas: [
      `Kesimpulan: Matriks kriteria ${criteriaConsistency.CR < 0.1 ? 'KONSISTEN' : 'TIDAK KONSISTEN'}`,
      criteriaConsistency.CR < 0.1 
        ? 'Penilaian perbandingan kriteria dapat diterima' 
        : 'Penilaian perbandingan kriteria perlu diperbaiki'
    ]
  });

  // Gunakan priority vector yang sudah dihitung
  const normalizedCriteriaWeights = criteriaPriorityVector;

  // Step 2 & 3: Matriks Perbandingan Berpasangan dan Priority Vector untuk setiap Kriteria
  const alternativePriorities: { [critId: number]: number[] } = {};

  // ============================================================
  // BAGIAN B: PERHITUNGAN ANTAR ALTERNATIF (PEMERINGKATAN)
  // ============================================================
  
  steps.push({
    title: "═══════════════════════════════════════════",
    description: "BAGIAN B: PERHITUNGAN PRIORITAS ALTERNATIF",
    data: []
  });

  criteria.forEach((criterion, idx) => {
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
      title: `Step B.${idx + 1}.1: Matriks Perbandingan - ${criterion.name}`,
      description: `Matriks perbandingan tingkat kepentingan antar alternatif untuk kriteria ${criterion.name}`,
      matrix: pairwiseMatrix,
      headers: alternatives.map(a => a.name)
    });

    // Hitung priority vector
    const priorityVector = calculatePriorityVector(pairwiseMatrix);
    alternativePriorities[criterion.id] = priorityVector;

    // Hitung Consistency Ratio
    const consistency = calculateConsistencyDetails(pairwiseMatrix, priorityVector);

    steps.push({
      title: `Step B.${idx + 1}.2: Priority Vector - ${criterion.name}`,
      description: `Vektor prioritas lokal alternatif terhadap kriteria ${criterion.name}`,
      vector: priorityVector,
      formulas: [
        `λmax (Lambda Max) = ${consistency.lambdaMax.toFixed(4)}`,
        `CI (Consistency Index) = ${consistency.CI.toFixed(4)}`,
        `RI (Random Index) = ${consistency.RI.toFixed(2)}`,
        `CR (Consistency Ratio) = CI/RI = ${consistency.CR.toFixed(4)}`,
        `Status: ${consistency.CR < 0.1 ? 'Konsisten (CR < 0.1)' : 'Tidak Konsisten (CR ≥ 0.1)'}`,
      ]
    });
  });

  // Step B.3: Perhitungan Skor Global
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
    title: "Step B.3: Perhitungan Skor Global",
    description: "Mengalikan priority vector lokal dengan bobot kriteria untuk mendapatkan prioritas global",
    vector: globalScores,
    formulas: [
      `Global Score = Σ(Priority Vector × Bobot Kriteria)`,
      `Bobot Kriteria: ${criteria.map((c, i) => `${c.name}=${normalizedCriteriaWeights[i].toFixed(4)}`).join(', ')}`
    ]
  });

  const results = sortResult(alternatives, globalScores);

  steps.push({
    title: "Step B.4: Peringkat Akhir",
    description: "Mengurutkan alternatif berdasarkan skor global tertinggi",
    data: results.map((r, idx) => ({
      rank: idx + 1,
      name: r.name,
      score: r.score.toFixed(6)
    }))
  });

  return { results, steps };
}
