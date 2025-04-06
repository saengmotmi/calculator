import { CalculatorCore } from "./CalculatorCore";
import { stateToString } from "./domain/CalculatorDomain";
import { CalculatorErrorType, CalculatorMode } from "./domain/CalculatorState";

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
 * 계산기 프레젠터
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
    if (state.mode === CalculatorMode.ERROR && state.error) {
      return {
        displayText: this.formatErrorMessage(
          state.error.type,
          state.error.details
        ),
        resultText: null,
        hasError: true,
        errorMessage: this.formatErrorMessage(
          state.error.type,
          state.error.details
        ),
        mode: "error",
      };
    }

    // 결과 상태 처리
    if (state.mode === CalculatorMode.RESULT && state.result !== null) {
      return {
        displayText: stateToString(state),
        resultText: this.formatResult(state.result),
        hasError: false,
        errorMessage: null,
        mode: "result",
      };
    }

    // 입력 상태 처리
    return {
      displayText: stateToString(state),
      resultText: null,
      hasError: false,
      errorMessage: null,
      mode: "input",
    };
  }

  /**
   * 결과 값 포맷팅 (대규모 숫자나 소수점 처리)
   */
  private formatResult(value: number): string {
    // 큰 숫자나 작은 숫자는 지수 표기법으로 변환
    if (Math.abs(value) > 1e15 || (Math.abs(value) < 1e-10 && value !== 0)) {
      return value.toExponential(10);
    }

    // 소수점 처리
    const valueStr = value.toString();
    if (valueStr.includes(".")) {
      // 소수점 이하 불필요한 0 제거
      return valueStr.replace(/\.?0+$/, "");
    }

    return valueStr;
  }

  /**
   * 에러 메시지 사용자 친화적 형식으로 변환
   */
  private formatErrorMessage(
    errorType: CalculatorErrorType,
    details: string
  ): string {
    switch (errorType) {
      case CalculatorErrorType.DIVISION_BY_ZERO:
        return "0으로 나눌 수 없습니다";
      case CalculatorErrorType.INCOMPLETE_EXPRESSION:
        return "식이 완성되지 않았습니다";
      case CalculatorErrorType.SYNTAX_ERROR:
        return "문법 오류입니다";
      default:
        return details || "계산 중 오류가 발생했습니다";
    }
  }
}
