export interface Evaluator {
  precedence: { [key: string]: number };
  applyOperation: (a: number, b: number, operator: string) => number;
  tokenizeExpression: (expression: string) => string[];
}
