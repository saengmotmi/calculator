import { Infix } from "../../entities/notations/infix";
import { Notation, NotationType } from "../../entities/notations/notation";
import { Postfix } from "../../entities/notations/postfix";
import { Prefix } from "../../entities/notations/prefix";
import { PAREN } from "../../entities/notations/token";
import {
  BasicMathEvaluator,
  OPERATORS,
} from "../../entities/evaluators/basicMath";

export class BasicMathCalculator {
  private inputHistory: string[] = [];
  private currentInput: string = "";
  private previousResult: number | null = null; // 마지막 계산 결과 저장
  private isNegative: boolean = false; // 음수 여부를 추적

  inputNumber(number: string | number) {
    // 현재 입력을 문자열로 저장하여 여러 자릿수 숫자 입력을 지원
    if (this.isNegative) {
      this.currentInput += `-${number}`;
      this.isNegative = false;
    } else {
      this.currentInput += `${number}`;
    }
  }

  inputOperator(operator: OPERATORS) {
    if (this.currentInput) {
      // 현재 입력된 숫자를 inputHistory에 추가하고 초기화
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    } else if (this.previousResult !== null && this.inputHistory.length === 0) {
      // 이전 결과를 현재 수식의 시작값으로 설정
      this.inputHistory.push(`${this.previousResult}`);
    }

    // 연산자를 inputHistory에 추가
    this.inputHistory.push(`${operator}`);
  }

  inputParenthesis(paren: PAREN) {
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }
    if (paren === PAREN.LEFT && this.inputHistory.length > 0) {
      const lastInput = this.inputHistory[this.inputHistory.length - 1];
      if (!isNaN(Number(lastInput))) {
        this.inputHistory.push(OPERATORS.MULTIPLY);
      }
    }
    this.inputHistory.push(paren);
  }

  // 현재 수식만 초기화하고, 이전 결과는 유지
  clearExpression() {
    this.inputHistory = [];
    this.currentInput = "";
  }

  // 계산기의 모든 상태를 초기화 (이전 결과 포함)
  clearAll() {
    this.inputHistory = [];
    this.currentInput = "";
    this.previousResult = null;
  }

  undo() {
    if (this.currentInput) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.inputHistory.pop();
    }
  }

  evaluate() {
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }

    const expression = this.inputHistory.join(" ");
    const calculator = BasicMathCalculatorFactory.create(expression.trim());
    const result = calculator.evaluate();

    this.previousResult = result; // 마지막 결과를 저장
    this.clearExpression(); // 수식 초기화 (하지만 이전 결과는 유지)

    return result;
  }

  getExpression() {
    return [...this.inputHistory, this.currentInput].join(" ").trim();
  }
}

class BasicMathCalculatorFactory {
  static create(expression: string, type: NotationType = "infix"): Notation {
    const evaluator = new BasicMathEvaluator();

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
