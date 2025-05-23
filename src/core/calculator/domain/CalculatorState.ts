/**
 * 계산기의 작동 상태
 */
export enum CalculatorStatus {
  /** 입력 중인 상태 */
  INPUT = "input",
  /** 계산 결과를 표시 중인 상태 */
  RESULT = "result",
  /** 오류 상태 */
  ERROR = "error",
}

/**
 * 도메인 토큰 타입
 */
export type Token = {
  type: "NUMBER" | "OPERATOR" | "LEFT_PAREN" | "RIGHT_PAREN";
  value: string;
};

/**
 * 단순화된 도메인 상태 모델
 * UI 표시 형식과 완전히 독립적이며 정밀도를 유지
 */
export interface CalculatorState {
  /** 토큰 배열 */
  tokens: Token[];
  /** 현재 입력 중인 숫자/문자 */
  currentInput: string;
  /** 계산 결과 (문자열로 정밀도 유지) */
  result: string | null;
  /** 현재 계산기 상태 */
  status: CalculatorStatus;
  /** 오류 메시지 (간단화) */
  errorMessage: string | null;
}

/**
 * 초기 계산기 상태
 */
export const initialCalculatorState: CalculatorState = {
  tokens: [],
  currentInput: "",
  result: null,
  status: CalculatorStatus.INPUT,
  errorMessage: null,
};
