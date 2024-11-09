import { Evaluator } from "./evaluator";

export type OPERATORS = (typeof OPERATORS)[keyof typeof OPERATORS];

const OPERATORS = {
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
} as const;

const PRECEDENCE: { [operator: string]: number } = {
  [OPERATORS.PLUS]: 1,
  [OPERATORS.MINUS]: 1,
  [OPERATORS.MULTIPLY]: 2,
  [OPERATORS.DIVIDE]: 2,
};

export class ArithmeticEvaluator implements Evaluator {
  precedence = PRECEDENCE;

  applyOperation(a: number, b: number, operator: string) {
    switch (operator) {
      case OPERATORS.PLUS:
        return a + b;
      case OPERATORS.MINUS:
        return a - b;
      case OPERATORS.MULTIPLY:
        return a * b;
      case OPERATORS.DIVIDE:
        if (b === 0) throw new Error("Division by zero");
        return a / b;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  tokenizeExpression(expression: string) {
    const isArithmeticTokenRegex = /(\d+|\+|\-|\*|\/|\(|\))/;

    return expression
      .split(isArithmeticTokenRegex)
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }
}
