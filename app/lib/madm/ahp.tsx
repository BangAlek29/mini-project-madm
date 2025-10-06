import { Criterion, Alternative, Result } from "./types";
import { sortResult } from "./utils";

// Catatan: ini AHP sederhana, pakai bobot langsung, tanpa perbandingan berpasangan
export function calculateAHP(alternatives: Alternative[], criteria: Criterion[]): Result[] {
  const matrix = alternatives.map(alt =>
    criteria.map(c => alt.values[c.id] || 0)
  );

  const colSums = criteria.map((_, j) =>
    matrix.reduce((sum, row) => sum + row[j], 0)
  );

  const normalized = matrix.map(row =>
    row.map((val, j) => (colSums[j] ? val / colSums[j] : 0))
  );

  const scores = normalized.map(row =>
    row.reduce((sum, val, j) => sum + val * criteria[j].weight, 0)
  );

  return sortResult(alternatives, scores);
}
