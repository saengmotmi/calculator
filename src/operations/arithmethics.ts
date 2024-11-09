import { Evaluator } from "./evaluator";

export class ArithmeticEvaluator implements Evaluator {
  precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  applyOperation(a: number, b: number, operator: string) {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
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
      } else if ("+-*/()".includes(char)) {
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
