import { Infix } from "../../entities/notations/infix";
import { Notation, NotationType } from "../../entities/notations/notation";
import { Postfix } from "../../entities/notations/postfix";
import { Prefix } from "../../entities/notations/prefix";
import { PAREN } from "../../entities/notations/token";
import {
  BasicMathEvaluator,
  OPERATORS,
} from "../../entities/evaluators/basicMath";
import { ICalculator } from "./ICalculator";

export class BasicMathCalculator implements ICalculator {
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

  inputOperator(operator: string) {
    // OPERATORS 타입으로 캐스팅
    const op = operator as OPERATORS;

    // 음수 처리: 연산자가 '-'이고 입력 내용이 없으면 음수 모드 활성화
    if (
      op === OPERATORS.MINUS &&
      this.currentInput === "" &&
      this.inputHistory.length === 0
    ) {
      this.isNegative = true;
      return;
    }

    if (this.currentInput) {
      // 현재 입력된 숫자를 inputHistory에 추가하고 초기화
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    } else if (this.previousResult !== null && this.inputHistory.length === 0) {
      // 이전 결과를 현재 수식의 시작값으로 설정
      this.inputHistory.push(`${this.previousResult}`);
    }

    // 연산자를 inputHistory에 추가
    this.inputHistory.push(`${op}`);
  }

  inputParenthesis(paren: string) {
    // PAREN 타입으로 캐스팅
    const p = paren as PAREN;

    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }
    if (p === PAREN.LEFT && this.inputHistory.length > 0) {
      const lastInput = this.inputHistory[this.inputHistory.length - 1];
      // 숫자나 오른쪽 괄호 다음에 왼쪽 괄호가 오면 곱셈 추가
      if (!isNaN(Number(lastInput)) || lastInput === PAREN.RIGHT) {
        this.inputHistory.push(OPERATORS.MULTIPLY);
      }
    }
    this.inputHistory.push(p);
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

    if (this.inputHistory.length === 0) {
      return 0;
    }

    try {
      const expression = this.inputHistory.join(" ");
      const calculator = BasicMathCalculatorFactory.create(expression.trim());
      const result = calculator.evaluate();

      this.previousResult = result; // 마지막 결과를 저장
      this.clearExpression(); // 수식 초기화 (하지만 이전 결과는 유지)

      return result;
    } catch (error) {
      console.error("Calculation error:", error);

      // Division by zero 예외 다시 throw
      if (
        error instanceof Error &&
        error.message.includes("Division by zero")
      ) {
        throw error;
      }

      // 다른 오류는 이전 상태 유지
      return this.previousResult ?? 0;
    }
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
