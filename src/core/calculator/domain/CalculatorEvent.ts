/**
 * 계산기 도메인 이벤트 유형
 * 모든 계산기 상호작용을 추상화된 이벤트로 표현
 */
export type CalculatorEvent =
  | { type: "DIGIT_INPUT"; digit: string }
  | { type: "OPERATOR_INPUT"; operator: string }
  | { type: "PARENTHESIS_INPUT"; parenthesis: string }
  | { type: "CALCULATE" }
  | { type: "BACKSPACE" }
  | { type: "CLEAR_EXPRESSION" }
  | { type: "CLEAR_ALL" };
