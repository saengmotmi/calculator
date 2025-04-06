import { OperatorToken } from "./Token";

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

/**
 * 연산자에 대한 확장된 토큰 클래스
 */
export class Operator extends OperatorToken {
  public readonly precedence: number;

  constructor(value: string, position?: number) {
    super(value, position);

    if (!isValidOperator(value)) {
      throw new Error(`Invalid operator: ${value}`);
    }

    this.precedence = OPERATOR_PRECEDENCE[value];
  }

  /**
   * 두 피연산자에 대해 연산 실행
   */
  apply(left: number, right: number): number {
    switch (this.value) {
      case OperatorType.PLUS:
        return left + right;
      case OperatorType.MINUS:
        return left - right;
      case OperatorType.MULTIPLY:
        return left * right;
      case OperatorType.DIVIDE:
        if (right === 0) {
          throw new Error("Division by zero");
        }
        return left / right;
      default:
        throw new Error(`Unknown operator: ${this.value}`);
    }
  }

  /**
   * 현재 연산자가 다른 연산자보다 우선순위가 높거나 같은지 확인
   */
  hasHigherOrEqualPrecedenceThan(other: Operator): boolean {
    return this.precedence >= other.precedence;
  }
}
