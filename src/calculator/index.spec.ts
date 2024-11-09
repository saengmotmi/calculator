import { describe, it, expect } from "vitest";

import { Infix } from "../notations/infix";
import { ArithmeticEvaluator } from "../operations/arithmetics";

describe("기본 사칙연산 계산기 기능", () => {
  const evaluator = new ArithmeticEvaluator();

  it("두 숫자의 덧셈을 수행할 수 있다", () => {
    const expression = "2 + 3";
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(5);
  });

  it("두 숫자의 뺄셈을 수행할 수 있다", () => {
    const expression = "5 - 3";
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(2);
  });

  it("두 숫자의 곱셈을 수행할 수 있다", () => {
    const expression = "4 * 3";
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(12);
  });

  it("두 숫자의 나눗셈을 수행할 수 있다", () => {
    const expression = "10 / 2";
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(5);
  });

  it("연산자 우선순위를 올바르게 처리할 수 있다", () => {
    const expression = "2 + 3 * 4"; // 예상 결과: 2 + (3 * 4) = 14
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(14);
  });

  it("괄호를 사용하여 우선순위를 변경할 수 있다", () => {
    const expression = "( 2 + 3 ) * 4"; // 예상 결과: (2 + 3) * 4 = 20
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(20);
  });

  it("중첩된 괄호를 올바르게 처리할 수 있다", () => {
    const expression = "2 * ( 3 + ( 4 - 1 ) )"; // 예상 결과: 2 * (3 + 3) = 12
    const calculator = new Infix(expression, evaluator);
    expect(calculator.evaluate()).toBe(12);
  });

  it("0으로 나누기를 시도할 경우 오류를 발생시킨다", () => {
    const expression = "5 / 0";
    const calculator = new Infix(expression, evaluator);
    expect(() => calculator.evaluate()).toThrow("Division by zero");
  });
});
