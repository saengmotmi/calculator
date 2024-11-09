// StackManager.ts
import { Evaluator } from "../operations/evaluator";
import { PAREN } from "./token";

export class StackManager {
  constructor(private evaluator: Evaluator) {}

  applyOperator(values: number[], operators: string[]) {
    const operator = operators.pop()!;
    const b = values.pop()!;
    const a = values.pop()!;
    const result = this.evaluator.applyOperation(a, b, operator);
    values.push(result);
  }

  processOperator(token: string, values: number[], operators: string[]) {
    while (
      operators.length &&
      this.hasHigherOrEqualPrecedence(operators[operators.length - 1], token)
    ) {
      this.applyOperator(values, operators);
    }
    operators.push(token);
  }

  processUntilLeftParenthesis(values: number[], operators: string[]) {
    while (operators.length && operators[operators.length - 1] !== PAREN.LEFT) {
      this.applyOperator(values, operators);
    }
    operators.pop(); // Remove the left parenthesis
  }

  moveAllOperators(values: number[], operators: string[]) {
    while (operators.length) {
      this.applyOperator(values, operators);
    }
  }

  moveUntilLeftParenthesis(output: string[], operators: string[]) {
    while (operators.length && operators[operators.length - 1] !== PAREN.LEFT) {
      output.push(operators.pop()!);
    }
    operators.pop(); // Remove the left parenthesis
  }

  pushOperatorsWithHigherPrecedence(
    token: string,
    output: string[],
    operators: string[]
  ) {
    while (
      operators.length &&
      this.hasHigherOrEqualPrecedence(operators[operators.length - 1], token)
    ) {
      output.push(operators.pop()!);
    }
    operators.push(token);
  }

  private hasHigherOrEqualPrecedence(op1: string, op2: string): boolean {
    return this.evaluator.precedence[op1] >= this.evaluator.precedence[op2];
  }
}
