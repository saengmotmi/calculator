import {
  Token,
  NumberToken,
  OperatorToken,
  LeftParenToken,
  RightParenToken,
  isOperatorToken,
} from "../tokens/Token";
import { OperatorType } from "../tokens/OperatorType";

/**
 * 수식을 표현하는 클래스
 * 토큰 배열과 현재 입력 중인 문자열을 캡슐화합니다.
 */
export class Expression {
  constructor(
    private readonly tokens: Token[] = [],
    private readonly currentInput: string = "",
    private readonly previousResult: number | null = null
  ) {}

  /**
   * 마지막 문자를 제거한 새 Expression을 반환합니다.
   */
  withLastCharRemoved(): Expression {
    // 현재 입력이 있으면 그것부터 처리
    if (this.currentInput) {
      const newInput = this.currentInput.slice(0, -1);
      return new Expression(this.tokens, newInput, this.previousResult);
    }

    // 토큰이 없으면 현재 상태 그대로 반환
    if (this.tokens.length === 0) {
      return this;
    }

    // 마지막 토큰 처리
    const lastToken = this.tokens[this.tokens.length - 1];
    const newTokens = [...this.tokens.slice(0, -1)];

    // 토큰 변형 처리
    const transformedToken = lastToken.transform((value) =>
      value.length > 1 ? value.slice(0, -1) : null
    );

    if (transformedToken) {
      newTokens.push(transformedToken);
    }

    return new Expression(newTokens, "", this.previousResult);
  }

  /**
   * 새 숫자 입력이 추가된 Expression을 반환합니다.
   */
  withNumberInput(digit: string): Expression {
    return new Expression(
      this.tokens,
      this.currentInput + digit,
      this.previousResult
    );
  }

  /**
   * 연산자가 추가된 Expression을 반환합니다.
   */
  withOperatorInput(operator: string): Expression {
    if (this.currentInput) {
      // 현재 입력 중인 숫자가 있으면 토큰으로 변환 후 연산자 추가
      const newTokens = this.addTokenWithCurrentInput();

      // 유효한 연산자인지 확인
      if (Object.values(OperatorType).includes(operator as OperatorType)) {
        newTokens.push(new OperatorToken(operator));
        return new Expression(newTokens, "", this.previousResult);
      }
    } else if (this.tokens.length > 0) {
      // 마지막 토큰이 연산자인지 확인
      const lastToken = this.tokens[this.tokens.length - 1];

      if (isOperatorToken(lastToken)) {
        // 연산자 교체 (마지막 토큰 제거 후 새 연산자 추가)
        const newTokens = [...this.tokens.slice(0, -1)];

        if (Object.values(OperatorType).includes(operator as OperatorType)) {
          newTokens.push(new OperatorToken(operator));
          return new Expression(newTokens, "", this.previousResult);
        }
      } else {
        // 새 연산자 추가
        const newTokens = [...this.tokens];

        if (Object.values(OperatorType).includes(operator as OperatorType)) {
          newTokens.push(new OperatorToken(operator));
          return new Expression(newTokens, "", this.previousResult);
        }
      }
    } else if (operator === "-" && !this.currentInput) {
      // 음수 시작
      return new Expression(this.tokens, "-", this.previousResult);
    }

    return this;
  }

  /**
   * 괄호가 추가된 Expression을 반환합니다.
   */
  withParenthesisInput(paren: string): Expression {
    let newTokens: Token[];

    if (this.currentInput) {
      // 현재 입력 중인 숫자가 있으면 토큰으로 변환 후 토큰 추가
      newTokens = this.addTokenWithCurrentInput();
    } else {
      // 토큰 직접 추가
      newTokens = [...this.tokens];
    }

    if (paren === "(") {
      newTokens.push(new LeftParenToken());
    } else if (paren === ")") {
      newTokens.push(new RightParenToken());
    }

    return new Expression(newTokens, "", this.previousResult);
  }

  /**
   * 현재 입력이 있을 경우 숫자 토큰으로 변환하여 추가한 새 토큰 배열을 반환합니다.
   * 헬퍼 메서드.
   */
  private addTokenWithCurrentInput(): Token[] {
    if (!this.currentInput) {
      return [...this.tokens];
    }
    return [...this.tokens, new NumberToken(this.currentInput)];
  }

  /**
   * 완전히 초기화된 Expression을 반환합니다.
   */
  cleared(): Expression {
    return new Expression();
  }

  /**
   * 현재 수식만 초기화된 Expression을 반환합니다.
   */
  withClearedExpression(): Expression {
    return new Expression([], "", this.previousResult);
  }

  /**
   * 계산 결과가 적용된 Expression을 반환합니다.
   */
  withCalculationResult(result: number): Expression {
    return new Expression([], "", result);
  }

  /**
   * Expression의 문자열 표현을 반환합니다.
   */
  toString(): string {
    const tokensStr = this.tokens.map((t) => t.value).join(" ");
    if (this.currentInput) {
      return tokensStr
        ? `${tokensStr} ${this.currentInput}`
        : this.currentInput;
    }
    return tokensStr || "0"; // 빈 경우 "0" 반환
  }

  /**
   * 현재 토큰들을 반환합니다.
   */
  getTokens(): Token[] {
    // 현재 입력이 있으면 임시 토큰 생성
    const finalTokens = [...this.tokens];
    if (this.currentInput) {
      finalTokens.push(new NumberToken(this.currentInput));
    }
    return finalTokens;
  }

  /**
   * 이전 계산 결과를 반환합니다.
   */
  getPreviousResult(): number | null {
    return this.previousResult;
  }

  /**
   * 현재 입력이 있는지 확인합니다.
   */
  hasCurrentInput(): boolean {
    return this.currentInput.length > 0;
  }
}
