import {
  Token,
  NumberToken,
  isNumberToken,
  isLeftParenToken,
  isRightParenToken,
  isOperatorToken,
} from "../tokens/Token";
import { Operator } from "../tokens/Operator";
import { OperatorType } from "../tokens/OperatorType";

/**
 * 표현식 전처리기 클래스: 특수 케이스를 처리
 */
export class ExpressionProcessor {
  /**
   * 암시적 곱셈을 처리하여 토큰 배열 반환
   * 예: 2(3+4) -> 2 * (3+4)
   */
  processImplicitMultiplication(tokens: Token[]): Token[] {
    if (tokens.length < 2) return tokens;

    const result: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      result.push(token);

      if (i < tokens.length - 1) {
        const nextToken = tokens[i + 1];

        // 숫자 다음에 왼쪽 괄호가 오는 경우: 2(3+4)
        if (isNumberToken(token) && isLeftParenToken(nextToken)) {
          result.push(new Operator(OperatorType.MULTIPLY));
        }

        // 오른쪽 괄호 다음에 숫자가 오는 경우: (1+2)3
        if (isRightParenToken(token) && isNumberToken(nextToken)) {
          result.push(new Operator(OperatorType.MULTIPLY));
        }

        // 오른쪽 괄호 다음에 왼쪽 괄호가 오는 경우: (1+2)(3+4)
        if (isRightParenToken(token) && isLeftParenToken(nextToken)) {
          result.push(new Operator(OperatorType.MULTIPLY));
        }
      }
    }

    return result;
  }

  /**
   * 음수 토큰을 처리
   * 예: 1 + -2 -> 1 + (-2)
   */
  processNegativeNumbers(tokens: Token[]): Token[] {
    if (tokens.length < 2) return tokens;

    const result: Token[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // 뺄셈 연산자이고, 음수로 처리해야 하는 경우
      if (
        isOperatorToken(token) &&
        token.value === OperatorType.MINUS &&
        i + 1 < tokens.length &&
        isNumberToken(tokens[i + 1])
      ) {
        // 음수로 처리해야 하는 조건:
        // 1. 첫 번째 토큰이거나
        // 2. 직전 토큰이 연산자이거나
        // 3. 직전 토큰이 왼쪽 괄호인 경우
        const isNegativeNumber =
          i === 0 ||
          (i > 0 && isOperatorToken(tokens[i - 1])) ||
          (i > 0 && isLeftParenToken(tokens[i - 1]));

        if (isNegativeNumber) {
          // 음수 처리: 다음 숫자 토큰을 음수로 변환
          const nextToken = tokens[i + 1] as NumberToken;
          const negativeValue = -Math.abs(nextToken.numericValue);
          result.push(new NumberToken(negativeValue.toString()));
          i++; // 다음 토큰은 이미 처리했으므로 건너뜀
          continue;
        }
      }

      // 그 외의 경우 토큰을 그대로 추가
      result.push(token);
    }

    return result;
  }

  /**
   * 연산자 앞에 숫자가 없는 경우 0을 추가
   * 예: +3 -> 0+3
   */
  processImplicitZero(tokens: Token[]): Token[] {
    if (tokens.length === 0) return tokens;

    const result: Token[] = [];

    // 첫 번째 토큰이 연산자이고 음수가 아닌 경우, 앞에 0 추가
    if (isOperatorToken(tokens[0]) && tokens[0].value !== OperatorType.MINUS) {
      result.push(new NumberToken("0"));
    }

    for (let i = 0; i < tokens.length; i++) {
      result.push(tokens[i]);
    }

    return result;
  }

  /**
   * 주어진 토큰 배열에 모든 처리를 적용
   */
  processTokens(tokens: Token[]): Token[] {
    // 처리 순서가 중요함: 음수 처리 -> 암시적 0 추가 -> 암시적 곱셈
    let processedTokens = this.processNegativeNumbers(tokens);
    processedTokens = this.processImplicitZero(processedTokens);
    processedTokens = this.processImplicitMultiplication(processedTokens);

    return processedTokens;
  }
}
