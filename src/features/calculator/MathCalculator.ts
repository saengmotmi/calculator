import { Parser } from "../../entities/parser/Parser";
import { Operator, OperatorType } from "../../entities/tokens/Operator";
import {
  LeftParenToken,
  NumberToken,
  RightParenToken,
  Token,
  isLeftParenToken,
  isOperatorToken,
} from "../../entities/tokens/Token";
import { ICalculator } from "./ICalculator";

/**
 * 계산기 클래스: 수식 처리와 계산을 담당
 */
export class MathCalculator implements ICalculator {
  private tokens: Token[] = [];
  private currentInput: string = "";
  private previousResult: number | null = null;
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  /**
   * 숫자 입력 처리
   */
  inputNumber(value: string | number): void {
    this.currentInput += `${value}`;
  }

  /**
   * 연산자 입력 처리
   */
  inputOperator(value: string | OperatorType): void {
    const opValue = value as OperatorType;

    // 음수 처리: '-'가 표현식 시작이거나 연산자/괄호 다음에 오는 경우
    const lastToken = this.getLastToken();
    if (
      opValue === OperatorType.MINUS &&
      (this.tokens.length === 0 ||
        (lastToken && isOperatorToken(lastToken)) ||
        (lastToken && isLeftParenToken(lastToken)))
    ) {
      if (this.currentInput) {
        this.addCurrentInputAsToken();
      }
      this.currentInput = "-";
      return;
    }

    // 현재 입력된 내용 처리
    if (this.currentInput) {
      this.addCurrentInputAsToken();
    } else if (this.previousResult !== null && this.tokens.length === 0) {
      // 이전 결과를 현재 수식의 시작으로 사용
      this.tokens.push(new NumberToken(`${this.previousResult}`));
    } else if (this.tokens.length === 0 && opValue !== OperatorType.MINUS) {
      // 수식이 비어있는데 연산자가 오면 0을 먼저 추가 (단, 음수는 제외)
      this.tokens.push(new NumberToken("0"));
    }

    this.tokens.push(new Operator(opValue));
  }

  /**
   * 괄호 입력 처리
   */
  inputParenthesis(paren: string): void {
    if (this.currentInput) {
      this.addCurrentInputAsToken();
    }

    const parenToken =
      paren === "(" ? new LeftParenToken() : new RightParenToken();

    // 암시적 곱셈 처리 - 숫자 뒤에 왼쪽 괄호가 오는 경우
    if (paren === "(" && this.tokens.length > 0) {
      const lastToken = this.getLastToken();
      // 숫자나 오른쪽 괄호 다음에 왼쪽 괄호가 오면 곱셈 추가
      if (
        lastToken &&
        !isOperatorToken(lastToken) &&
        !isLeftParenToken(lastToken)
      ) {
        this.tokens.push(new Operator(OperatorType.MULTIPLY));
      }
    }

    this.tokens.push(parenToken);
  }

  /**
   * 수식 평가 및 결과 반환
   */
  evaluate(): number {
    // 현재 입력 저장
    if (this.currentInput) {
      this.addCurrentInputAsToken();
    }

    // 수식이 비어있으면 0 반환
    if (this.tokens.length === 0) {
      return 0;
    }

    try {
      // 토큰 배열을 직접 문자열로 변환하지 않고 사용
      // 단, 현재 Parser는 여전히 문자열 입력을 받으므로 변환 필요
      const expression = this.tokensToExpression();
      console.log("Evaluating expression:", expression);

      // 파싱 및 평가
      const result = this.parser.parse(expression);
      console.log("Calculation result:", result);

      // 결과 저장 및 초기화
      this.previousResult = result;
      this.clearExpression();

      return result;
    } catch (error) {
      console.error("Calculation error:", error);

      // Division by zero 예외 다시 throw
      if (
        error instanceof Error &&
        error.message.includes("Division by zero")
      ) {
        throw error;
      }

      // 다른 오류는 이전 상태 유지
      return this.previousResult ?? 0;
    }
  }

  /**
   * 현재 수식만 초기화 (이전 결과는 유지)
   */
  clearExpression(): void {
    this.tokens = [];
    this.currentInput = "";
  }

  /**
   * 모든 상태 초기화 (이전 결과 포함)
   */
  clearAll(): void {
    this.clearExpression();
    this.previousResult = null;
  }

  /**
   * 마지막 입력 취소 (백스페이스)
   */
  undo(): void {
    if (this.currentInput) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.tokens.pop();
    }
  }

  /**
   * 현재 수식 문자열 반환
   */
  getExpression(): string {
    const expression = this.tokensToExpression();
    if (this.currentInput) {
      return expression
        ? `${expression} ${this.currentInput}`
        : this.currentInput;
    }
    return expression;
  }

  /**
   * 현재 입력을 토큰으로 변환하여 추가
   */
  private addCurrentInputAsToken(): void {
    if (!this.currentInput) {
      return;
    }

    this.tokens.push(new NumberToken(this.currentInput));
    this.currentInput = "";
  }

  /**
   * 토큰 배열을 문자열 표현으로 변환
   */
  private tokensToExpression(): string {
    return this.tokens.map((token) => token.value).join(" ");
  }

  /**
   * 마지막 토큰 반환 (없으면 null)
   */
  private getLastToken(): Token | null {
    return this.tokens.length > 0 ? this.tokens[this.tokens.length - 1] : null;
  }
}
