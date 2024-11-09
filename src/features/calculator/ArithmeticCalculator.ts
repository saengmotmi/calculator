import { Infix } from "../../entities/notations/infix";
import { Notation } from "../../entities/notations/notation";
import { Postfix } from "../../entities/notations/postfix";
import { Prefix } from "../../entities/notations/prefix";
import { ArithmeticEvaluator } from "../../entities/operations/arithmetics";

export class ArithmeticCalculator {
  private expression: string = "";

  inputNumber(number: string | number) {
    this.expression += ` ${number}`;
  }

  inputOperator(operator: string) {
    this.expression += ` ${operator}`;
  }

  inputParenthesis(paren: "(" | ")") {
    this.expression += ` ${paren}`;
  }

  clear() {
    this.expression = "";
  }

  calculate() {
    const calculator = ArithmeticCalculatorFactory.create(
      this.expression.trim()
    );
    const result = calculator.evaluate();
    this.clear(); // 계산 후 초기화
    return result;
  }

  getExpression() {
    return this.expression.trim();
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
