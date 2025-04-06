/**
 * 계산기 작동 모드
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
 * 계산기 도메인 상태 인터페이스
 * UI 표시 형식과 무관한 순수한 도메인 상태
 */
export interface CalculatorState {
  /** 내부 표현식 (토큰 배열 등 내부 표현) */
  expression: any; // 실제 구현에서는 Expression 타입 사용
  /** 계산 결과 (있는 경우) */
  result: number | null;
  /** 현재 계산기 모드 */
  mode: CalculatorMode;
  /** 에러 정보 (있는 경우) */
  error: string | null;
}

/**
 * 초기 계산기 상태
 */
export const initialCalculatorState: CalculatorState = {
  expression: null, // 실제 구현에서 빈 Expression 초기화
  result: null,
  mode: CalculatorMode.INPUT,
  error: null,
};
