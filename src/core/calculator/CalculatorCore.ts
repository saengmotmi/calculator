import { Expression } from "../../entities/expression/Expression";
import { Parser } from "../../entities/parser/Parser";
import { NumberToken } from "../../entities/tokens/Token";
import { CalculatorEvent } from "./CalculatorEvent";
import {
  CalculatorMode,
  CalculatorState,
  initialCalculatorState,
} from "./CalculatorState";

/**
 * 계산기 도메인 핵심 모델
 * 모든 UI 및 입출력 형식에서 독립적인 순수한 도메인 로직 캡슐화
 */
export class CalculatorCore {
  private state: CalculatorState;
  private parser: Parser;

  constructor() {
    // Expression 객체 생성 및 초기 상태 설정
    this.state = {
      ...initialCalculatorState,
      expression: new Expression(),
    };
    this.parser = new Parser();
  }

  /**
   * 도메인 이벤트 처리
   * 모든 계산기 조작은 추상화된 이벤트로 처리
   */
  apply(event: CalculatorEvent): void {
    // 에러 상태면 CLEAR_ALL 이벤트만 처리
    if (
      this.state.mode === CalculatorMode.ERROR &&
      event.type !== "CLEAR_ALL"
    ) {
      return;
    }

    switch (event.type) {
      case "DIGIT_INPUT":
        this.handleDigitInput(event.digit);
        break;
      case "OPERATOR_INPUT":
        this.handleOperatorInput(event.operator);
        break;
      case "PARENTHESIS_INPUT":
        this.handleParenthesisInput(event.parenthesis);
        break;
      case "CALCULATE":
        this.handleCalculate();
        break;
      case "BACKSPACE":
        this.handleBackspace();
        break;
      case "CLEAR_EXPRESSION":
        this.handleClearExpression();
        break;
      case "CLEAR_ALL":
        this.handleClearAll();
        break;
    }
  }

  /**
   * 현재 상태 반환 (불변 객체로 반환)
   */
  getState(): CalculatorState {
    // 상태를 복제하여 반환 (외부 수정 방지)
    return { ...this.state };
  }

  /**
   * 숫자 입력 처리
   */
  private handleDigitInput(digit: string): void {
    // 결과 상태에서 숫자 입력 시 새 식 시작
    if (this.state.mode === CalculatorMode.RESULT) {
      this.state.expression = new Expression();
      this.state.mode = CalculatorMode.INPUT;
    }

    // 표현식에 숫자 추가
    this.state.expression = (
      this.state.expression as Expression
    ).withNumberInput(digit);
  }

  /**
   * 연산자 입력 처리
   */
  private handleOperatorInput(operator: string): void {
    // 결과 상태에서 연산자 입력 시 이전 결과 활용
    if (
      this.state.mode === CalculatorMode.RESULT &&
      this.state.result !== null
    ) {
      this.state.expression = new Expression(
        [new NumberToken(this.state.result.toString())],
        "",
        null
      );
    }

    // 표현식에 연산자 추가
    this.state.expression = (
      this.state.expression as Expression
    ).withOperatorInput(operator);
    this.state.mode = CalculatorMode.INPUT;
  }

  /**
   * 괄호 입력 처리
   */
  private handleParenthesisInput(parenthesis: string): void {
    // 결과 상태에서 괄호 입력 처리
    if (this.state.mode === CalculatorMode.RESULT) {
      if (parenthesis === "(") {
        // 여는 괄호는 새 계산 시작
        this.state.expression = new Expression();
      } else if (this.state.result !== null) {
        // 닫는 괄호는 이전 결과 활용
        this.state.expression = new Expression(
          [new NumberToken(this.state.result.toString())],
          "",
          null
        );
      }
    }

    // 표현식에 괄호 추가
    this.state.expression = (
      this.state.expression as Expression
    ).withParenthesisInput(parenthesis);
    this.state.mode = CalculatorMode.INPUT;
  }

  /**
   * 계산 실행
   */
  private handleCalculate(): void {
    try {
      const tokens = (this.state.expression as Expression).getTokens();

      // 빈 수식이면 0 반환
      if (tokens.length === 0) {
        this.state.result = 0;
        this.state.mode = CalculatorMode.RESULT;
        return;
      }

      // 파서로 계산 수행
      const result = this.parser.parseTokens([...tokens]);

      // 결과 저장 및 상태 업데이트
      this.state.result = result;
      this.state.expression = (
        this.state.expression as Expression
      ).withCalculationResult(result);
      this.state.mode = CalculatorMode.RESULT;
    } catch (error) {
      // 오류 처리 (도메인 오류 코드 사용)
      this.state.error = error instanceof Error ? error.message : "계산 오류";
      this.state.mode = CalculatorMode.ERROR;
    }
  }

  /**
   * 백스페이스 처리
   */
  private handleBackspace(): void {
    // 결과 상태에서 백스페이스는 입력 모드로 전환
    if (this.state.mode === CalculatorMode.RESULT) {
      this.state.mode = CalculatorMode.INPUT;
      return;
    }

    // 표현식에서 마지막 문자 제거
    this.state.expression = (
      this.state.expression as Expression
    ).withLastCharRemoved();
  }

  /**
   * 현재 수식만 초기화
   */
  private handleClearExpression(): void {
    this.state.expression = (
      this.state.expression as Expression
    ).withClearedExpression();
    this.state.mode = CalculatorMode.INPUT;
  }

  /**
   * 모든 상태 초기화
   */
  private handleClearAll(): void {
    this.state = {
      ...initialCalculatorState,
      expression: new Expression(),
    };
  }
}
