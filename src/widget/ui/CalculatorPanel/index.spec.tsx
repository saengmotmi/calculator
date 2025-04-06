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
    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("0");
  });

  it("숫자 버튼을 클릭하면 식에 숫자가 추가된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    fireEvent.click(button1);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1");
  });

  it("2자리 이상의 숫자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");

    fireEvent.click(button1);
    fireEvent.click(button2);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12");
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("3");
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("14"); // 2 + 3 * 4 = 14
  });

  it("초기화 버튼이 클릭되면 식과 결과가 초기화된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const clearButton = screen.getByText("C");

    fireEvent.click(button1);
    fireEvent.click(clearButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("0");
  });

  it("뒤로 가기 버튼이 클릭되면 마지막 입력이 삭제된다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(backspaceButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1");
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("-119"); // -123 + 4 = -119
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("-127"); // -123 - 4 = -127
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("-246"); // -123 * 2 = -246
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

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("-41"); // -123 / 3 = -41
  });

  it("여러 번의 뒤로 가기 버튼 클릭이 올바르게 동작한다", () => {
    render(<CalculatorPanel />);
    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);

    fireEvent.click(backspaceButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12");

    fireEvent.click(backspaceButton);

    expect(expressionDisplay).toHaveTextContent("1");
  });

  it("연산자 입력 후 백스페이스를 누르면 연산자가 삭제된다", () => {
    render(<CalculatorPanel />);

    const button1 = screen.getByText("1");
    const plusButton = screen.getByText("+");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(plusButton);

    fireEvent.click(backspaceButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1");
  });

  it("연속된 계산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);

    // 1 + 2 = 3
    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("="));

    // 결과가 3인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("3");

    // + 4 = 7 (3 + 4 = 7)
    fireEvent.click(screen.getByText("+"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("="));

    // 결과가 7인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("7");

    // * 2 = 14 (7 * 2 = 14)
    fireEvent.click(screen.getByText("*"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("="));

    // 결과가 14인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("14");
  });

  it("키보드로 연속된 계산이 올바르게 수행된다", () => {
    render(<CalculatorPanel />);

    // 1 + 2 = 3
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Enter" });

    // 결과가 3인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("3");

    // + 4 = 7 (3 + 4 = 7)
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "4" });
    fireEvent.keyDown(window, { key: "Enter" });

    // 결과가 7인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("7");

    // * 2 = 14 (7 * 2 = 14)
    fireEvent.keyDown(window, { key: "*" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Enter" });

    // 결과가 14인지 확인
    expect(screen.getByTestId("result-display")).toHaveTextContent("14");
  });
});

describe("CalculatorPanel 컴포넌트 - 키보드 입력 테스트", () => {
  it("키보드 입력으로 숫자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);

    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12");
  });

  it("키보드 입력으로 연산자를 입력할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "+", "2" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "2" });

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1 + 2");
  });

  it("Enter 키로 계산을 수행할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "+", "2", "Enter" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "+" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Enter" });

    const resultDisplay = screen.getByTestId("result-display");
    expect(resultDisplay).toHaveTextContent("3"); // 1 + 2 = 3
  });

  it("Backspace 키로 마지막 입력을 삭제할 수 있다", () => {
    render(<CalculatorPanel />);

    // "1", "2", "Backspace" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "Backspace" });

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1");
  });

  it("Escape 키로 계산기를 초기화할 수 있다", () => {
    render(<CalculatorPanel />);

    // 숫자 1 입력
    fireEvent.keyDown(window, { key: "1" });

    // Escape 키 입력
    fireEvent.keyDown(window, { key: "Escape" });

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("0");
  });
});

describe("CalculatorPanel 컴포넌트 - 백스페이스 기능", () => {
  it("숫자 입력 중에 백스페이스를 누르면 마지막 숫자가 삭제된다", () => {
    render(<CalculatorPanel />);

    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);

    fireEvent.click(backspaceButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12");

    fireEvent.click(backspaceButton);

    const updatedExpressionDisplay = screen.getByTestId("expression-display");
    expect(updatedExpressionDisplay).toHaveTextContent("1");
  });

  it("연산자 입력 후 백스페이스를 누르면 연산자가 삭제된다", () => {
    render(<CalculatorPanel />);

    const button1 = screen.getByText("1");
    const plusButton = screen.getByText("+");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(plusButton);

    fireEvent.click(backspaceButton);

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("1");
  });

  it("복잡한 수식에서 백스페이스를 여러번 누르면 입력 순서의 역순으로 삭제된다", () => {
    render(<CalculatorPanel />);

    const button1 = screen.getByText("1");
    const button2 = screen.getByText("2");
    const plusButton = screen.getByText("+");
    const button3 = screen.getByText("3");
    const backspaceButton = screen.getByText("←");

    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(plusButton);
    fireEvent.click(button3);

    // "12 + 3" 상태에서 백스페이스를 누르면 "12 +"가 됨
    fireEvent.click(backspaceButton);
    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12 +");

    // "12 +" 상태에서 백스페이스를 누르면 "12"가 됨
    fireEvent.click(backspaceButton);
    expect(expressionDisplay).toHaveTextContent("12");

    // "12" 상태에서 백스페이스를 누르면 마지막 숫자가 삭제됨
    fireEvent.click(backspaceButton);
    expect(expressionDisplay).toHaveTextContent("1");

    // "1" 상태에서 백스페이스를 누르면 "0"이 됨
    fireEvent.click(backspaceButton);
    expect(expressionDisplay).toHaveTextContent("0");
  });

  it("키보드 Backspace 키를 눌러도 마지막 입력이 삭제된다", () => {
    render(<CalculatorPanel />);

    // "1", "2", "3" 키 입력
    fireEvent.keyDown(window, { key: "1" });
    fireEvent.keyDown(window, { key: "2" });
    fireEvent.keyDown(window, { key: "3" });

    // Backspace 키 입력
    fireEvent.keyDown(window, { key: "Backspace" });

    const expressionDisplay = screen.getByTestId("expression-display");
    expect(expressionDisplay).toHaveTextContent("12");
  });
});
