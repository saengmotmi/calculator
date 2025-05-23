import { Store } from "../../shared/store/Store";
import { CalculatorService } from "./CalculatorService";
import {
  CalculatorState,
  CalculatorStatus,
} from "../../core/calculator/domain/CalculatorState";
import { stateToString } from "../../core/calculator/CalculatorPresenter";

/**
 * UI에 반환되는 스냅샷 인터페이스
 */
interface CalculatorSnapshot {
  expression: string;
  result: string | null;
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * 계산기 UI 상태 관리 스토어
 * Store 패턴을 상속받아 상태 관리에만 집중
 * 표현 로직은 Store 내부에서 처리하여 UI 호환성 유지
 */
class CalculatorStore extends Store<CalculatorSnapshot> {
  private service: CalculatorService;

  constructor() {
    super();
    this.service = new CalculatorService();
  }

  /**
   * 스냅샷 생성 (Store 추상 메서드 구현)
   * 도메인 상태를 UI 스냅샷으로 변환
   */
  protected createSnapshot(): CalculatorSnapshot {
    const state = this.service.getState();

    // 에러 상태 처리
    if (state.status === CalculatorStatus.ERROR && state.errorMessage) {
      return {
        expression: state.errorMessage,
        result: null,
        hasError: true,
        errorMessage: state.errorMessage,
      };
    }

    // 결과 상태 처리
    if (state.status === CalculatorStatus.RESULT && state.result !== null) {
      return {
        expression: state.result,
        result: state.result,
        hasError: false,
        errorMessage: null,
      };
    }

    // 입력 상태 처리
    const expression = stateToString(state);
    return {
      expression,
      result: null,
      hasError: false,
      errorMessage: null,
    };
  }

  /**
   * 통합 입력 처리
   */
  input(value: string): void {
    this.service.input(value);
    this.notify();
  }

  /**
   * 계산 실행
   */
  calculate(): void {
    this.service.calculate();
    this.notify();
  }

  /**
   * 모든 상태 초기화
   */
  clear(): void {
    this.service.clear();
    this.notify();
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    this.service.backspace();
    this.notify();
  }
}

export const calculatorStore = new CalculatorStore();
