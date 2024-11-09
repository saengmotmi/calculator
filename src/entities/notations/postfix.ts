import { Evaluator } from "../operations/evaluator";
import { Notation } from "./notation";

export class Postfix implements Notation {
  private manager: PostfixManager;

  constructor(private expression: string, private evaluator: Evaluator) {
    this.manager = new PostfixManager(this.evaluator);
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
    return this.evaluator.tokenizeExpression(this.expression);
  }

  toPrefix() {
    const tokens = this.evaluator.tokenizeExpression(this.expression);
    return this.manager.toPrefix(tokens);
  }
}

export class PostfixManager {
  constructor(private evaluator: Evaluator) {}

  evaluate(tokens: string[]): number {
    const values: number[] = [];
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

  toInfix(tokens: string[]): string[] {
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

  toPrefix(tokens: string[]): string[] {
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
