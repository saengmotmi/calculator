import { Evaluator } from "../evaluators/evaluator";
import { Notation } from "./notation";

export class Prefix implements Notation {
  private manager: PrefixManager;

  constructor(private expression: string, private evaluator: Evaluator) {
    this.manager = new PrefixManager(this.evaluator);
  }

  evaluate() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    return this.manager.evaluate(tokens);
  }

  toInfix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    return this.manager.toInfix(tokens);
  }

  toPostfix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    return this.manager.toPostfix(tokens);
  }

  toPrefix() {
    return this.evaluator.tokenizeExpression(this.expression);
  }
}

export class PrefixManager {
  constructor(private evaluator: Evaluator) {}

  evaluate(tokens: string[]) {
    const values: number[] = [];
    tokens.reverse().forEach((token) => {
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

  toInfix(tokens: string[]) {
    const stack: string[] = [];
    tokens.reverse().forEach((token) => {
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

  toPostfix(tokens: string[]) {
    const stack: string[] = [];
    tokens.reverse().forEach((token) => {
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
}
