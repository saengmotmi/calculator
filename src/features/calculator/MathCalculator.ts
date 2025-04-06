import { Lexer } from "../../entities/lexer/Lexer";
import { Parser } from "../../entities/parser/Parser";
import { ExpressionProcessor } from "../../entities/processor/ExpressionProcessor";
import {
  Token,
  isLeftParenToken,
  isRightParenToken,
  isNumberToken,
  isOperatorToken,
} from "../../entities/tokens/Token";
import { Operator, OperatorType } from "../../entities/tokens/Operator";
import { ICalculator } from "./ICalculator";

/**
 * 계산기 클래스: 수식 처리와 계산을 담당
 */
export class MathCalculator implements ICalculator {
  private inputHistory: string[] = [];
  private currentInput: string = "";
  private previousResult: number | null = null;
  private parser: Parser;
  private processor: ExpressionProcessor;

  constructor() {
    this.parser = new Parser();
    this.processor = new ExpressionProcessor();
  }

  /**
   * 숫자 입력 처리
   */
  inputNumber(value: string | number): void {
    this.currentInput += `${value}`;
  }

  /**
   * 연산자 입력 처리
   */
  inputOperator(value: string | OperatorType): void {
    const opValue = value as OperatorType;

    // 음수 처리: '-'가 표현식 시작이거나 연산자/괄호 다음에 오는 경우
    if (
      opValue === OperatorType.MINUS &&
      (this.inputHistory.length === 0 ||
        this.isLastTokenOperator() ||
        this.isLastTokenLeftParenthesis())
    ) {
      if (this.currentInput) {
        this.inputHistory.push(this.currentInput);
        this.currentInput = "";
      }
      this.currentInput = "-";
      return;
    }

    // 현재 입력된 내용 처리
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    } else if (this.previousResult !== null && this.inputHistory.length === 0) {
      // 이전 결과를 현재 수식의 시작으로 사용
      this.inputHistory.push(`${this.previousResult}`);
    } else if (
      this.inputHistory.length === 0 &&
      opValue !== OperatorType.MINUS
    ) {
      // 수식이 비어있는데 연산자가 오면 0을 먼저 추가 (단, 음수는 제외)
      this.inputHistory.push("0");
    }

    this.inputHistory.push(opValue);
  }

  /**
   * 괄호 입력 처리
   */
  inputParenthesis(paren: string): void {
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }

    // 암시적 곱셈 처리 - 숫자 뒤에 왼쪽 괄호가 오는 경우
    if (paren === "(" && this.inputHistory.length > 0) {
      const lastToken = this.inputHistory[this.inputHistory.length - 1];
      // 숫자나 오른쪽 괄호 다음에 왼쪽 괄호가 오면 곱셈 추가
      if (!this.isLastTokenOperator() && lastToken !== "(") {
        this.inputHistory.push(OperatorType.MULTIPLY);
      }
    }

    this.inputHistory.push(paren);
  }

  /**
   * 수식 평가 및 결과 반환
   */
  evaluate(): number {
    // 현재 입력 저장
    if (this.currentInput) {
      this.inputHistory.push(this.currentInput);
      this.currentInput = "";
    }

    // 수식이 비어있으면 0 반환
    if (this.inputHistory.length === 0) {
      return 0;
    }

    try {
      // 수식 문자열 생성
      const expression = this.inputHistory.join(" ");
      console.log("Evaluating expression:", expression);

      // 파싱 및 평가
      const result = this.parser.parse(expression);
      console.log("Calculation result:", result);

      // 결과 저장 및 초기화
      this.previousResult = result;
      this.clearExpression();

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

  /**
   * 현재 수식만 초기화 (이전 결과는 유지)
   */
  clearExpression(): void {
    this.inputHistory = [];
    this.currentInput = "";
  }

  /**
   * 모든 상태 초기화 (이전 결과 포함)
   */
  clearAll(): void {
    this.clearExpression();
    this.previousResult = null;
  }

  /**
   * 마지막 입력 취소 (백스페이스)
   */
  undo(): void {
    if (this.currentInput) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.inputHistory.pop();
    }
  }

  /**
   * 현재 수식 문자열 반환
   */
  getExpression(): string {
    return [...this.inputHistory, this.currentInput].join(" ").trim();
  }

  /**
   * 마지막 토큰이 연산자인지 확인
   */
  private isLastTokenOperator(): boolean {
    if (this.inputHistory.length === 0) return false;
    const lastToken = this.inputHistory[this.inputHistory.length - 1];
    return Object.values(OperatorType).includes(lastToken as OperatorType);
  }

  /**
   * 마지막 토큰이 왼쪽 괄호인지 확인
   */
  private isLastTokenLeftParenthesis(): boolean {
    if (this.inputHistory.length === 0) return false;
    return this.inputHistory[this.inputHistory.length - 1] === "(";
  }
}
