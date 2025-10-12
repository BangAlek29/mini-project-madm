export interface Criterion {
  id: number;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface Alternative {
  id: number;
  name: string;
  values: { [key: number]: number }; // key = criterion.id
}

export interface Result {
  id: number;
  name: string;
  score: number;
}

export interface CalculationStep {
  title: string;
  description: string;
  data?: any;
  matrix?: number[][];
  vector?: number[];
  headers?: string[];
  formulas?: string[];
}

export interface CalculationResult {
  results: Result[];
  steps: CalculationStep[];
}
