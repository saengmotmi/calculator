import {
  Token,
  NumberToken,
  isNumberToken,
  isLeftParenToken,
  isRightParenToken,
} from "../tokens/Token";
import { Operator, OperatorType } from "../tokens/Operator";

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
   * 주어진 토큰 배열에 모든 처리를 적용
   */
  processTokens(tokens: Token[]): Token[] {
    return this.processImplicitMultiplication(tokens);
  }
}
