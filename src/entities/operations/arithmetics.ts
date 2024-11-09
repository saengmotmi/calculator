import { PAREN } from "../notations/token";
import { Evaluator } from "./evaluator";

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
    const tokens: string[] = [];
    let currentNumber = "";

    for (const char of expression) {
      if (/\d/.test(char) || char === ".") {
        currentNumber += char;
      } else if (
        [
          OPERATORS.PLUS,
          OPERATORS.MINUS,
          OPERATORS.MULTIPLY,
          OPERATORS.DIVIDE,
          PAREN.LEFT,
          PAREN.RIGHT,
        ].includes(char)
      ) {
        if (currentNumber) {
          tokens.push(currentNumber);
          currentNumber = "";
        }
        tokens.push(char);
      } else if (/\s/.test(char)) {
        continue;
      } else {
        throw new Error(`Invalid character in expression: ${char}`);
      }
    }

    if (currentNumber) {
      tokens.push(currentNumber);
    }

    return tokens;
  }
}
