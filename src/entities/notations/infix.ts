import { Evaluator } from "../operations/evaluator";
import { Notation } from "./notation";
import { StackManager } from "./stack";
import { PAREN } from "./token";

export class Infix implements Notation {
  private stackManager: StackManager;

  constructor(private expression: string, private evaluator: Evaluator) {
    this.stackManager = new StackManager(this.evaluator);
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
        this.stackManager.processUntilLeftParenthesis(values, operators);
      } else {
        this.stackManager.processOperator(token, values, operators);
      }
    });

    this.stackManager.moveAllOperators(values, operators);

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
        this.stackManager.moveUntilLeftParenthesis(output, operators);
      } else {
        this.stackManager.pushOperatorsWithHigherPrecedence(
          token,
          output,
          operators
        );
      }
    });

    return output.concat(operators.toReversed());
  }

  toPrefix() {
    const reversedExpr = this.reverseExpression(this.expression);
    const postfix = new Infix(reversedExpr, this.evaluator).toPostfix();
    return postfix.toReversed();
  }

  private isNumber(token: string): boolean {
    return !isNaN(Number(token));
  }

  private isLeftParenthesis(token: string): boolean {
    return token === PAREN.LEFT;
  }

  private isRightParenthesis(token: string): boolean {
    return token === PAREN.RIGHT;
  }

  private reverseExpression(expression: string): string {
    return expression
      .split("")
      .toReversed()
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
