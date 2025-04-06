import { CalculatorEvent } from "./domain/CalculatorEvent";
import {
  applyBackspace,
  applyDigitInput,
  applyOperatorInput,
  applyParenthesisInput,
  clearExpression,
  evaluateExpression,
} from "./domain/CalculatorDomain";
import {
  CalculatorState,
  initialCalculatorState,
} from "./domain/CalculatorState";

/**
 * 계산기 도메인 핵심 클래스
 * 모든 외부 의존성과 UI 관심사에서 완전히 독립적
 */
export class CalculatorCore {
  private state: CalculatorState;

  constructor() {
    this.state = { ...initialCalculatorState };
  }

  /**
   * 이벤트 적용으로 상태 변경
   */
  apply(event: CalculatorEvent): void {
    this.state = this.reduceState(this.state, event);
  }

  /**
   * 현재 상태 반환 (읽기 전용 복사본)
   */
  getState(): Readonly<CalculatorState> {
    return { ...this.state };
  }

  /**
   * 이벤트에 따른 상태 변경 함수
   * 순수 함수로, 같은 입력에 대해 항상 같은 출력 반환
   */
  private reduceState(
    state: CalculatorState,
    event: CalculatorEvent
  ): CalculatorState {
    switch (event.type) {
      case "DIGIT_INPUT":
        return applyDigitInput(state, event.digit);

      case "OPERATOR_INPUT":
        return applyOperatorInput(state, event.operator);

      case "PARENTHESIS_INPUT":
        return applyParenthesisInput(state, event.parenthesis);

      case "CALCULATE":
        return evaluateExpression(state);

      case "BACKSPACE":
        return applyBackspace(state);

      case "CLEAR_EXPRESSION":
        return clearExpression(state);

      case "CLEAR_ALL":
        return { ...initialCalculatorState };

      default:
        // 타입 체크를 위한 never 체크
        const _exhaustiveCheck: never = event;
        return state;
    }
  }
}
