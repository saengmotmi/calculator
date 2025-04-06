import {
  Token,
  NumberToken,
  LeftParenToken,
  RightParenToken,
} from "../tokens/Token";
import { Operator, isValidOperator } from "../tokens/Operator";

/**
 * 렉서 클래스: 문자열을 토큰으로 변환
 */
export class Lexer {
  private position: number = 0;
  private input: string;
  private tokens: Token[] = [];

  constructor(input: string) {
    // 공백을 제거한 입력값 사용
    this.input = input.replace(/\s+/g, "");
  }

  /**
   * 입력 문자열의 모든 토큰을 생성하여 반환
   */
  tokenize(): Token[] {
    this.position = 0;
    this.tokens = [];

    while (!this.isEOF()) {
      this.consumeToken();
    }

    return this.tokens;
  }

  /**
   * 현재 위치에서 토큰을 소비하고 위치를 이동
   */
  private consumeToken(): void {
    const currentChar = this.peek();

    // 숫자 처리
    if (this.isDigit(currentChar) || this.isNegativeNumber()) {
      this.consumeNumber();
    }
    // 괄호 처리
    else if (currentChar === "(") {
      this.tokens.push(new LeftParenToken(this.position));
      this.advance();
    } else if (currentChar === ")") {
      this.tokens.push(new RightParenToken(this.position));
      this.advance();
    }
    // 연산자 처리
    else if (isValidOperator(currentChar)) {
      this.consumeOperator();
    }
    // 알 수 없는 문자는 건너뜀
    else {
      this.advance();
    }
  }

  /**
   * 현재 위치에서 숫자 토큰을 소비
   */
  private consumeNumber(): void {
    const start = this.position;
    let isNegative = false;

    // 음수 처리
    if (this.peek() === "-") {
      isNegative = true;
      this.advance();
    }

    // 숫자 부분 읽기
    while (!this.isEOF() && this.isDigit(this.peek())) {
      this.advance();
    }

    // 소숫점 처리
    if (!this.isEOF() && this.peek() === ".") {
      this.advance();

      while (!this.isEOF() && this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const numberStr = this.input.substring(start, this.position);
    this.tokens.push(new NumberToken(numberStr, start));
  }

  /**
   * 현재 위치에서 연산자 토큰을 소비
   */
  private consumeOperator(): void {
    const operatorChar = this.peek();
    this.tokens.push(new Operator(operatorChar, this.position));
    this.advance();
  }

  /**
   * 현재 위치가 음수의 시작인지 확인
   */
  private isNegativeNumber(): boolean {
    // '-'가 처음에 오거나, 직전 토큰이 연산자 또는 왼쪽 괄호인 경우 음수로 간주
    if (this.peek() !== "-") return false;

    if (this.position === 0) return true;

    // 다음 문자가 숫자인지 확인 (음수여야 함)
    if (
      this.position + 1 < this.input.length &&
      !this.isDigit(this.input[this.position + 1])
    ) {
      return false;
    }

    // 이전 토큰 확인
    if (this.tokens.length > 0) {
      const prevToken = this.tokens[this.tokens.length - 1];
      return (
        prevToken instanceof Operator || prevToken instanceof LeftParenToken
      );
    }

    return true;
  }

  /**
   * 현재 위치의 문자를 읽고 위치를 증가시키지 않음
   */
  private peek(): string {
    return this.input[this.position];
  }

  /**
   * 위치를 한 칸 증가
   */
  private advance(): void {
    this.position++;
  }

  /**
   * 입력의 끝에 도달했는지 확인
   */
  private isEOF(): boolean {
    return this.position >= this.input.length;
  }

  /**
   * 문자가 숫자인지 확인
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }
}
