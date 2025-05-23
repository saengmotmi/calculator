import { expect, describe, it } from "vitest";
import {
  CalculatorState,
  CalculatorStatus,
  initialCalculatorState,
  Token,
} from "../../core/calculator/domain/CalculatorState";

describe("CalculatorState 단위 테스트", () => {
  describe("초기 상태", () => {
    it("초기 상태가 올바르게 정의되어 있다", () => {
      const state = initialCalculatorState;

      expect(state.tokens).toEqual([]);
      expect(state.currentInput).toBe("");
      expect(state.result).toBeNull();
      expect(state.status).toBe(CalculatorStatus.INPUT);
      expect(state.errorMessage).toBeNull();
    });
  });

  describe("토큰 타입", () => {
    it("숫자 토큰을 올바르게 생성할 수 있다", () => {
      const token: Token = {
        type: "NUMBER",
        value: "123",
      };

      expect(token.type).toBe("NUMBER");
      expect(token.value).toBe("123");
    });

    it("연산자 토큰을 올바르게 생성할 수 있다", () => {
      const token: Token = {
        type: "OPERATOR",
        value: "+",
      };

      expect(token.type).toBe("OPERATOR");
      expect(token.value).toBe("+");
    });

    it("괄호 토큰을 올바르게 생성할 수 있다", () => {
      const leftParen: Token = {
        type: "LEFT_PAREN",
        value: "(",
      };

      const rightParen: Token = {
        type: "RIGHT_PAREN",
        value: ")",
      };

      expect(leftParen.type).toBe("LEFT_PAREN");
      expect(rightParen.type).toBe("RIGHT_PAREN");
    });
  });

  describe("상태 변경", () => {
    it("상태를 복사하여 새로운 상태를 만들 수 있다", () => {
      const newState: CalculatorState = {
        ...initialCalculatorState,
        currentInput: "123",
        status: CalculatorStatus.INPUT,
      };

      expect(newState.currentInput).toBe("123");
      expect(newState.status).toBe(CalculatorStatus.INPUT);
      expect(initialCalculatorState.currentInput).toBe(""); // 원본은 변경되지 않음
    });

    it("에러 상태를 설정할 수 있다", () => {
      const errorState: CalculatorState = {
        ...initialCalculatorState,
        status: CalculatorStatus.ERROR,
        errorMessage: "0으로 나눌 수 없습니다",
      };

      expect(errorState.status).toBe(CalculatorStatus.ERROR);
      expect(errorState.errorMessage).toBe("0으로 나눌 수 없습니다");
    });

    it("결과 상태를 설정할 수 있다", () => {
      const resultState: CalculatorState = {
        ...initialCalculatorState,
        result: "42",
        status: CalculatorStatus.RESULT,
      };

      expect(resultState.result).toBe("42");
      expect(resultState.status).toBe(CalculatorStatus.RESULT);
    });
  });
});
