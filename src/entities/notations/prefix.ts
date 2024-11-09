import { Evaluator } from "../operations/evaluator";
import { Notation } from "./notation";

export class Prefix implements Notation {
  constructor(private expression: string, private evaluator: Evaluator) {}

  evaluate() {
    const values: number[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression).reverse();

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        values.push(Number(token));
      } else {
        const a = values.pop()!;
        const b = values.pop()!;
        values.push(this.evaluator.applyOperation(a, b, token));
      }
    });

    return values.pop()!;
  }

  toInfix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression).reverse();
    const stack: string[] = [];

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        stack.push(token);
      } else {
        const a = stack.pop()!;
        const b = stack.pop()!;
        stack.push(`( ${a} ${token} ${b} )`);
      }
    });

    return stack[0].split(" ");
  }

  toPostfix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression).reverse();
    const stack: string[] = [];

    tokens.forEach((token) => {
      if (!isNaN(Number(token))) {
        stack.push(token);
      } else {
        const a = stack.pop()!;
        const b = stack.pop()!;
        stack.push(`${a} ${b} ${token}`);
      }
    });

    return stack[0].split(" ");
  }

  toPrefix() {
    return this.evaluator.tokenizeExpression(this.expression);
  }
}
