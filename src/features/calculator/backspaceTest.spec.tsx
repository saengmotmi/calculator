import { render, screen, fireEvent } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import CalculatorPanel from "../../widget/ui/CalculatorPanel";
import { calculatorStore } from "./calculatorStore";

beforeEach(() => {
  calculatorStore.clear(); // 테스트 전 상태 초기화
});

describe("계산기 백스페이스 기능 테스트", () => {
  it("숫자 입력 중 백스페이스는 한 자리씩 삭제해야 한다", () => {
    render(<CalculatorPanel />);

    // 숫자 123 입력
    fireEvent.click(screen.getByRole("button", { name: /숫자 1/i }));
    fireEvent.click(screen.getByRole("button", { name: /숫자 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /숫자 3/i }));

    expect(screen.getByLabelText("수식")).toHaveTextContent("123");

    // 백스페이스 누르면 마지막 숫자 삭제
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("12");

    // 한번 더 누르면 또 한 자리 삭제
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("1");

    // 마지막 자리까지 삭제하면 0이 표시됨
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("0");
  });

  it("연산자 입력 후 백스페이스는 연산자를 삭제해야 한다", () => {
    render(<CalculatorPanel />);

    // 1 + 입력
    fireEvent.click(screen.getByRole("button", { name: /숫자 1/i }));
    fireEvent.click(screen.getByRole("button", { name: /연산자 더하기/i }));

    expect(screen.getByLabelText("수식")).toHaveTextContent("1 +");

    // 백스페이스 누르면 연산자 삭제
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("1");
  });

  it("연산 후 백스페이스는 결과를 유지하면서 새 입력 시작해야 한다", () => {
    render(<CalculatorPanel />);

    // 1 + 2 = 3 계산
    fireEvent.click(screen.getByRole("button", { name: /숫자 1/i }));
    fireEvent.click(screen.getByRole("button", { name: /연산자 더하기/i }));
    fireEvent.click(screen.getByRole("button", { name: /숫자 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /계산하기/i }));

    // 결과는 3
    expect(screen.getByRole("status")).toHaveTextContent("3");

    // 이 상태에서 백스페이스를 누르면 결과는 유지되어야 함
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByRole("status")).toHaveTextContent("3");

    // 이후 새 숫자를 입력하면 새 계산 시작
    fireEvent.click(screen.getByRole("button", { name: /숫자 5/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("5");
  });

  it("연속 계산 시 백스페이스는 마지막 입력을 취소해야 한다", () => {
    render(<CalculatorPanel />);

    // 1 + 2 = 3 계산
    fireEvent.click(screen.getByRole("button", { name: /숫자 1/i }));
    fireEvent.click(screen.getByRole("button", { name: /연산자 더하기/i }));
    fireEvent.click(screen.getByRole("button", { name: /숫자 2/i }));
    fireEvent.click(screen.getByRole("button", { name: /계산하기/i }));

    // 결과는 3
    expect(screen.getByRole("status")).toHaveTextContent("3");

    // 이어서 + 4 입력 (3 + 4 상태)
    fireEvent.click(screen.getByRole("button", { name: /연산자 더하기/i }));
    fireEvent.click(screen.getByRole("button", { name: /숫자 4/i }));

    expect(screen.getByLabelText("수식")).toHaveTextContent("3 + 4");

    // 4를 백스페이스로 지우면 "3 +"만 남음
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("3 +");

    // 연산자까지 지우면 "3"만 남음
    fireEvent.click(screen.getByRole("button", { name: /뒤로 가기/i }));
    expect(screen.getByLabelText("수식")).toHaveTextContent("3");
  });
});
