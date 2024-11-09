export interface Notation {
  toInfix: () => string[];
  toPostfix: () => string[];
  toPrefix: () => string[];
  evaluate: () => number;
}
