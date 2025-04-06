import {
  BackspaceOperation,
  ClearOperation,
  NumberInputOperation,
  OperatorInputOperation,
  ParenthesisInputOperation,
} from "../../entities/expression/EditOperation";
import { Expression } from "../../entities/expression/Expression";
import { Parser } from "../../entities/parser/Parser";
import { OperatorType } from "../../entities/tokens/OperatorType";
import { ICalculator } from "./ICalculator";

/**
 * 계산기 클래스: 수식 처리와 계산을 담당
 */
export class MathCalculator implements ICalculator {
  private expression: Expression = new Expression();
  private previousResult: number | null = null;
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  /**
   * 숫자 입력 처리
   */
  inputNumber(value: string | number): void {
    const operation = new NumberInputOperation(`${value}`);
    this.expression = operation.apply(this.expression);
  }

  /**
   * 연산자 입력 처리
   */
  inputOperator(value: string | OperatorType): void {
    const operation = new OperatorInputOperation(value as string);
    this.expression = operation.apply(this.expression);
  }

  /**
   * 괄호 입력 처리
   */
  inputParenthesis(paren: string): void {
    const operation = new ParenthesisInputOperation(paren);
    this.expression = operation.apply(this.expression);
  }

  /**
   * 수식 평가 및 결과 반환
   */
  evaluate(): number {
    const tokens = this.expression.getTokens();

    // 수식이 비어있으면 0 반환
    if (tokens.length === 0) {
      return 0;
    }

    try {
      // 토큰 배열을 직접 Parser에 전달하여 평가
      const result = this.parser.parseTokens([...tokens]);

      // 결과 저장
      this.previousResult = result;

      // 계산 수행 후 식을 초기화하고 결과를 저장
      this.expression = this.expression.withCalculationResult(result);

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
    this.expression = this.expression.withClearedExpression();
  }

  /**
   * 모든 상태 초기화 (이전 결과 포함)
   */
  clearAll(): void {
    const operation = new ClearOperation();
    this.expression = operation.apply(this.expression);
    this.previousResult = null;
  }

  /**
   * 마지막 입력 취소 (백스페이스)
   */
  undo(): void {
    const operation = new BackspaceOperation();
    this.expression = operation.apply(this.expression);
  }

  /**
   * 현재 수식 문자열 반환
   */
  getExpression(): string {
    return this.expression.toString();
  }
}
