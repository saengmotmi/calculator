import { CalculatorCore } from "../../core/calculator/CalculatorCore";
import { CalculatorEvent } from "../../core/calculator/CalculatorEvent";
import { CalculatorPresenter } from "../../core/calculator/CalculatorPresenter";

type Listener = () => void;

/**
 * 계산기 UI 상태 관리를 위한 스토어
 * 모든 UI 조작을 이벤트로 변환하여 도메인 모델에 전달
 */
class CalculatorStore {
  private core: CalculatorCore;
  private presenter: CalculatorPresenter;
  private listeners: Set<Listener> = new Set();
  private lastSnapshot: { expression: string; result: number | null } | null =
    null;

  constructor() {
    // 도메인 코어 및 프레젠터 초기화
    this.core = new CalculatorCore();
    this.presenter = new CalculatorPresenter(this.core);
  }

  /**
   * 상태 변경 리스너 등록
   */
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * 현재 상태 스냅샷 반환 (UI 표시 형식)
   */
  getSnapshot = () => {
    const displayData = this.presenter.getDisplayData();

    // 새로운 스냅샷 생성
    const newSnapshot = {
      expression: displayData.displayText,
      result: displayData.resultText ? Number(displayData.resultText) : null,
    };

    // 이전 스냅샷과 동일하면 기존 객체 반환 (성능 최적화)
    if (
      this.lastSnapshot &&
      this.lastSnapshot.expression === newSnapshot.expression &&
      this.lastSnapshot.result === newSnapshot.result
    ) {
      return this.lastSnapshot;
    }

    // 새로운 스냅샷 저장 및 반환
    this.lastSnapshot = newSnapshot;
    return this.lastSnapshot;
  };

  /**
   * 리스너에 상태 변경 알림
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 계산기 도메인 이벤트 전달
   */
  private dispatchEvent(event: CalculatorEvent): void {
    this.core.apply(event);
    this.notify();
  }

  /**
   * 숫자 입력
   */
  inputNumber(value: string | number): void {
    this.dispatchEvent({
      type: "DIGIT_INPUT",
      digit: value.toString(),
    });
  }

  /**
   * 연산자 입력
   */
  inputOperator(value: string): void {
    this.dispatchEvent({
      type: "OPERATOR_INPUT",
      operator: value,
    });
  }

  /**
   * 괄호 입력
   */
  inputParenthesis(value: string): void {
    this.dispatchEvent({
      type: "PARENTHESIS_INPUT",
      parenthesis: value,
    });
  }

  /**
   * 통합 입력 처리 메서드
   */
  input(value: string): void {
    // 입력 타입에 따른 이벤트 생성 및 전달
    if (!isNaN(Number(value))) {
      this.inputNumber(value);
    } else if (value === "(" || value === ")") {
      this.inputParenthesis(value);
    } else {
      this.inputOperator(value);
    }
  }

  /**
   * 계산 실행
   */
  calculate(): void {
    this.dispatchEvent({ type: "CALCULATE" });
  }

  /**
   * 모든 상태 초기화
   */
  clear(): void {
    this.dispatchEvent({ type: "CLEAR_ALL" });
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    this.dispatchEvent({ type: "BACKSPACE" });
  }
}

export const calculatorStore = new CalculatorStore();
