import { CalculatorCore } from "./CalculatorCore";
import { CalculatorMode } from "./CalculatorState";

/**
 * UI 디스플레이 데이터 인터페이스
 */
export interface CalculatorDisplayData {
  /** 화면에 표시할 수식 텍스트 */
  displayText: string;
  /** 계산 결과 (있는 경우) */
  resultText: string | null;
  /** 에러 상태 여부 */
  hasError: boolean;
  /** 에러 메시지 (있는 경우) */
  errorMessage: string | null;
}

/**
 * 계산기 프레젠터
 * 도메인 모델과 UI 사이의 변환을 담당
 */
export class CalculatorPresenter {
  constructor(private core: CalculatorCore) {}

  /**
   * UI 표시를 위한 데이터 반환
   */
  getDisplayData(): CalculatorDisplayData {
    const state = this.core.getState();

    // 에러 상태 처리
    if (state.mode === CalculatorMode.ERROR) {
      return {
        displayText: "오류",
        resultText: null,
        hasError: true,
        errorMessage: this.formatErrorMessage(state.error),
      };
    }

    // 표현식과 결과 포맷팅
    const expressionText = state.expression ? state.expression.toString() : "0";

    return {
      displayText: expressionText,
      resultText:
        state.result !== null ? this.formatResult(state.result) : null,
      hasError: false,
      errorMessage: null,
    };
  }

  /**
   * 결과 값 포맷팅
   */
  private formatResult(value: number): string {
    // 큰 숫자나 작은 숫자는 지수 표기법으로 변환
    if (Math.abs(value) > 1e15 || (Math.abs(value) < 1e-10 && value !== 0)) {
      return value.toExponential(10);
    }

    // 소수점 처리
    return value.toString();
  }

  /**
   * 에러 메시지 포맷팅 및 번역
   */
  private formatErrorMessage(error: string | null): string {
    if (!error) return "알 수 없는 오류";

    // 도메인 에러 메시지를 사용자 친화적 메시지로 변환
    if (error.includes("Division by zero")) {
      return "0으로 나눌 수 없습니다";
    }

    return error;
  }
}
