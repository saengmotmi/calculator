import { ICalculator } from "./ICalculator";
import { MathCalculator } from "./MathCalculator";

/**
 * 향상된 계산기 클래스: 새로운 파서/렉서를 사용
 */
export class EnhancedCalculator implements ICalculator {
  private calculator: MathCalculator;

  constructor() {
    this.calculator = new MathCalculator();
  }

  inputNumber(value: string | number): void {
    this.calculator.inputNumber(value);
  }

  inputOperator(value: string): void {
    this.calculator.inputOperator(value);
  }

  inputParenthesis(paren: string): void {
    this.calculator.inputParenthesis(paren);
  }

  evaluate(): number {
    return this.calculator.evaluate();
  }

  clearExpression(): void {
    this.calculator.clearExpression();
  }

  clearAll(): void {
    this.calculator.clearAll();
  }

  undo(): void {
    this.calculator.undo();
  }

  getExpression(): string {
    return this.calculator.getExpression();
  }
}
