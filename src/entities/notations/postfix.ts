import { Evaluator } from "../operations/evaluator";
import { Notation } from "./notation";

export class Postfix implements Notation {
  constructor(private expression: string, private evaluator: Evaluator) {}

  evaluate() {
    const values: number[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression);

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        values.push(Number(token));
      } else {
        const b = values.pop()!;
        const a = values.pop()!;
        values.push(this.evaluator.applyOperation(a, b, token));
      }
    });

    return values.pop()!;
  }

  toInfix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    const stack: string[] = [];

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        stack.push(token);
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(`( ${a} ${token} ${b} )`);
      }
    });

    return stack[0].split(" ");
  }

  toPostfix() {
    return this.evaluator.tokenizeExpression(this.expression);
  }

  toPrefix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    const stack: string[] = [];

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        stack.push(token);
      } else {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(`${token} ${a} ${b}`);
      }
    });

    return stack[0].split(" ");
  }
}
