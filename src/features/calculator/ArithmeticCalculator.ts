// ArithmeticCalculator.ts
import { Infix } from "../../entities/notations/infix";
import { Notation } from "../../entities/notations/notation";
import { Postfix } from "../../entities/notations/postfix";
import { Prefix } from "../../entities/notations/prefix";
import { ArithmeticEvaluator } from "../../entities/operations/arithmetics";

export class ArithmeticCalculator {
  private inputHistory: string[] = [];

  inputNumber(number: string | number) {
    this.inputHistory.push(`${number}`);
  }

  inputOperator(operator: string) {
    this.inputHistory.push(`${operator}`);
  }

  inputParenthesis(paren: "(" | ")") {
    this.inputHistory.push(paren);
  }

  clear() {
    this.inputHistory = [];
  }

  undo() {
    this.inputHistory.pop();
  }

  calculate() {
    const expression = this.inputHistory.join(" ");
    const calculator = ArithmeticCalculatorFactory.create(expression.trim());
    const result = calculator.evaluate();
    this.clear(); // 계산 후 초기화
    return result;
  }

  getExpression() {
    return this.inputHistory.join(" ").trim();
  }
}

class ArithmeticCalculatorFactory {
  static create(
    expression: string,
    type: "infix" | "prefix" | "postfix" = "infix"
  ): Notation {
    const evaluator = new ArithmeticEvaluator();

    switch (type) {
      case "infix":
        return new Infix(expression, evaluator);
      case "prefix":
        return new Prefix(expression, evaluator);
      case "postfix":
        return new Postfix(expression, evaluator);
      default:
        throw new Error(`Unknown notation type: ${type}`);
    }
  }
}
