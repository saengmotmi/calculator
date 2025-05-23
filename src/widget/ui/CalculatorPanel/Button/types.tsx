/**
 * 계산기 액션 인터페이스 (의존성 주입용)
 */
export interface CalculatorActions {
  input: (value: string) => void;
  calculate: () => void;
  clear: () => void;
  backspace: () => void;
}

/**
 * 버튼 타입 정의
 */
export type ButtonType =
  | "number"
  | "operator"
  | "equals"
  | "clear"
  | "backspace";

/**
 * 버튼 설정 인터페이스
 */
export interface ButtonConfig {
  label: string;
  type: ButtonType;
  value?: string;
  getAriaLabel: () => string;
  onClick: (actions: CalculatorActions) => void;
}

/**
 * 숫자 버튼 생성 함수
 */
export function createNumberButton(digit: string): ButtonConfig {
  return {
    label: digit,
    type: "number",
    value: digit,
    getAriaLabel: () => `숫자 ${digit}`,
    onClick: (actions) => actions.input(digit),
  };
}

/**
 * 연산자 버튼 생성 함수
 */
export function createOperatorButton(operator: string): ButtonConfig {
  const operatorLabels: Record<string, string> = {
    "+": "더하기",
    "-": "빼기",
    "*": "곱하기",
    "/": "나누기",
    "(": "여는 괄호",
    ")": "닫는 괄호",
  };

  const isParen = ["(", ")"].includes(operator);
  const ariaLabel = operatorLabels[operator]
    ? isParen
      ? operatorLabels[operator]
      : `연산자 ${operatorLabels[operator]}`
    : operator;

  return {
    label: operator,
    type: "operator",
    value: operator,
    getAriaLabel: () => ariaLabel,
    onClick: (actions) => actions.input(operator),
  };
}

/**
 * 계산 버튼 생성 함수
 */
export function createEqualsButton(): ButtonConfig {
  return {
    label: "=",
    type: "equals",
    getAriaLabel: () => "계산하기",
    onClick: (actions) => actions.calculate(),
  };
}

/**
 * 초기화 버튼 생성 함수
 */
export function createClearButton(): ButtonConfig {
  return {
    label: "C",
    type: "clear",
    getAriaLabel: () => "모두 지우기",
    onClick: (actions) => actions.clear(),
  };
}

/**
 * 백스페이스 버튼 생성 함수
 */
export function createBackspaceButton(): ButtonConfig {
  return {
    label: "←",
    type: "backspace",
    getAriaLabel: () => "뒤로 가기",
    onClick: (actions) => actions.backspace(),
  };
}
