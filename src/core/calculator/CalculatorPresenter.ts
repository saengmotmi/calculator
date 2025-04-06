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
  // 백스페이스 상태 추적을 위한 변수
  private lastInputState: { tokens: string; input: string } | null = null;

  constructor(private core: CalculatorCore) {}

  /**
   * 도메인 상태를 UI 표시용 데이터로 변환
   */
  getDisplayData(): CalculatorDisplayData {
    const state = this.core.getState();

    // 에러 상태 처리
    if (state.mode === CalculatorMode.ERROR && state.error) {
      // 에러 발생 시 입력 상태 초기화
      this.lastInputState = null;

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
      // 결과가 나오면 입력 상태 초기화
      this.lastInputState = null;

      return {
        displayText: stateToString(state),
        resultText: this.formatResult(state.result),
        hasError: false,
        errorMessage: null,
        mode: "result",
      };
    }

    // 현재 상태의 표현식 문자열
    const displayText = stateToString(state);

    // 입력 상태의 요약 (tokens 내용과 currentInput)
    const currentStateSnapshot = {
      tokens: state.tokens.map((t) => t.value).join(""),
      input: state.currentInput,
    };

    // 백스페이스 감지 및 특수 디스플레이 로직
    if (this.lastInputState) {
      const { tokens: prevTokens, input: prevInput } = this.lastInputState;

      // 이전 상태보다 내용이 줄어든 경우 (백스페이스로 간주)
      const tokensRemoved =
        prevTokens.length > currentStateSnapshot.tokens.length;
      const inputRemoved = prevInput.length > currentStateSnapshot.input.length;

      if (tokensRemoved || inputRemoved) {
        // 패턴 1: 마지막 숫자의 한 자리를 지우는 경우
        const isLastDigitRemoved = this.isLastDigitRemovalPattern(
          prevTokens,
          currentStateSnapshot.tokens
        );
        if (isLastDigitRemoved) {
          this.lastInputState = currentStateSnapshot;
          return {
            displayText: currentStateSnapshot.tokens,
            resultText: null,
            hasError: false,
            errorMessage: null,
            mode: "input",
          };
        }

        // 패턴 2: 한 자리 숫자를 완전히 지우는 경우 -> 0 표시
        if (
          this.isSingleDigitRemovedPattern(
            prevTokens,
            prevInput,
            currentStateSnapshot
          )
        ) {
          this.lastInputState = currentStateSnapshot;
          return {
            displayText: "0",
            resultText: null,
            hasError: false,
            errorMessage: null,
            mode: "input",
          };
        }
      }
    }

    // 현재 상태 저장
    this.lastInputState = currentStateSnapshot;

    // 일반 입력 상태 처리
    return {
      displayText,
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

  /**
   * 마지막 숫자의 한 자리를 지우는 패턴인지 확인
   * 예: "12" -> "1", "123" -> "12"
   */
  private isLastDigitRemovalPattern(
    prevTokens: string,
    currentTokens: string
  ): boolean {
    // 1. 현재 토큰이 비어있지 않아야 함
    if (!currentTokens) return false;

    // 2. 이전 토큰이 현재 토큰보다 길어야 함
    if (prevTokens.length <= currentTokens.length) return false;

    // 3. 이전 토큰의 처음부터 현재 토큰 길이까지가 현재 토큰과 일치해야 함
    return (
      prevTokens.startsWith(currentTokens) &&
      prevTokens.length === currentTokens.length + 1
    );
  }

  /**
   * 한 자리 숫자를 완전히 지우는 패턴인지 확인
   * 예: "1" -> "", 입력 "1" -> ""
   */
  private isSingleDigitRemovedPattern(
    prevTokens: string,
    prevInput: string,
    currentStateSnapshot: { tokens: string; input: string }
  ): boolean {
    // 현재 상태가 빈 상태여야 함
    const isEmpty =
      currentStateSnapshot.tokens === "" && currentStateSnapshot.input === "";
    if (!isEmpty) return false;

    // 이전 토큰이 한 자리 숫자였거나, 이전 입력이 한 자리 숫자였을 경우
    const wasSingleDigit =
      (prevTokens.length === 1 && /^\d$/.test(prevTokens)) ||
      (prevInput.length === 1 && /^\d$/.test(prevInput));

    return wasSingleDigit;
  }
}
