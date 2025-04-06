/**
 * 계산기의 작동 모드
 */
export enum CalculatorMode {
  /** 입력 중인 상태 */
  INPUT = "input",
  /** 계산 결과를 표시 중인 상태 */
  RESULT = "result",
  /** 오류 상태 */
  ERROR = "error",
}

/**
 * 계산기 도메인 오류 종류
 */
export enum CalculatorErrorType {
  /** 0으로 나누기 시도 */
  DIVISION_BY_ZERO = "DIVISION_BY_ZERO",
  /** 불완전한 표현식 */
  INCOMPLETE_EXPRESSION = "INCOMPLETE_EXPRESSION",
  /** 문법 오류 */
  SYNTAX_ERROR = "SYNTAX_ERROR",
  /** 기타 오류 */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 도메인 토큰 타입
 */
export type Token = {
  type: "NUMBER" | "OPERATOR" | "LEFT_PAREN" | "RIGHT_PAREN";
  value: string;
};

/**
 * 순수 도메인 상태 모델
 * UI 표시 형식과 완전히 독립적
 */
export interface CalculatorState {
  /** 토큰 배열 */
  tokens: Token[];
  /** 현재 입력 중인 숫자/문자 */
  currentInput: string;
  /** 계산 결과 */
  result: number | null;
  /** 현재 계산기 모드 */
  mode: CalculatorMode;
  /** 오류 정보 */
  error: {
    type: CalculatorErrorType;
    details: string;
  } | null;
  /** 표시 모드 (표시 로직에 영향) */
  displayMode?: "AUTO" | "EMPTY" | "ZERO";
}

/**
 * 초기 계산기 상태
 */
export const initialCalculatorState: CalculatorState = {
  tokens: [],
  currentInput: "",
  result: null,
  mode: CalculatorMode.INPUT,
  error: null,
  displayMode: "AUTO",
};
