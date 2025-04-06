/**
 * 계산기에서 사용하는 계산 알고리즘
 * 표준 계산과 정밀 계산 로직을 캡슐화합니다.
 * 도메인에 독립적인 순수 알고리즘 구현
 */
import { Token } from "../domain/CalculatorState";
import { BigNumber } from "./BigNumber";

/**
 * 계산 알고리즘에서 발생할 수 있는 오류
 */
export enum CalculationError {
  DIVISION_BY_ZERO = "DIVISION_BY_ZERO",
  INCOMPLETE_EXPRESSION = "INCOMPLETE_EXPRESSION",
  INVALID_OPERATOR = "INVALID_OPERATOR",
  OVERFLOW = "OVERFLOW",
}

/**
 * 알고리즘 오류 정보 타입
 */
export interface CalculationErrorInfo {
  type: CalculationError;
  details: string;
}

/**
 * 연산자 적용 처리
 * @throws {CalculationErrorInfo} 계산 중 오류 발생 시
 */
export function applyOperator(a: number, b: number, operator: string): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw {
          type: CalculationError.DIVISION_BY_ZERO,
          details: "Division by zero",
        } as CalculationErrorInfo;
      }
      return a / b;
    default:
      throw {
        type: CalculationError.INVALID_OPERATOR,
        details: `Unknown operator: ${operator}`,
      } as CalculationErrorInfo;
  }
}

/**
 * 정밀 계산이 필요한지 확인
 */
export function shouldUsePreciseCalculation(tokens: Token[]): boolean {
  // 큰 숫자 확인
  const hasLargeNumbers = tokens.some((token) => {
    if (token.type === "NUMBER") {
      const num = Number(token.value);
      return Math.abs(num) > 1e10 || token.value.length > 15;
    }
    return false;
  });

  // 나눗셈 연산 확인
  const hasDivision = tokens.some(
    (token) => token.type === "OPERATOR" && token.value === "/"
  );

  return hasLargeNumbers || hasDivision;
}

/**
 * 일반 계산 수행 (작은 숫자, 정수 계산)
 * @throws {CalculationErrorInfo} 계산 중 오류 발생 시
 */
export function calculateStandard(postfixTokens: Token[]): number {
  const valueStack: number[] = [];

  for (const token of postfixTokens) {
    if (token.type === "NUMBER") {
      valueStack.push(Number(token.value));
    } else if (token.type === "OPERATOR") {
      if (valueStack.length < 2) {
        throw {
          type: CalculationError.INCOMPLETE_EXPRESSION,
          details: "Invalid expression",
        } as CalculationErrorInfo;
      }
      const b = valueStack.pop()!;
      const a = valueStack.pop()!;

      valueStack.push(applyOperator(a, b, token.value));
    }
  }

  if (valueStack.length !== 1) {
    throw {
      type: CalculationError.INCOMPLETE_EXPRESSION,
      details: "Invalid expression",
    } as CalculationErrorInfo;
  }

  return valueStack[0];
}

/**
 * 정밀 계산 수행 (큰 숫자, 나눗셈 등)
 * @throws {CalculationErrorInfo} 계산 중 오류 발생 시
 */
export function calculateWithPrecision(postfixTokens: Token[]): number {
  const valueStack: string[] = [];

  for (const token of postfixTokens) {
    if (token.type === "NUMBER") {
      valueStack.push(token.value);
    } else if (token.type === "OPERATOR") {
      if (valueStack.length < 2) {
        throw {
          type: CalculationError.INCOMPLETE_EXPRESSION,
          details: "Invalid expression",
        } as CalculationErrorInfo;
      }
      const b = valueStack.pop()!;
      const a = valueStack.pop()!;

      // BigNumber로 정밀한 계산 수행
      const result = BigNumber.calculate(a, token.value, b);

      // 오류 검사
      if (result.startsWith("Error:")) {
        throw {
          type:
            token.value === "/" && b === "0"
              ? CalculationError.DIVISION_BY_ZERO
              : CalculationError.INVALID_OPERATOR,
          details: result.substring(7), // 'Error: ' 제거
        } as CalculationErrorInfo;
      }

      valueStack.push(result);
    }
  }

  if (valueStack.length !== 1) {
    throw {
      type: CalculationError.INCOMPLETE_EXPRESSION,
      details: "Invalid expression",
    } as CalculationErrorInfo;
  }

  return Number(valueStack[0]);
}
