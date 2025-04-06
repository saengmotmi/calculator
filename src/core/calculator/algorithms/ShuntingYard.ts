/**
 * 계산기에서 사용하는 Shunting Yard 알고리즘
 * 중위 표기식을 후위 표기식으로 변환하는 알고리즘을 캡슐화합니다.
 * 도메인에 독립적인 순수 알고리즘 구현
 */
import { Token } from "../domain/CalculatorState";

/**
 * Shunting Yard 알고리즘에서 발생할 수 있는 오류
 */
export enum ShuntingYardError {
  MISMATCHED_PARENTHESES = "MISMATCHED_PARENTHESES",
  INVALID_TOKEN = "INVALID_TOKEN",
}

/**
 * 알고리즘 오류 정보 타입
 */
export interface AlgorithmError {
  type: ShuntingYardError;
  details: string;
}

/**
 * 연산자 우선순위 반환
 */
export function getOperatorPrecedence(operator: string): number {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    default:
      return 0;
  }
}

/**
 * 중위 표기식을 후위 표기식으로 변환 (Shunting Yard 알고리즘)
 * 도메인에 독립적인 순수 함수 구현
 * @throws {AlgorithmError} 알고리즘 수행 중 오류 발생 시
 */
export function convertToPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    if (token.type === "NUMBER") {
      output.push(token);
    } else if (token.type === "OPERATOR") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === "OPERATOR" &&
        getOperatorPrecedence(operators[operators.length - 1].value) >=
          getOperatorPrecedence(token.value)
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token.type === "LEFT_PAREN") {
      operators.push(token);
    } else if (token.type === "RIGHT_PAREN") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type !== "LEFT_PAREN"
      ) {
        output.push(operators.pop()!);
      }

      // 왼쪽 괄호 제거
      if (
        operators.length > 0 &&
        operators[operators.length - 1].type === "LEFT_PAREN"
      ) {
        operators.pop();
      } else {
        throw {
          type: ShuntingYardError.MISMATCHED_PARENTHESES,
          details: "Mismatched parentheses",
        } as AlgorithmError;
      }
    }
  }

  // 남은 연산자 모두 출력
  while (operators.length > 0) {
    const op = operators.pop()!;
    if (op.type === "LEFT_PAREN") {
      throw {
        type: ShuntingYardError.MISMATCHED_PARENTHESES,
        details: "Mismatched parentheses",
      } as AlgorithmError;
    }
    output.push(op);
  }

  return output;
}
