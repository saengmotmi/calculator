import { Evaluator } from "../operations/evaluator";
import { Notation } from "./notation";

export class Infix implements Notation {
  constructor(private expression: string, private evaluator: Evaluator) {}

  evaluate() {
    const values: number[] = [];
    const operators: string[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression);

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        values.push(Number(token));
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          this.applyOperator(values, operators.pop()!);
        }
        operators.pop();
      } else {
        while (
          operators.length &&
          this.evaluator.precedence[operators[operators.length - 1]] >=
            this.evaluator.precedence[token]
        ) {
          this.applyOperator(values, operators.pop()!);
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      this.applyOperator(values, operators.pop()!);
    }

    return values.pop()!;
  }

  private applyOperator(values: number[], operator: string) {
    const b = values.pop()!;
    const a = values.pop()!;
    const result = this.evaluator.applyOperation(a, b, operator);
    values.push(result);
  }

  toInfix() {
    return this.evaluator.tokenizeExpression(this.expression);
  }

  toPostfix() {
    const output: string[] = [];
    const operators: string[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression);

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        output.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          output.push(operators.pop()!);
        }
        operators.pop();
      } else {
        while (
          operators.length &&
          this.evaluator.precedence[operators[operators.length - 1]] >=
            this.evaluator.precedence[token]
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      }
    });

    while (operators.length) {
      output.push(operators.pop()!);
    }

    return output;
  }

  toPrefix() {
    const reversedExpr = this.expression
      .split("")
      .reverse()
      .map((char) => {
        if (char === "(") return ")";
        else if (char === ")") return "(";
        else return char;
      })
      .join("");

    const postfix = new Infix(reversedExpr, this.evaluator).toPostfix();
    return postfix.reverse();
  }
}
