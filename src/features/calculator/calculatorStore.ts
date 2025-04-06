import { OPERATORS } from "../../entities/evaluators/basicMath";
import { BasicMathCalculator } from "./BasicMathCalculator";
import { EnhancedCalculator } from "./EnhancedCalculator";
import { ICalculator } from "./ICalculator";

type Listener = () => void;

class CalculatorStore {
  private calculator: ICalculator;
  private listeners: Set<Listener> = new Set();

  private result: number | null = null; // 캐시된 결과
  private lastSnapshot: { expression: string; result: number | null } | null =
    null; // 마지막 스냅샷

  constructor(useNewImplementation: boolean = true) {
    // 환경 변수 또는 구성에 따라 새 구현 사용 여부 결정
    this.calculator = useNewImplementation
      ? new EnhancedCalculator()
      : new BasicMathCalculator();
  }

  /**
   * 새로운 구현으로 전환
   */
  switchToNewImplementation(): void {
    if (this.calculator instanceof EnhancedCalculator) {
      return; // 이미 EnhancedCalculator를 사용 중
    }
    this.calculator = new EnhancedCalculator();
    this.result = null;
    this.notify();
  }

  /**
   * 기존 구현으로 전환
   */
  switchToLegacyImplementation(): void {
    if (this.calculator instanceof BasicMathCalculator) {
      return; // 이미 BasicMathCalculator를 사용 중
    }
    this.calculator = new BasicMathCalculator();
    this.result = null;
    this.notify();
  }

  /**
   * 현재 어떤 구현을 사용 중인지 반환
   */
  isUsingNewImplementation(): boolean {
    return this.calculator instanceof EnhancedCalculator;
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
    } else if (Object.values(OPERATORS).includes(value as OPERATORS)) {
      this.calculator.inputOperator(value);
    }
    this.result = null; // 새로운 입력이 있을 때 결과를 초기화
    this.notify();
  }

  clear() {
    this.calculator.clearAll();
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

// 기본적으로 새 구현 사용
export const calculatorStore = new CalculatorStore(true);
