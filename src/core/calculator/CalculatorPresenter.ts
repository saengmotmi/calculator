import { CalculatorCore } from "./CalculatorCore";
import {
  CalculatorErrorType,
  CalculatorMode,
  CalculatorState,
} from "./domain/CalculatorState";
import { BigNumber } from "./algorithms/BigNumber";

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
  if (state.mode === CalculatorMode.ERROR && state.error) {
    return `Error: ${state.error.details}`;
  }

  // 결과 상태인 경우 결과값 반환
  if (state.mode === CalculatorMode.RESULT && state.result !== null) {
    return state.result.toString();
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
 * BigNumber를 사용하여 정확한 계산 수행
 * 문자열로 된 숫자와 연산자를 받아 정확한 계산 결과를 반환
 */
export function formatResultWithBigInt(
  num1: string,
  operator?: string,
  num2?: string
): string {
  // 단일 숫자 포맷 (연산자 없음)
  if (!operator || !num2) {
    return BigNumber.from(num1).toString();
  }

  // BigNumber 클래스의 정적 메서드로 계산 위임
  return BigNumber.calculate(num1, operator, num2);
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

      // 표시할 결과 값 포맷팅
      const displayText = stateToString(state);

      // 안전한 정수 범위를 벗어나는 큰 숫자인 경우 BigInt 포맷팅 사용
      if (Math.abs(state.result) > Number.MAX_SAFE_INTEGER) {
        try {
          const resultText = formatResultWithBigInt(displayText);
          return {
            displayText: resultText,
            resultText,
            hasError: false,
            errorMessage: null,
            mode: "result",
          };
        } catch (e) {
          // BigInt 변환 실패 시 일반 포맷팅으로 계속 진행
        }
      }

      const resultText = this.formatResult(state.result);
      return {
        displayText,
        resultText,
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
    // 0인 경우 그대로 반환
    if (value === 0) return "0";

    const valueStr = value.toString();

    // 큰 숫자이거나 정수인 경우 BigNumber 사용
    if (Number.isInteger(value) || Math.abs(value) > 1e10) {
      try {
        return BigNumber.from(valueStr).toString();
      } catch (e) {
        // BigNumber 처리 실패 시 일반 방식으로 계속 진행
      }
    }

    // 지수 표기법 사용 여부 결정
    if (Math.abs(value) > 1e15 || Math.abs(value) < 1e-10) {
      return value.toExponential(10).replace(/\.?0+e/, "e");
    }

    // 소수점 있는 일반 숫자는 정밀도 조정 (부동소수점 오차 처리)
    if (valueStr.includes(".")) {
      try {
        // BigNumber로 정확하게 표현
        return BigNumber.from(valueStr).toString();
      } catch (e) {
        // 실패 시 기존 방식 사용
        const precision = 15;
        const formattedNumber = parseFloat(
          value.toPrecision(precision)
        ).toString();
        return formattedNumber.replace(/\.?0+$/, "");
      }
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
