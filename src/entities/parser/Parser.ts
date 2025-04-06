import {
  Token,
  NumberToken,
  LeftParenToken,
  RightParenToken,
  isNumberToken,
  isLeftParenToken,
  isRightParenToken,
  isOperatorToken,
} from "../tokens/Token";
import { Operator } from "../tokens/Operator";
import { Lexer } from "../lexer/Lexer";
import { ExpressionProcessor } from "../processor/ExpressionProcessor";

/**
 * 파서 클래스: 토큰화된 수식을 평가
 */
export class Parser {
  private tokens: Token[] = [];
  private position: number = 0;
  private processor: ExpressionProcessor;

  constructor() {
    this.processor = new ExpressionProcessor();
  }

  /**
   * 수식 문자열을 평가하여 결과 반환
   */
  parse(expression: string): number {
    const lexer = new Lexer(expression);
    const rawTokens = lexer.tokenize();

    return this.parseTokens(rawTokens);
  }

  /**
   * 토큰 배열을 직접 받아 평가
   */
  parseTokens(inputTokens: Token[]): number {
    // 복사본 생성 - 원본 변경 방지
    const tokensCopy = inputTokens.map((token) => {
      if (isNumberToken(token)) {
        return new NumberToken(token.value);
      } else if (isOperatorToken(token)) {
        return new Operator(token.value);
      } else if (isLeftParenToken(token)) {
        return new LeftParenToken();
      } else if (isRightParenToken(token)) {
        return new RightParenToken();
      }
      return token; // 기본값
    });

    // 암시적 곱셈 등 전처리 수행
    this.tokens = this.processor.processTokens(tokensCopy);
    this.position = 0;

    return this.evaluate();
  }

  /**
   * 토큰화된 수식을 평가하여 결과 반환 (Shunting-yard 알고리즘 사용)
   */
  private evaluate(): number {
    const output: (NumberToken | Operator)[] = [];
    const operators: Token[] = [];

    // 중위 표기법 -> 후위 표기법으로 변환 (Shunting-yard 알고리즘)
    while (this.position < this.tokens.length) {
      const token = this.tokens[this.position];

      if (isNumberToken(token)) {
        output.push(token);
      } else if (isLeftParenToken(token)) {
        operators.push(token);
      } else if (isRightParenToken(token)) {
        // 왼쪽 괄호를 만날 때까지 연산자를 출력 스택으로 이동
        while (
          operators.length > 0 &&
          !isLeftParenToken(operators[operators.length - 1])
        ) {
          const op = operators.pop();
          if (op && isOperatorToken(op)) {
            output.push(op as Operator);
          }
        }

        // 왼쪽 괄호 제거
        if (
          operators.length > 0 &&
          isLeftParenToken(operators[operators.length - 1])
        ) {
          operators.pop();
        } else {
          throw new Error("Mismatched parentheses");
        }
      } else if (isOperatorToken(token)) {
        const operator = token as Operator;

        // 스택의 상위 연산자가 현재 연산자보다 우선순위가 높으면 출력 스택으로 이동
        while (
          operators.length > 0 &&
          isOperatorToken(operators[operators.length - 1]) &&
          (
            operators[operators.length - 1] as Operator
          ).hasHigherOrEqualPrecedenceThan(operator)
        ) {
          const op = operators.pop();
          if (op && isOperatorToken(op)) {
            output.push(op as Operator);
          }
        }

        operators.push(operator);
      }

      this.position++;
    }

    // 남은 연산자를 모두 출력 스택으로 이동
    while (operators.length > 0) {
      const operator = operators.pop();

      if (operator && isLeftParenToken(operator)) {
        throw new Error("Mismatched parentheses");
      }

      if (operator && isOperatorToken(operator)) {
        output.push(operator as Operator);
      }
    }

    // 후위 표기법 평가
    return this.evaluatePostfix(output);
  }

  /**
   * 후위 표기법으로 변환된 토큰을 평가
   */
  private evaluatePostfix(tokens: (NumberToken | Operator)[]): number {
    const stack: number[] = [];

    for (const token of tokens) {
      if (isNumberToken(token)) {
        stack.push(token.numericValue);
      } else if (isOperatorToken(token)) {
        const operator = token as Operator;

        if (stack.length < 2) {
          throw new Error("Invalid expression");
        }

        const right = stack.pop()!;
        const left = stack.pop()!;

        stack.push(operator.apply(left, right));
      }
    }

    if (stack.length !== 1) {
      throw new Error("Invalid expression");
    }

    return stack[0];
  }

  /**
   * 토큰을 중위 표기법으로 변환하여 반환
   */
  getInfixNotation(): string {
    return this.tokens.map((token) => token.value).join(" ");
  }

  /**
   * 토큰을 후위 표기법으로 변환하여 반환
   */
  getPostfixNotation(): string {
    // Shunting-yard 알고리즘을 사용하여 후위 표기법 토큰 배열 생성
    const output: Token[] = [];
    const operators: Token[] = [];

    for (const token of this.tokens) {
      if (isNumberToken(token)) {
        output.push(token);
      } else if (isLeftParenToken(token)) {
        operators.push(token);
      } else if (isRightParenToken(token)) {
        while (
          operators.length > 0 &&
          !isLeftParenToken(operators[operators.length - 1])
        ) {
          const op = operators.pop();
          if (op) output.push(op);
        }

        if (
          operators.length > 0 &&
          isLeftParenToken(operators[operators.length - 1])
        ) {
          operators.pop();
        }
      } else if (isOperatorToken(token)) {
        const operator = token as Operator;

        while (
          operators.length > 0 &&
          isOperatorToken(operators[operators.length - 1]) &&
          (
            operators[operators.length - 1] as Operator
          ).hasHigherOrEqualPrecedenceThan(operator)
        ) {
          const op = operators.pop();
          if (op) output.push(op);
        }

        operators.push(operator);
      }
    }

    while (operators.length > 0) {
      const op = operators.pop();
      if (op) output.push(op);
    }

    return output.map((token) => token.value).join(" ");
  }
}
