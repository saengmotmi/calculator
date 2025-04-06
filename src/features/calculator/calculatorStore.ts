import { OperatorType } from "../../entities/tokens/OperatorType";
import { EnhancedCalculator } from "./EnhancedCalculator";
import { ICalculator } from "./ICalculator";

type Listener = () => void;

class CalculatorStore {
  private calculator: ICalculator;
  private listeners: Set<Listener> = new Set();

  private result: number | null = null; // 캐시된 결과
  private lastSnapshot: { expression: string; result: number | null } | null =
    null; // 마지막 스냅샷

  constructor() {
    this.calculator = new EnhancedCalculator();
  }

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
    } else if (Object.values(OperatorType).includes(value as OperatorType)) {
      // 계산 후 연산자 입력 시 이전 결과를 유지
      this.calculator.inputOperator(value);
    }
    this.notify();
  }

  clear() {
    this.calculator.clearAll();
    this.result = null;
    this.notify();
  }

  backspace() {
    // 계산 결과가 있는 경우(this.result가 non-null) 결과 값을 유지
    const hadResult = this.result !== null;

    this.calculator.undo();

    // 계산 후 첫 백스페이스는 결과를 유지
    if (!hadResult) {
      this.result = null;
    }

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
