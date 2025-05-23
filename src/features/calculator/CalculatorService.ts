import { CalculatorCore } from "../../core/calculator/CalculatorCore";
import { CalculatorEvent } from "../../core/calculator/domain/CalculatorEvent";
import { CalculatorState } from "../../core/calculator/domain/CalculatorState";

/**
 * 계산기 비즈니스 로직 서비스
 * 순수한 비즈니스 로직만 담당 (표현 로직 제외)
 */
export class CalculatorService {
  private core: CalculatorCore;

  constructor() {
    this.core = new CalculatorCore();
  }

  /**
   * 현재 도메인 상태 반환
   */
  getState(): CalculatorState {
    return this.core.getState();
  }

  /**
   * 계산기 이벤트 처리
   */
  dispatch(event: CalculatorEvent): void {
    this.core.apply(event);
  }

  /**
   * 통합 입력 처리
   */
  input(value: string): void {
    if (!isNaN(Number(value))) {
      this.dispatch({ type: "DIGIT_INPUT", digit: value });
    } else if (value === "(" || value === ")") {
      this.dispatch({ type: "PARENTHESIS_INPUT", parenthesis: value });
    } else {
      this.dispatch({ type: "OPERATOR_INPUT", operator: value });
    }
  }

  /**
   * 계산 실행
   */
  calculate(): void {
    this.dispatch({ type: "CALCULATE" });
  }

  /**
   * 모든 상태 초기화
   */
  clear(): void {
    this.dispatch({ type: "CLEAR_ALL" });
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    this.dispatch({ type: "BACKSPACE" });
  }
}
