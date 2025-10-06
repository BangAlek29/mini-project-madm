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
