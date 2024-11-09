import { Evaluator } from "../evaluators/evaluator";
import { Notation } from "./notation";
import { PAREN } from "./token";

export class Infix implements Notation {
  private manager: InfixManager;

  constructor(private expression: string, private evaluator: Evaluator) {
    this.manager = new InfixManager(this.evaluator);
  }

  evaluate() {
    const values: number[] = [];
    const operators: string[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression);

    tokens.forEach((token) => {
      if (this.isNumber(token)) {
        values.push(Number(token));
      } else if (this.isLeftParenthesis(token)) {
        operators.push(token);
      } else if (this.isRightParenthesis(token)) {
        this.manager.processUntilLeftParenthesis(values, operators);
      } else {
        this.manager.processOperator(token, values, operators);
      }
    });

    this.manager.transferRemainingOperators(values, operators);

    return values.pop()!;
  }

  toInfix() {
    return this.evaluator.tokenizeExpression(this.expression);
  }

  toPostfix() {
    const output: string[] = [];
    const operators: string[] = [];
    const tokens = this.evaluator.tokenizeExpression(this.expression);

    tokens.forEach((token) => {
      if (this.isNumber(token)) {
        output.push(token);
      } else if (this.isLeftParenthesis(token)) {
        operators.push(token);
      } else if (this.isRightParenthesis(token)) {
        this.manager.transferUntilLeftParenthesis(output, operators);
      } else {
        this.manager.pushOperatorsWithHigherPrecedence(
          token,
          output,
          operators
        );
      }
    });

    this.manager.moveAllTokensToOutput(output, operators);

    return output;
  }

  toPrefix() {
    const reversedExpr = this.reverseExpression(this.expression);
    const postfix = new Infix(reversedExpr, this.evaluator).toPostfix();
    return postfix.reverse();
  }

  private isNumber(token: string) {
    return !isNaN(Number(token));
  }

  private isLeftParenthesis(token: string) {
    return token === PAREN.LEFT;
  }

  private isRightParenthesis(token: string) {
    return token === PAREN.RIGHT;
  }

  private reverseExpression(expression: string) {
    return expression
      .split("")
      .reverse()
      .map((char) => {
        if (this.isLeftParenthesis(char)) {
          return PAREN.RIGHT;
        } else if (this.isRightParenthesis(char)) {
          return PAREN.LEFT;
        }
        return char;
      })
      .join("");
  }
}

export class InfixManager {
  constructor(private evaluator: Evaluator) {}

  applyOperator(values: number[], operators: string[]) {
    const operator = operators.pop()!;
    const b = values.pop()!;
    const a = values.pop()!;
    values.push(this.evaluator.applyOperation(a, b, operator));
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
    operators.pop(); // Remove left parenthesis
  }

  transferRemainingOperators(values: number[], operators: string[]) {
    while (operators.length) {
      this.applyOperator(values, operators);
    }
  }

  transferUntilLeftParenthesis(output: string[], operators: string[]) {
    while (operators.length && operators[operators.length - 1] !== PAREN.LEFT) {
      output.push(operators.pop()!);
    }
    operators.pop();
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

  moveAllTokensToOutput(output: string[], operators: string[]) {
    while (operators.length) {
      output.push(operators.pop()!);
    }
  }

  private hasHigherOrEqualPrecedence(op1: string, op2: string) {
    return this.evaluator.precedence[op1] >= this.evaluator.precedence[op2];
  }
}
