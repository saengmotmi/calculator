import { Infix } from "../../entities/notations/infix";
import { Notation, NotationType } from "../../entities/notations/notation";
import { Postfix } from "../../entities/notations/postfix";
import { Prefix } from "../../entities/notations/prefix";
import { PAREN } from "../../entities/notations/token";
import {
  ArithmeticEvaluator,
  OPERATORS,
} from "../../entities/evaluators/arithmetics";

export class ArithmeticCalculator {
  private inputHistory: string[] = [];
  private currentInput: string = "";

  inputNumber(number: string | number) {
    // 현재 입력을 문자열로 저장하여 여러 자릿수 숫자 입력을 지원
    this.currentInput += `${number}`;
  }

  inputOperator(operator: OPERATORS) {
    // 현재 입력이 비어있지 않으면 inputHistory에 추가
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }
    // 연산자를 기록
    this.inputHistory.push(`${operator}`);
  }

  inputParenthesis(paren: PAREN) {
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }
    this.inputHistory.push(paren);
  }

  clear() {
    this.inputHistory = [];
    this.currentInput = "";
  }

  undo() {
    if (this.currentInput) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.inputHistory.pop();
    }
  }

  evaluate() {
    // 마지막으로 입력한 숫자가 남아있다면 inputHistory에 추가
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }
    const expression = this.inputHistory.join(" ");
    const calculator = ArithmeticCalculatorFactory.create(expression.trim());
    const result = calculator.evaluate();
    this.clear(); // 계산 후 초기화
    return result;
  }

  getExpression() {
    return [...this.inputHistory, this.currentInput].join(" ").trim();
  }
}

class ArithmeticCalculatorFactory {
  static create(expression: string, type: NotationType = "infix"): Notation {
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
