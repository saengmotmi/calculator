import { CalculatorModel } from "../../entities/calculator/CalculatorModel";
import { ICalculator } from "./ICalculator";

/**
 * 향상된 계산기 클래스: 새로운 도메인 모델을 사용
 */
export class EnhancedCalculator implements ICalculator {
  private model: CalculatorModel;

  constructor() {
    this.model = new CalculatorModel();
  }

  inputNumber(value: string | number): void {
    this.model.input(value.toString());
  }

  inputOperator(value: string): void {
    this.model.input(value);
  }

  inputParenthesis(paren: string): void {
    this.model.input(paren);
  }

  evaluate(): number {
    this.model.calculate();
    const state = this.model.getState();

    // 에러 처리: 0으로 나누기 등의 오류 발생 시 예외 던지기
    if (state.error) {
      // 에러 메시지가 '0으로 나눌 수 없습니다'인 경우, 'Division by zero'로 변환
      if (state.error === "0으로 나눌 수 없습니다") {
        throw new Error("Division by zero");
      }
      throw new Error(state.error);
    }

    return state.result ?? 0;
  }

  clearExpression(): void {
    this.model.clearExpression();
  }

  clearAll(): void {
    this.model.clearAll();
  }

  undo(): void {
    this.model.backspace();
  }

  getExpression(): string {
    return this.model.getState().expression;
  }
}
