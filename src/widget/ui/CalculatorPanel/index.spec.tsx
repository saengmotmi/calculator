import { render, screen, fireEvent, within } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";

import CalculatorPanel from ".";
import { calculatorStore } from "../../../features/calculator/calculatorStore";

beforeEach(() => {
  calculatorStore.clear(); // 테스트 전 상태 초기화
});

describe("CalculatorPanel 컴포넌트", () => {
  it("초기 렌더링에서 결과가 0으로 표시된다", () => {
    render(<CalculatorPanel />);
    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("0");
    expect(resultDisplay).toBeInTheDocument();
  });

  it("숫자 버튼을 클릭하면 식에 숫자가 추가된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    fireEvent.click(button1);

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("1");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("2자리 이상의 숫자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");

    fireEvent.click(button1);
    fireEvent.click(button2);

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("12");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("덧셈 연산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const buttonPlus = screen.getByText("+");
    const button2 = screen.getByText("2");
    const equalsButton = screen.getByText("=");

    fireEvent.click(button1);
    fireEvent.click(buttonPlus);
    fireEvent.click(button2);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("3");
    expect(resultDisplay).toBeInTheDocument();
  });

  it("복잡한 식도 올바르게 계산된다", () => {
    render(<CalculatorPanel />);
    const button2 = screen.getByText("2");
    const buttonPlus = screen.getByText("+");
    const button3 = screen.getByText("3");
    const buttonMultiply = screen.getByText("*");
    const button4 = screen.getByText("4");
    const equalsButton = screen.getByText("=");

    fireEvent.click(button2);
    fireEvent.click(buttonPlus);
    fireEvent.click(button3);
    fireEvent.click(buttonMultiply);
    fireEvent.click(button4);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("14"); // 2 + 3 * 4 = 14
    expect(resultDisplay).toBeInTheDocument();
  });

  it("초기화 버튼이 클릭되면 식과 결과가 초기화된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const clearButton = screen.getByText("C");

    fireEvent.click(button1);
    fireEvent.click(clearButton);

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("0");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("뒤로 가기 버튼이 클릭되면 마지막 입력이 삭제된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(backspaceButton);

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("1");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("음수에 대한 덧셈 연산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);
    const buttonMinus = screen.getByText("-");
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const buttonPlus = screen.getByText("+");
    const button4 = screen.getByText("4");
    const equalsButton = screen.getByText("=");

    fireEvent.click(buttonMinus);
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);
    fireEvent.click(buttonPlus);
    fireEvent.click(button4);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("-119"); // -123 + 4 = -119
    expect(resultDisplay).toBeInTheDocument();
  });

  it("음수에 대한 뺄셈 연산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);
    const buttonMinus = screen.getByText("-");
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const buttonMinusAgain = screen.getByText("-");
    const button4 = screen.getByText("4");
    const equalsButton = screen.getByText("=");

    fireEvent.click(buttonMinus);
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);
    fireEvent.click(buttonMinusAgain);
    fireEvent.click(button4);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("-127"); // -123 - 4 = -127
    expect(resultDisplay).toBeInTheDocument();
  });

  it("음수에 대한 곱셈 연산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);
    const buttonMinus = screen.getByText("-");
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const buttonMultiply = screen.getByText("*");
    const button2Again = screen.getByText("2");
    const equalsButton = screen.getByText("=");

    fireEvent.click(buttonMinus);
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);
    fireEvent.click(buttonMultiply);
    fireEvent.click(button2Again);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("-246"); // -123 * 2 = -246
    expect(resultDisplay).toBeInTheDocument();
  });

  it("음수에 대한 나눗셈 연산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);
    const buttonMinus = screen.getByText("-");
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const buttonDivide = screen.getByText("/");
    const button3Again = screen.getByText("3");
    const equalsButton = screen.getByText("=");

    fireEvent.click(buttonMinus);
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);
    fireEvent.click(buttonDivide);
    fireEvent.click(button3Again);
    fireEvent.click(equalsButton);

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("-41"); // -123 / 3 = -41
    expect(resultDisplay).toBeInTheDocument();
  });
});

describe("CalculatorPanel 컴포넌트 - 키보드 입력 테스트", () => {
  it("키보드 입력으로 숫자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1"과 "2" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("12");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("키보드 입력으로 연산자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "+", "2" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "2" });

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("1 + 2");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("Enter 키로 계산을 수행할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "+", "2", "Enter" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Enter" });

    const display = screen.getByRole("display");
    const resultDisplay = within(display).getByText("3"); // 1 + 2 = 3
    expect(resultDisplay).toBeInTheDocument();
  });

  it("Backspace 키로 마지막 입력을 삭제할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "2", "Backspace" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Backspace" });

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("1");
    expect(expressionDisplay).toBeInTheDocument();
  });

  it("Escape 키로 계산기를 초기화할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "2", "Escape" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Escape" });

    const display = screen.getByRole("display");
    const expressionDisplay = within(display).getByText("0");
    expect(expressionDisplay).toBeInTheDocument();
  });
});
