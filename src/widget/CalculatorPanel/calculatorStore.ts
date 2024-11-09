import { OPERATORS } from "../../entities/evaluators/arithmetics";
import { ArithmeticCalculator } from "../../features/calculator/ArithmeticCalculator";

type Listener = () => void;

class CalculatorStore {
  private calculator = new ArithmeticCalculator();
  private listeners: Set<Listener> = new Set();

  private result: number | null = null; // 캐시된 결과
  private lastSnapshot: { expression: string; result: number | null } | null =
    null; // 마지막 스냅샷

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    const expression = this.calculator.getExpression();

    // 이전 스냅샷과 동일하면 기존 객체 반환
    if (
      this.lastSnapshot &&
      this.lastSnapshot.expression === expression &&
      this.lastSnapshot.result === this.result
    ) {
      return this.lastSnapshot;
    }

    // 새로운 스냅샷 생성 및 캐싱
    this.lastSnapshot = {
      expression,
      result: this.result,
    };
    return this.lastSnapshot;
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  input(value: string) {
    if (!isNaN(Number(value))) {
      this.calculator.inputNumber(value);
    } else if (value === "(" || value === ")") {
      this.calculator.inputParenthesis(value);
    } else if (Object.values(OPERATORS).includes(value as OPERATORS)) {
      this.calculator.inputOperator(value as OPERATORS);
    }
    this.result = null; // 새로운 입력이 있을 때 결과를 초기화
    this.notify();
  }

  clear() {
    this.calculator.clear();
    this.result = null;
    this.notify();
  }

  backspace() {
    this.calculator.undo();
    this.result = null;
    this.notify();
  }

  calculate() {
    try {
      this.result = this.calculator.evaluate(); // 계산 결과를 캐시에 저장
      this.notify();
    } catch (error) {
      console.error("Calculation error:", error);
      this.result = null;
      this.notify();
    }
  }
}

export const calculatorStore = new CalculatorStore();
