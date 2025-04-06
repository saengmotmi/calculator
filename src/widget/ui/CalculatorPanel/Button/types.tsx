import { calculatorStore } from "../../../../features/calculator/calculatorStore";

export class ButtonBase {
  constructor(public label: string) {}

  getAriaLabel(): string {
    return this.label;
  }

  onClick(): void {
    // 기본 동작은 레이블 입력
    calculatorStore.input(this.label);
  }
}

export class NumberButton extends ButtonBase {
  constructor(label: string) {
    super(label);
  }

  getAriaLabel(): string {
    return `숫자 ${this.label}`;
  }
}

export class OperatorButton extends ButtonBase {
  private static readonly operatorLabels: Record<string, string> = {
    "+": "더하기",
    "-": "빼기",
    "*": "곱하기",
    "/": "나누기",
    "(": "여는 괄호",
    ")": "닫는 괄호",
  };

  constructor(label: string) {
    super(label);
  }

  getAriaLabel(): string {
    // 괄호는 "연산자" 접두사 없이 사용
    const isParen = ["(", ")"].includes(this.label);
    return OperatorButton.operatorLabels[this.label]
      ? isParen
        ? OperatorButton.operatorLabels[this.label]
        : `연산자 ${OperatorButton.operatorLabels[this.label]}`
      : this.label;
  }
}

export class ClearButton extends ButtonBase {
  constructor() {
    super("C");
  }

  getAriaLabel(): string {
    return "모두 지우기";
  }

  onClick(): void {
    calculatorStore.clear();
  }
}

export class BackspaceButton extends ButtonBase {
  constructor() {
    super("←");
  }

  getAriaLabel(): string {
    return "뒤로 가기";
  }

  onClick(): void {
    calculatorStore.backspace();
  }
}

export class EqualsButton extends ButtonBase {
  constructor() {
    super("=");
  }

  getAriaLabel(): string {
    return "계산하기";
  }

  onClick(): void {
    calculatorStore.calculate();
  }
}
