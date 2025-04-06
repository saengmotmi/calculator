import { CalculatorModel } from "../../entities/calculator/CalculatorModel";
import { CalculatorMode } from "../../entities/calculator/CalculatorState";

type Listener = () => void;

/**
 * 계산기 UI 상태 관리를 위한 스토어
 */
class CalculatorStore {
  private model: CalculatorModel;
  private listeners: Set<Listener> = new Set();
  private lastSnapshot: { expression: string; result: number | null } | null =
    null;

  constructor() {
    this.model = new CalculatorModel();
  }

  /**
   * 상태 변경 리스너 등록
   */
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * 현재 상태 스냅샷 반환
   */
  getSnapshot = () => {
    const state = this.model.getState();

    // 이전 스냅샷과 동일하면 기존 객체 반환 (성능 최적화)
    if (
      this.lastSnapshot &&
      this.lastSnapshot.expression === state.expression &&
      this.lastSnapshot.result === state.result
    ) {
      return this.lastSnapshot;
    }

    // 새로운 스냅샷 생성 및 캐싱
    this.lastSnapshot = {
      expression: state.expression,
      result: state.result,
    };
    return this.lastSnapshot;
  };

  /**
   * 리스너에 상태 변경 알림
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 통합 입력 처리 - 모든 입력 타입을 단일 메서드로 처리
   */
  input(value: string): void {
    this.model.input(value);
    this.notify();
  }

  /**
   * 수식 계산
   */
  calculate(): void {
    this.model.calculate();
    this.notify();
  }

  /**
   * 모든 상태 초기화
   */
  clear(): void {
    this.model.clearAll();
    this.notify();
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    this.model.backspace();
    this.notify();
  }
}

export const calculatorStore = new CalculatorStore();
