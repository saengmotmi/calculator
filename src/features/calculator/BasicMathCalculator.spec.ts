import { describe, expect, it } from "vitest";

import { BasicMathCalculator } from "./BasicMathCalculator";

describe("기본 사칙연산 계산기 기능", () => {
  it("두 숫자의 덧셈을 수행할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "2 + 3";
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(5);
  });

  it("두 자리 숫자의 덧셈을 수행할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "12 + 3";
    calculator.inputNumber(1);
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(15);
  });

  it("두 숫자의 뺄셈을 수행할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "5 - 3";
    calculator.inputNumber(5);
    calculator.inputOperator("-");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(2);
  });

  it("두 숫자의 곱셈을 수행할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "4 * 3";
    calculator.inputNumber(4);
    calculator.inputOperator("*");
    calculator.inputNumber(3);

    expect(calculator.evaluate()).toBe(12);
  });

  it("두 숫자의 나눗셈을 수행할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "10 / 2";
    calculator.inputNumber(10);
    calculator.inputOperator("/");
    calculator.inputNumber(2);

    expect(calculator.evaluate()).toBe(5);
  });

  it("연산자 우선순위를 올바르게 처리할 수 있다", () => {
    const calculator = new BasicMathCalculator();
    // "2 + 3 * 4";
    calculator.inputNumber(2);
    calculator.inputOperator("+");
    calculator.inputNumber(3);
    calculator.inputOperator("*");
    calculator.inputNumber(4);

    expect(calculator.evaluate()).toBe(14);
  });

  it("괄호를 사용하여 우선순위를 변경할 수 있다", () => {
    const calculator = new BasicMathCalculator();
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
    const calculator = new BasicMathCalculator();
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
    const calculator = new BasicMathCalculator();
    // "5 / 0";
    calculator.inputNumber(5);
    calculator.inputOperator("/");
    calculator.inputNumber(0);

    expect(() => calculator.evaluate()).toThrow("Division by zero");
  });

  it("숫자 뒤에 괄호를 입력하면 곱셈으로 간주한다", () => {
    const calculator = new BasicMathCalculator();
    // "2 ( 3 + 4 )";
    calculator.inputNumber(2);
    calculator.inputParenthesis("(");
    calculator.inputNumber(3);
    calculator.inputOperator("+");
    calculator.inputNumber(4);
    calculator.inputParenthesis(")");

    expect(calculator.evaluate()).toBe(14);
  });

  it("숫자 뒤에 괄호를 입력하고 곧바로 엔터를 누르면 연산이 안된다", () => {
    const calculator = new BasicMathCalculator();
    // "123 ( 123 )"
    calculator.inputNumber(123);
    calculator.inputParenthesis("(");
    calculator.inputNumber(123);
    calculator.inputParenthesis(")");

    expect(calculator.evaluate()).toBe(123 * 123);
  });
});
