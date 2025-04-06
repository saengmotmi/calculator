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
 * BigInt를 사용하여 대규모 정수 계산 처리
 * 문자열로 된 숫자와 연산자를 받아 정확한 계산 결과를 반환
 */
export function formatResultWithBigInt(
  num1: string,
  operator?: string,
  num2?: string
): string {
  // 단일 숫자 포맷 (연산자 없음)
  if (!operator || !num2) {
    // 소수점이 있는 경우 BigInt를 사용할 수 없음
    if (num1.includes(".")) {
      return num1;
    }

    try {
      // BigInt 변환 후 다시 문자열로 (정확한 정수 표현)
      const bigNum = BigInt(num1);
      return bigNum.toString();
    } catch (e) {
      // 변환 실패 시 원본 반환
      return num1;
    }
  }

  // 소수점 처리를 위한 변수들
  let hasFraction = false;
  let decimalPlaces1 = 0;
  let decimalPlaces2 = 0;

  // 소수점 위치 파악
  if (num1.includes(".")) {
    hasFraction = true;
    decimalPlaces1 = num1.split(".")[1].length;
    num1 = num1.replace(".", "");
  }

  if (num2.includes(".")) {
    hasFraction = true;
    decimalPlaces2 = num2.split(".")[1].length;
    num2 = num2.replace(".", "");
  }

  try {
    // BigInt로 변환
    const bigNum1 = BigInt(num1);
    const bigNum2 = BigInt(num2);
    let result: bigint;

    // 연산 수행
    switch (operator) {
      case "+":
        // 소수점 위치 정규화
        if (hasFraction) {
          const maxDecimals = Math.max(decimalPlaces1, decimalPlaces2);
          const factor1 = BigInt(10 ** (maxDecimals - decimalPlaces1));
          const factor2 = BigInt(10 ** (maxDecimals - decimalPlaces2));
          result = bigNum1 * factor1 + bigNum2 * factor2;
          return formatBigIntWithFraction(result, maxDecimals);
        }
        result = bigNum1 + bigNum2;
        break;

      case "-":
        if (hasFraction) {
          const maxDecimals = Math.max(decimalPlaces1, decimalPlaces2);
          const factor1 = BigInt(10 ** (maxDecimals - decimalPlaces1));
          const factor2 = BigInt(10 ** (maxDecimals - decimalPlaces2));
          result = bigNum1 * factor1 - bigNum2 * factor2;
          return formatBigIntWithFraction(result, maxDecimals);
        }
        result = bigNum1 - bigNum2;
        break;

      case "*":
        const totalDecimalPlaces = decimalPlaces1 + decimalPlaces2;
        result = bigNum1 * bigNum2;
        if (hasFraction) {
          return formatBigIntWithFraction(result, totalDecimalPlaces);
        }
        break;

      case "/":
        if (bigNum2 === BigInt(0)) {
          return "Error: Division by zero";
        }

        // 나눗셈은 특별 처리 필요 (BigInt는 소수점을 지원하지 않음)
        // 정밀한 소수점 표현을 위해 스케일 업
        const precision = 20; // 소수점 이하 자릿수
        const scaleFactor = BigInt(10 ** precision);
        const scaledNum = bigNum1 * scaleFactor;
        const quotient = scaledNum / bigNum2;

        // 소수점 표현을 위한 문자열 처리
        const quotientStr = quotient.toString();
        const integerPart = quotientStr.slice(
          0,
          Math.max(0, quotientStr.length - precision)
        );
        const fractionalPart = quotientStr
          .slice(-precision)
          .padStart(precision, "0");

        // 불필요한 0 제거
        const trimmedFractional = fractionalPart.replace(/0+$/, "");

        return trimmedFractional.length > 0
          ? `${integerPart || "0"}.${trimmedFractional}`
          : integerPart || "0";

      default:
        return "Error: Unknown operator";
    }

    return result.toString();
  } catch (e) {
    return `Error: ${e instanceof Error ? e.message : "Calculation error"}`;
  }
}

/**
 * BigInt 값을 소수점이 있는 형식으로 포맷팅
 */
function formatBigIntWithFraction(
  value: bigint,
  decimalPlaces: number
): string {
  const valueStr = value.toString();

  if (decimalPlaces <= 0) {
    return valueStr;
  }

  if (valueStr.length <= decimalPlaces) {
    // 소수점 앞에 0을 추가해야 하는 경우
    const padded = valueStr.padStart(decimalPlaces + 1, "0");
    return `0.${padded.slice(1)}`;
  }

  // 소수점 위치 계산
  const integerPartLength = valueStr.length - decimalPlaces;
  const integerPart = valueStr.slice(0, integerPartLength);
  const fractionalPart = valueStr.slice(integerPartLength);

  // 불필요한 0 제거
  const trimmedFractional = fractionalPart.replace(/0+$/, "");

  return trimmedFractional.length > 0
    ? `${integerPart}.${trimmedFractional}`
    : integerPart;
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

    // 문자열 변환
    const valueStr = value.toString();

    // 정수이고 안전한 정수 범위를 벗어나는 경우 BigInt 사용
    if (
      Number.isInteger(value) &&
      (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)
    ) {
      try {
        return formatResultWithBigInt(valueStr);
      } catch (e) {
        // BigInt 처리 실패시 일반 방식으로 계속 진행
      }
    }

    // 매우 큰 숫자나 매우 작은 숫자는 지수 표기법으로 변환
    if (Math.abs(value) > 1e15 || Math.abs(value) < 1e-10) {
      return value.toExponential(10).replace(/\.?0+e/, "e");
    }

    // 정수인지 확인
    if (Number.isInteger(value)) {
      // 정수는 그대로 문자열로 변환
      return valueStr;
    }

    // 소수점 있는 숫자의 경우 정밀도 조정
    // 1. 적절한 정밀도로 변환 (15자리 정도가 안전)
    // 2. 문자열로 변환 후 불필요한 0 제거
    const precision = 15;
    const formattedNumber = parseFloat(value.toPrecision(precision)).toString();

    // 소수점 이하 불필요한 0 제거
    return formattedNumber.replace(/\.?0+$/, "");
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
