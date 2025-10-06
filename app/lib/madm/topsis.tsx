import { Criterion, Alternative, Result } from "./types";
import { sortResult } from "./utils";

export function calculateTOPSIS(alternatives: Alternative[], criteria: Criterion[]): Result[] {
  const matrix = alternatives.map(alt =>
    criteria.map(c => alt.values[c.id] || 0)
  );

  const normDenom = criteria.map((_, j) =>
    Math.sqrt(matrix.reduce((sum, row) => sum + row[j] ** 2, 0))
  );

  const normalized = matrix.map(row =>
    row.map((val, j) => (normDenom[j] ? val / normDenom[j] : 0))
  );

  const weighted = normalized.map(row =>
    row.map((val, j) => val * criteria[j].weight)
  );

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

  const dPos = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealPos[j]) ** 2, 0))
  );

  const dNeg = weighted.map(row =>
    Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealNeg[j]) ** 2, 0))
  );

  const scores = dNeg.map((dn, i) => dn / (dn + dPos[i]));

  return sortResult(alternatives, scores);
}
