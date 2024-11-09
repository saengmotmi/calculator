export interface Notation {
  toInfix: () => string[];
  toPostfix: () => string[];
  toPrefix: () => string[];
  evaluate: () => number;
}

export type NotationType = "infix" | "prefix" | "postfix";
