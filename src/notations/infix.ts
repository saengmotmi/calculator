import { Notation } from "./notation";
import { tokenizeExpression } from "./token";

export class Infix implements Notation {
  private precedence: { [key: string]: number } = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  constructor(private expression: string) {}

  evaluate(): number {
    const values: number[] = [];
    const operators: string[] = [];
    const tokens = tokenizeExpression(this.expression);

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
          this.precedence[operators[operators.length - 1]] >=
            this.precedence[token]
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
    switch (operator) {
      case "+":
        values.push(a + b);
        break;
      case "-":
        values.push(a - b);
        break;
      case "*":
        values.push(a * b);
        break;
      case "/":
        values.push(a / b);
        break;
    }
  }

  toInfix(): string[] {
    return tokenizeExpression(this.expression);
  }

  toPostfix(): string[] {
    const output: string[] = [];
    const operators: string[] = [];
    const tokens = tokenizeExpression(this.expression);

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
          this.precedence[operators[operators.length - 1]] >=
            this.precedence[token]
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

  toPrefix(): string[] {
    const reversedExpr = this.expression
      .split("")
      .reverse()
      .map((char) => {
        if (char === "(") return ")";
        else if (char === ")") return "(";
        else return char;
      })
      .join("");

    const postfix = new Infix(reversedExpr).toPostfix();
    return postfix.reverse();
  }
}
