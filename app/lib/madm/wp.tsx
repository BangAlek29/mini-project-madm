import { Criterion, Alternative, Result } from "./types";
import { sortResult } from "./utils";

export function calculateWP(alternatives: Alternative[], criteria: Criterion[]): Result[] {
  const scores = alternatives.map(alt => {
    let product = 1;
    criteria.forEach(c => {
      const val = alt.values[c.id] || 0.0001; // hindari pembagian 0
      if (c.type === "benefit") {
        product *= Math.pow(val, c.weight);
      } else {
        product *= Math.pow(1 / val, c.weight);
      }
    });
    return product;
  });

  const total = scores.reduce((a, b) => a + b, 0);
  const normalizedScores = scores.map(s => s / total);

  return sortResult(alternatives, normalizedScores);
}
