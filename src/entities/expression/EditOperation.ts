import { Expression } from "./Expression";

/**
 * 수식에 대한 편집 작업을 나타내는 인터페이스
 */
export interface EditOperation {
  /**
   * 주어진 수식에 편집 작업을 적용하고 새 수식을 반환합니다.
   */
  apply(expression: Expression): Expression;
}

/**
 * 백스페이스 편집 작업: 마지막 문자나 토큰을 제거합니다.
 */
export class BackspaceOperation implements EditOperation {
  /**
   * 백스페이스 작업을 수식에 적용합니다.
   */
  apply(expression: Expression): Expression {
    return expression.withLastCharRemoved();
  }
}

/**
 * 숫자 입력 작업: 숫자를 수식에 추가합니다.
 */
export class NumberInputOperation implements EditOperation {
  constructor(private digit: string) {}

  apply(expression: Expression): Expression {
    return expression.withNumberInput(this.digit);
  }
}

/**
 * 연산자 입력 작업: 연산자를 수식에 추가합니다.
 */
export class OperatorInputOperation implements EditOperation {
  constructor(private operator: string) {}

  apply(expression: Expression): Expression {
    return expression.withOperatorInput(this.operator);
  }
}

/**
 * 괄호 입력 작업: 괄호를 수식에 추가합니다.
 */
export class ParenthesisInputOperation implements EditOperation {
  constructor(private parenthesis: string) {}

  apply(expression: Expression): Expression {
    return expression.withParenthesisInput(this.parenthesis);
  }
}

/**
 * 초기화 작업: 수식을 완전히 초기화합니다.
 */
export class ClearOperation implements EditOperation {
  apply(expression: Expression): Expression {
    return expression.cleared();
  }
}

/**
 * 계산 작업: 수식을 평가하고 결과를 반환합니다.
 */
export class CalculateOperation implements EditOperation {
  constructor(private calculator: (tokens: any[]) => number) {}

  apply(expression: Expression): Expression {
    try {
      const tokens = expression.getTokens();
      const result = this.calculator(tokens);
      return expression.withCalculationResult(result);
    } catch (error) {
      console.error("Calculation error:", error);
      return expression; // 오류 시 원래 수식 유지
    }
  }
}
