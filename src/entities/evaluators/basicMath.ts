import { Evaluator } from "./evaluator";

export type OPERATORS = (typeof OPERATORS)[keyof typeof OPERATORS];

export const OPERATORS = {
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

export class BasicMathEvaluator implements Evaluator {
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
        if (b === 0) {
          throw new Error("Division by zero");
        }
        return a / b;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  tokenizeExpression(expression: string) {
    const isBasicMathTokenRegex = /(\d+|\+|\-|\*|\/|\(|\))/;

    const tokens = expression
      .split(isBasicMathTokenRegex)
      .map((token) => token.trim())
      .filter((token) => token.length > 0);

    // Handle negative numbers first
    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i] === "-" &&
        (i === 0 ||
          tokens[i - 1] === "(" ||
          Object.values(OPERATORS).includes(tokens[i - 1] as OPERATORS))
      ) {
        tokens[i + 1] = "-" + tokens[i + 1];
        tokens.splice(i, 1);
      }
    }

    // Handle implicit multiplication (number followed by parenthesis)
    const result: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      result.push(token);
      if (
        i < tokens.length - 1 &&
        !isNaN(Number(token)) &&
        tokens[i + 1] === "("
      ) {
        result.push(OPERATORS.MULTIPLY);
      }
    }

    return result;
  }
}
