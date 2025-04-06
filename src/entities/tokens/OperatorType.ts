/**
 * 연산자 유형을 정의하는 열거형
 */
export enum OperatorType {
  PLUS = "+",
  MINUS = "-",
  MULTIPLY = "*",
  DIVIDE = "/",
}

/**
 * 연산자 우선순위 맵
 */
export const OPERATOR_PRECEDENCE: Record<string, number> = {
  [OperatorType.PLUS]: 1,
  [OperatorType.MINUS]: 1,
  [OperatorType.MULTIPLY]: 2,
  [OperatorType.DIVIDE]: 2,
};

/**
 * 연산자가 유효한지 확인
 */
export const isValidOperator = (value: string): boolean =>
  Object.values(OperatorType).includes(value as OperatorType);
