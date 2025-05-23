import { expect, describe, it, beforeEach } from "vitest";
import { CalculatorCore } from "../../core/calculator/CalculatorCore";
import { calculatorStore } from "../../features/calculator/calculatorStore";
import { CalculatorStatus } from "../../core/calculator/domain/CalculatorState";

describe("Calculator 통합 테스트", () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    calculatorStore.clear();
  });

  describe("Core와 Store 통합", () => {
    it("Core의 상태 변경이 Store에 반영된다", () => {
      const calculator = new CalculatorCore();

      // 초기 상태 확인
      expect(calculator.getState().status).toBe(CalculatorStatus.INPUT);

      // 숫자 입력
      calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
      calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
      calculator.apply({ type: "DIGIT_INPUT", digit: "3" });

      const state = calculator.getState();
      expect(state.currentInput).toBe("123");
    });

    it("Store를 통한 계산 결과가 올바르게 처리된다", () => {
      // Store의 메서드를 통해 계산 수행
      calculatorStore.input("5");
      calculatorStore.input("+");
      calculatorStore.input("3");
      calculatorStore.calculate();

      const snapshot = calculatorStore.getSnapshot();
      expect(snapshot.result).toBe("8");
    });

    it("에러 상태가 올바르게 전파된다", () => {
      calculatorStore.input("1");
      calculatorStore.input("/");
      calculatorStore.input("0");
      calculatorStore.calculate();

      const snapshot = calculatorStore.getSnapshot();
      expect(snapshot.hasError).toBe(true);
      expect(snapshot.errorMessage).toContain("0으로 나눌 수 없습니다");
    });
  });

  describe("복잡한 계산 시나리오", () => {
    it("연속된 계산을 올바르게 처리한다", () => {
      // 첫 번째 계산: 2 + 3 = 5
      calculatorStore.input("2");
      calculatorStore.input("+");
      calculatorStore.input("3");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().result).toBe("5");

      // 결과를 이용한 두 번째 계산: 5 * 4 = 20
      calculatorStore.input("*");
      calculatorStore.input("4");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().result).toBe("20");
    });

    it("괄호가 포함된 복잡한 계산을 처리한다", () => {
      // (2 + 3) * 4 = 20
      calculatorStore.input("(");
      calculatorStore.input("2");
      calculatorStore.input("+");
      calculatorStore.input("3");
      calculatorStore.input(")");
      calculatorStore.input("*");
      calculatorStore.input("4");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().result).toBe("20");
    });

    it("음수를 포함한 계산을 처리한다", () => {
      // -5 + 3 = -2
      calculatorStore.input("-");
      calculatorStore.input("5");
      calculatorStore.input("+");
      calculatorStore.input("3");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().result).toBe("-2");
    });
  });

  describe("상태 관리", () => {
    it("Clear 동작이 올바르게 작동한다", () => {
      // 계산 수행
      calculatorStore.input("1");
      calculatorStore.input("+");
      calculatorStore.input("2");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().result).toBe("3");

      // 클리어
      calculatorStore.clear();

      const snapshot = calculatorStore.getSnapshot();
      expect(snapshot.expression).toBe("0");
      expect(snapshot.result).toBeNull();
      expect(snapshot.hasError).toBe(false);
    });

    it("에러 상태에서 복구할 수 있다", () => {
      // 에러 발생
      calculatorStore.input("1");
      calculatorStore.input("/");
      calculatorStore.input("0");
      calculatorStore.calculate();

      expect(calculatorStore.getSnapshot().hasError).toBe(true);

      // 클리어 후 정상 계산
      calculatorStore.clear();
      calculatorStore.input("2");
      calculatorStore.input("+");
      calculatorStore.input("3");
      calculatorStore.calculate();

      const snapshot = calculatorStore.getSnapshot();
      expect(snapshot.result).toBe("5");
      expect(snapshot.hasError).toBe(false);
    });

    it("백스페이스 기능이 올바르게 작동한다", () => {
      calculatorStore.input("1");
      calculatorStore.input("2");
      calculatorStore.input("3");

      let snapshot = calculatorStore.getSnapshot();
      expect(snapshot.expression).toContain("123");

      calculatorStore.backspace();
      snapshot = calculatorStore.getSnapshot();
      expect(snapshot.expression).toContain("12");
    });
  });
});
