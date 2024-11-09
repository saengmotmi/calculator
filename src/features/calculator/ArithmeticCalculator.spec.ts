import { describe, expect, it } from "vitest";

import { ArithmeticCalculator } from "./ArithmeticCalculator";

describe("기본 사칙연산 계산기 기능", () => {
  it("두 숫자의 덧셈을 수행할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "2 + 3";
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(5);
  });

  it("두 숫자의 뺄셈을 수행할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "5 - 3";
    calculator.inputNumber(5);
    calculator.inputOperator("-");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(2);
  });

  it("두 숫자의 곱셈을 수행할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "4 * 3";
    calculator.inputNumber(4);
    calculator.inputOperator("*");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(12);
  });

  it("두 숫자의 나눗셈을 수행할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "10 / 2";
    calculator.inputNumber(10);
    calculator.inputOperator("/");
    calculator.inputNumber(2);

    expect(calculator.evaluate()).toBe(5);
  });

  it("연산자 우선순위를 올바르게 처리할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "2 + 3 * 4";
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);
    calculator.inputOperator("*");
    calculator.inputNumber(4);

    expect(calculator.evaluate()).toBe(14);
  });

  it("괄호를 사용하여 우선순위를 변경할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    // "( 2 + 3 ) * 4";
    calculator.inputParenthesis("(");
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);
    calculator.inputParenthesis(")");
    calculator.inputOperator("*");
    calculator.inputNumber(4);

    expect(calculator.evaluate()).toBe(20);
  });

  it("중첩된 괄호를 올바르게 처리할 수 있다", () => {
    const calculator = new ArithmeticCalculator();
    calculator.inputNumber(2);
    calculator.inputOperator("*");
    calculator.inputParenthesis("(");
    calculator.inputNumber(3);
    calculator.inputOperator("+");
    calculator.inputParenthesis("(");
    calculator.inputNumber(4);
    calculator.inputOperator("-");
    calculator.inputNumber(1);
    calculator.inputParenthesis(")");
    calculator.inputParenthesis(")");

    expect(calculator.evaluate()).toBe(12);
  });

  it("0으로 나누기를 시도할 경우 오류를 발생시킨다", () => {
    const calculator = new ArithmeticCalculator();
    // "5 / 0";
    calculator.inputNumber(5);
    calculator.inputOperator("/");
    calculator.inputNumber(0);

    expect(() => calculator.evaluate()).toThrow("Division by zero");
  });
});
