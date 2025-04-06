/**
 * 토큰 유형을 정의하는 열거형
 */
export enum TokenType {
  NUMBER = "NUMBER",
  OPERATOR = "OPERATOR",
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
}

/**
 * 기본 토큰 인터페이스
 */
export interface Token {
  type: TokenType;
  value: string;
  position?: number; // 원본 문자열에서의 위치 (선택적)
}

/**
 * 기본 토큰 클래스
 */
export abstract class BaseToken implements Token {
  constructor(
    public type: TokenType,
    public value: string,
    public position?: number
  ) {}

  toString(): string {
    return this.value;
  }
}

/**
 * 숫자 토큰
 */
export class NumberToken extends BaseToken {
  public numericValue: number;

  constructor(value: string, position?: number) {
    super(TokenType.NUMBER, value, position);
    this.numericValue = Number(value);
  }

  /**
   * 음수인지 확인
   */
  isNegative(): boolean {
    return this.numericValue < 0;
  }
}

/**
 * 연산자 토큰
 */
export class OperatorToken extends BaseToken {
  constructor(value: string, position?: number) {
    super(TokenType.OPERATOR, value, position);
  }
}

/**
 * 괄호 토큰 (왼쪽 괄호)
 */
export class LeftParenToken extends BaseToken {
  constructor(position?: number) {
    super(TokenType.LEFT_PAREN, "(", position);
  }
}

/**
 * 괄호 토큰 (오른쪽 괄호)
 */
export class RightParenToken extends BaseToken {
  constructor(position?: number) {
    super(TokenType.RIGHT_PAREN, ")", position);
  }
}

/**
 * 토큰의 타입을 확인하는 헬퍼 함수들
 */
export const isNumberToken = (token: Token): token is NumberToken =>
  token.type === TokenType.NUMBER;

export const isOperatorToken = (token: Token): token is OperatorToken =>
  token.type === TokenType.OPERATOR;

export const isLeftParenToken = (token: Token): token is LeftParenToken =>
  token.type === TokenType.LEFT_PAREN;

export const isRightParenToken = (token: Token): token is RightParenToken =>
  token.type === TokenType.RIGHT_PAREN;
