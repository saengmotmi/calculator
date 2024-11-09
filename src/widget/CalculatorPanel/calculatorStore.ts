import { OPERATORS } from "../../entities/evaluators/arithmetics";
import { ArithmeticCalculator } from "../../features/calculator/ArithmeticCalculator";

type Listener = () => void;

class CalculatorStore {
  private calculator = new ArithmeticCalculator();
  private listeners: Set<Listener> = new Set();

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    return {
      expression: this.calculator.getExpression(),
      result: this.calculator.evaluate(),
    };
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
    this.notify();
  }

  clear() {
    this.calculator.clear();
    this.notify();
  }

  backspace() {
    this.calculator.undo();
    this.notify();
  }

  calculate() {
    try {
      this.calculator.evaluate();
      this.notify();
    } catch (error) {
      console.error("Calculation error:", error);
    }
  }
}

export const calculatorStore = new CalculatorStore();
