import { Alternative, Result } from "./types";

export function sortResult(alternatives: Alternative[], scores: number[]): Result[] {
  return alternatives
    .map((alt, i) => ({
      id: alt.id,
      name: alt.name,
      score: scores[i],
    }))
    .sort((a, b) => b.score - a.score);
}
