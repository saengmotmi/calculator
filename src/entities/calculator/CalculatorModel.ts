import { Expression } from "../expression/Expression";
import { Parser } from "../parser/Parser";
import { OperatorType } from "../tokens/OperatorType";
import { NumberToken } from "../tokens/Token";
import {
  CalculatorMode,
  CalculatorState,
  initialCalculatorState,
} from "./CalculatorState";

/**
 * 계산기의 핵심 도메인 모델
 * 모든 계산기 로직과 상태 관리를 캡슐화합니다.
 */
export class CalculatorModel {
  private expression: Expression;
  private state: CalculatorState;
  private parser: Parser;

  constructor() {
    this.expression = new Expression();
    this.state = { ...initialCalculatorState };
    this.parser = new Parser();
  }

  /**
   * 현재 계산기 상태를 반환합니다.
   */
  getState(): CalculatorState {
    return { ...this.state };
  }

  /**
   * 입력 처리 통합 메서드 - 모든 유형의 입력을 하나의 진입점에서 처리
   */
  input(value: string): void {
    // 에러 상태면 초기화
    if (this.state.error) {
      this.clearAll();
    }

    if (this.state.mode === CalculatorMode.RESULT) {
      // 결과 상태에서의 다음 입력 처리
      if (!isNaN(Number(value))) {
        // 결과 후 숫자 입력 시 새 식 시작
        this.clearExpression();
        this.inputNumber(value);
      } else if (Object.values(OperatorType).includes(value as OperatorType)) {
        // 결과 후 연산자 입력 시 결과를 활용
        this.inputOperator(value);
      } else if (value === "(" || value === ")") {
        // 결과 후 괄호 입력
        if (value === "(") {
          // 열린 괄호는 새 계산 시작
          this.clearExpression();
        }
        this.inputParenthesis(value);
      }
    } else {
      // 일반 입력 상태에서의 처리
      if (!isNaN(Number(value))) {
        this.inputNumber(value);
      } else if (Object.values(OperatorType).includes(value as OperatorType)) {
        this.inputOperator(value);
      } else if (value === "(" || value === ")") {
        this.inputParenthesis(value);
      }
    }

    // 상태 업데이트
    this.updateState();
  }

  /**
   * 숫자 입력 처리
   */
  private inputNumber(value: string): void {
    this.expression = this.expression.withNumberInput(value);
  }

  /**
   * 연산자 입력 처리
   */
  private inputOperator(value: string): void {
    // 결과 후 연산자 입력 시 결과를 사용
    if (
      this.state.mode === CalculatorMode.RESULT &&
      this.state.result !== null
    ) {
      this.expression = new Expression(
        [new NumberToken(this.state.result.toString())],
        "",
        null
      );
    }

    this.expression = this.expression.withOperatorInput(value);
    this.state.mode = CalculatorMode.INPUT; // 연산자 입력 후에는 항상 입력 모드
  }

  /**
   * 괄호 입력 처리
   */
  private inputParenthesis(paren: string): void {
    // 결과 후 괄호 입력 시 적절히 처리
    if (
      paren === ")" &&
      this.state.mode === CalculatorMode.RESULT &&
      this.state.result !== null
    ) {
      this.expression = new Expression(
        [new NumberToken(this.state.result.toString())],
        "",
        null
      );
    }

    this.expression = this.expression.withParenthesisInput(paren);
    this.state.mode = CalculatorMode.INPUT;
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    // 결과 상태에서의 백스페이스는 입력 모드로 전환하되 결과 값은 유지
    if (this.state.mode === CalculatorMode.RESULT) {
      this.state.mode = CalculatorMode.INPUT;
      this.updateState();
      return;
    }

    this.expression = this.expression.withLastCharRemoved();
    this.updateState();
  }

  /**
   * 현재 수식만 초기화 (이전 결과는 유지)
   */
  clearExpression(): void {
    this.expression = this.expression.withClearedExpression();
    this.state.mode = CalculatorMode.INPUT;
    this.updateState();
  }

  /**
   * 모든 상태 초기화
   */
  clearAll(): void {
    this.expression = this.expression.cleared();
    this.state = { ...initialCalculatorState };
  }

  /**
   * 수식 계산 및 결과 설정
   */
  calculate(): void {
    try {
      const tokens = this.expression.getTokens();

      if (tokens.length === 0) {
        this.state.result = 0;
        this.state.mode = CalculatorMode.RESULT;
        this.updateState();
        return;
      }

      // 파서를 통한 계산
      const result = this.parser.parseTokens([...tokens]);

      // 결과 저장
      this.state.result = result;
      this.state.mode = CalculatorMode.RESULT;

      // 수식 업데이트 (결과 값으로 설정)
      this.expression = this.expression.withCalculationResult(result);

      this.updateState();
    } catch (error) {
      // 오류 처리
      if (error instanceof Error) {
        this.state.error = error.message;
        if (error.message.includes("Division by zero")) {
          this.state.error = "0으로 나눌 수 없습니다";
        }
      } else {
        this.state.error = "계산 중 오류가 발생했습니다";
      }

      this.updateState();
    }
  }

  /**
   * 상태 일관성 유지를 위한 업데이트 메서드
   */
  private updateState(): void {
    this.state.expression = this.expression.toString();

    // 오류가 있으면 표현식에 오류 표시
    if (this.state.error) {
      this.state.expression = this.state.error;
    }
  }
}
