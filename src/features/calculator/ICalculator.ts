/**
 * 계산기의 기본 인터페이스
 */
export interface ICalculator {
  /**
   * 숫자 입력 처리
   */
  inputNumber(value: string | number): void;

  /**
   * 연산자 입력 처리
   */
  inputOperator(value: string): void;

  /**
   * 괄호 입력 처리
   */
  inputParenthesis(paren: string): void;

  /**
   * 수식 평가 및 결과 반환
   */
  evaluate(): number;

  /**
   * 현재 수식만 초기화 (이전 결과는 유지)
   */
  clearExpression(): void;

  /**
   * 모든 상태 초기화 (이전 결과 포함)
   */
  clearAll(): void;

  /**
   * 마지막 입력 취소 (백스페이스)
   */
  undo(): void;

  /**
   * 현재 수식 문자열 반환
   */
  getExpression(): string;
}
