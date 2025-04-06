/**
 * 계산기의 작동 모드를 정의합니다.
 */
export enum CalculatorMode {
  /** 입력 중인 상태 */
  INPUT = "input",
  /** 계산 결과를 표시 중인 상태 */
  RESULT = "result",
}

/**
 * 계산기의 상태를 나타내는 인터페이스
 */
export interface CalculatorState {
  /** 현재 표시되는 수식 */
  expression: string;
  /** 계산 결과 값 */
  result: number | null;
  /** 계산기 작동 모드 */
  mode: CalculatorMode;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 초기 계산기 상태
 */
export const initialCalculatorState: CalculatorState = {
  expression: "0",
  result: null,
  mode: CalculatorMode.INPUT,
  error: null,
};
