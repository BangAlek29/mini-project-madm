// Types untuk Decision Support System

export interface Criterion {
  id: number;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface Alternative {
  id: number;
  name: string;
  values: { [key: number | string]: number };
}

export interface Result {
  id: number;
  name: string;
  score: number;
}
