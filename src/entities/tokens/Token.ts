/**
 * 토큰 유형을 정의하는 열거형
 */
import { OperatorType } from "./OperatorType";

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

  /**
   * 토큰 값을 변형하는 메서드
   * @param transformer 값을 변형하는 함수, null 반환 시 토큰 삭제를 의미
   * @returns 변형된 토큰 또는 null (토큰을 삭제해야 할 경우)
   */
  transform(transformer: (value: string) => string | null): Token | null;

  /**
   * 이 토큰이 연산자인지 확인
   */
  isOperator(): boolean;
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

  // 추상 메서드로 변경
  abstract transform(
    transformer: (value: string) => string | null
  ): Token | null;

  isOperator(): boolean {
    return false;
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

  transform(transformer: (value: string) => string | null): Token | null {
    const newValue = transformer(this.value);
    if (newValue === null) {
      return null;
    }
    if (newValue === this.value) {
      return this;
    }
    return new NumberToken(newValue, this.position);
  }

  isOperator(): boolean {
    return false;
  }
}

/**
 * 연산자 토큰
 */
export class OperatorToken extends BaseToken {
  constructor(value: string, position?: number) {
    super(TokenType.OPERATOR, value, position);
  }

  transform(transformer: (value: string) => string | null): Token | null {
    const newValue = transformer(this.value);
    if (newValue === null) {
      return null;
    }
    if (newValue === this.value) {
      return this;
    }
    return new OperatorToken(newValue, this.position);
  }

  isOperator(): boolean {
    return true;
  }
}

/**
 * 괄호 토큰 (왼쪽 괄호)
 */
export class LeftParenToken extends BaseToken {
  constructor(position?: number) {
    super(TokenType.LEFT_PAREN, "(", position);
  }

  transform(transformer: (value: string) => string | null): Token | null {
    const newValue = transformer(this.value);
    if (newValue === null) {
      return null;
    }
    if (newValue === this.value) {
      return this;
    }
    return null; // 괄호는 변형될 수 없음
  }

  isOperator(): boolean {
    return false;
  }
}

/**
 * 괄호 토큰 (오른쪽 괄호)
 */
export class RightParenToken extends BaseToken {
  constructor(position?: number) {
    super(TokenType.RIGHT_PAREN, ")", position);
  }

  transform(transformer: (value: string) => string | null): Token | null {
    const newValue = transformer(this.value);
    if (newValue === null) {
      return null;
    }
    if (newValue === this.value) {
      return this;
    }
    return null; // 괄호는 변형될 수 없음
  }

  isOperator(): boolean {
    return false;
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

// 정적 메서드 추가를 위한 네임스페이스
export namespace Token {
  /**
   * 연산자 토큰 생성
   */
  export function createOperator(op: string): OperatorToken | null {
    if (Object.values(OperatorType).includes(op as OperatorType)) {
      return new OperatorToken(op as OperatorType, undefined);
    }
    return null;
  }

  /**
   * 괄호 토큰 생성
   */
  export function createParenthesis(
    paren: string
  ): LeftParenToken | RightParenToken | null {
    if (paren === "(") {
      return new LeftParenToken();
    } else if (paren === ")") {
      return new RightParenToken();
    }
    return null;
  }
}
