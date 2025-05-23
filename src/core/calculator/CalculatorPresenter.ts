import { CalculatorCore } from "./CalculatorCore";
import { CalculatorStatus, CalculatorState } from "./domain/CalculatorState";

/**
 * UI 디스플레이 데이터 인터페이스
 * UI 컴포넌트가 표시에 필요한 모든 데이터 포함
 */
export interface CalculatorDisplayData {
  /** 계산기 화면에 표시할 텍스트 */
  displayText: string;
  /** 계산 결과 텍스트 */
  resultText: string | null;
  /** 에러 발생 여부 */
  hasError: boolean;
  /** 에러 메시지 (사용자 친화적 형식) */
  errorMessage: string | null;
  /** 계산기 상태 (UI 상태 관리용) */
  mode: "input" | "result" | "error";
}

/**
 * 도메인 상태를 UI 표시용 문자열로 변환
 * 프레젠테이션 로직: 도메인 상태를 사용자가 볼 수 있는 형태로 변환
 */
export function stateToString(state: CalculatorState): string {
  // 에러 상태인 경우 에러 메시지 반환
  if (state.status === CalculatorStatus.ERROR && state.errorMessage) {
    return `Error: ${state.errorMessage}`;
  }

  // 결과 상태인 경우 결과값 반환
  if (state.status === CalculatorStatus.RESULT && state.result !== null) {
    return state.result;
  }

  // 결과 값이 있는 토큰이 하나인 경우 (백스페이스 처리 후)
  if (
    state.tokens.length === 1 &&
    state.tokens[0].type === "NUMBER" &&
    state.currentInput === ""
  ) {
    return state.tokens[0].value;
  }

  // 빈 상태(토큰과 입력이 없는 경우) "0" 반환 - UI 표현 규칙
  if (state.tokens.length === 0 && state.currentInput === "") {
    return "0";
  }

  // 입력 상태에서는 토큰과 현재 입력을 결합
  let expression = "";

  // 토큰이 있으면 토큰 문자열 구성
  if (state.tokens.length > 0) {
    // UI 표현을 위한 공백 추가 - 도메인 로직과 무관한 표현 형식
    expression = state.tokens.map((token) => token.value).join(" ");
  }

  // 현재 입력이 있으면 추가 (UI 표현을 위한 공백 처리)
  if (state.currentInput) {
    expression = expression
      ? `${expression} ${state.currentInput}`
      : state.currentInput;
  }

  return expression;
}

/**
 * 계산기 프레젠터 (단순화된 버전)
 * 도메인 상태를 UI 표시 형식으로 변환하는 책임만 담당
 */
export class CalculatorPresenter {
  constructor(private core: CalculatorCore) {}

  /**
   * 도메인 상태를 UI 표시용 데이터로 변환
   */
  getDisplayData(): CalculatorDisplayData {
    const state = this.core.getState();

    // 에러 상태 처리
    if (state.status === CalculatorStatus.ERROR && state.errorMessage) {
      return {
        displayText: state.errorMessage,
        resultText: null,
        hasError: true,
        errorMessage: state.errorMessage,
        mode: "error",
      };
    }

    // 결과 상태 처리
    if (state.status === CalculatorStatus.RESULT && state.result !== null) {
      return {
        displayText: state.result,
        resultText: state.result,
        hasError: false,
        errorMessage: null,
        mode: "result",
      };
    }

    // 입력 상태 처리
    const displayText = stateToString(state);
    return {
      displayText,
      resultText: null,
      hasError: false,
      errorMessage: null,
      mode: "input",
    };
  }
}
