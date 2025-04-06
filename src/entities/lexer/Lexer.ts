import {
  Token,
  NumberToken,
  LeftParenToken,
  RightParenToken,
} from "../tokens/Token";
import { Operator, isValidOperator, OperatorType } from "../tokens/Operator";

/**
 * 렉서 클래스: 문자열을 토큰으로 변환
 */
export class Lexer {
  private input: string;
  private tokens: Token[] = [];

  constructor(input: string) {
    // 입력값에서 불필요한 공백 처리 (단어 사이의 공백은 유지)
    this.input = input.trim();
  }

  /**
   * 입력 문자열의 모든 토큰을 생성하여 반환
   */
  tokenize(): Token[] {
    this.tokens = [];

    // 1. 먼저 연산자와 괄호 주변에 공백을 추가하여 토큰 분리를 쉽게 함
    let processedInput = this.input
      .replace(/([+\-*/()])/g, " $1 ") // 연산자와 괄호 주변에 공백 추가
      .replace(/\s+/g, " ") // 중복 공백 제거
      .trim(); // 앞뒤 공백 제거

    console.log("전처리된 입력:", processedInput);

    // 2. 공백으로 분리된 각 토큰 처리
    const parts = processedInput.split(/\s+/);

    // 3. 각 토큰을 순차적으로 처리
    for (const part of parts) {
      this.tokenizePart(part);
    }

    return this.tokens;
  }

  /**
   * 단일 부분을 토큰화
   */
  private tokenizePart(part: string): void {
    // 숫자인 경우
    if (this.isNumeric(part)) {
      this.tokens.push(new NumberToken(part));
      return;
    }

    // 연산자인 경우
    if (isValidOperator(part)) {
      this.tokens.push(new Operator(part));
      return;
    }

    // 괄호인 경우
    if (part === "(") {
      this.tokens.push(new LeftParenToken());
      return;
    }

    if (part === ")") {
      this.tokens.push(new RightParenToken());
      return;
    }

    // 인식할 수 없는 토큰
    if (part.length > 0) {
      console.warn(`인식할 수 없는 토큰: ${part}`);
    }
  }

  /**
   * 문자열이 숫자인지 확인
   */
  private isNumeric(str: string): boolean {
    return !isNaN(parseFloat(str)) && isFinite(Number(str));
  }
}
