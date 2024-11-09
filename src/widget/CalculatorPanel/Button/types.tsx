export class ButtonBase {
  constructor(public label: string) {}
}

export class NumberButton extends ButtonBase {
  constructor(label: string) {
    super(label);
  }
}

export class OperatorButton extends ButtonBase {
  constructor(label: string) {
    super(label);
  }
}

export class ClearButton extends ButtonBase {
  constructor() {
    super("C");
  }
}

export class BackspaceButton extends ButtonBase {
  constructor() {
    super("←");
  }
}

export class EqualsButton extends ButtonBase {
  constructor() {
    super("=");
  }
}
