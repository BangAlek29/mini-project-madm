import { Criterion, Alternative, Result } from "./types";
import { sortResult } from "./utils";

export function calculateSAW(alternatives: Alternative[], criteria: Criterion[]): Result[] {
  const matrix = alternatives.map(alt =>
    criteria.map(c => alt.values[c.id] || 0)
  );

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

  const scores = normalized.map(row =>
    row.reduce((sum, val, j) => sum + val * criteria[j].weight, 0)
  );

  return sortResult(alternatives, scores);
}
