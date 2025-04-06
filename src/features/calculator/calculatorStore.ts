import { CalculatorCore } from "../../core/calculator/CalculatorCore";
import { CalculatorEvent } from "../../core/calculator/domain/CalculatorEvent";
import {
  CalculatorDisplayData,
  CalculatorPresenter,
} from "../../core/calculator/CalculatorPresenter";

type Listener = () => void;

/**
 * UI에 반환되는 스냅샷 인터페이스 (레거시 호환성)
 */
interface CalculatorSnapshot {
  expression: string;
  result: number | null;
}

/**
 * 계산기 UI 상태 관리 스토어
 * UI와 도메인 모델 사이의 중재자 역할
 */
class CalculatorStore {
  private core: CalculatorCore;
  private presenter: CalculatorPresenter;
  private listeners: Set<Listener> = new Set();
  private cachedDisplayData: CalculatorDisplayData | null = null;
  private cachedSnapshot: CalculatorSnapshot | null = null;

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
   * 현재 UI 데이터를 레거시 스냅샷 형식으로 변환 (안전한 메모이제이션)
   */
  getSnapshot = (): CalculatorSnapshot => {
    // 현재 표시 데이터 가져오기
    const displayData = this.presenter.getDisplayData();

    // 이전과 동일한 데이터인지 확인 (참조 비교가 아닌 내용 비교)
    if (
      this.cachedDisplayData &&
      this.cachedSnapshot &&
      this.cachedDisplayData.displayText === displayData.displayText &&
      this.cachedDisplayData.resultText === displayData.resultText
    ) {
      return this.cachedSnapshot; // 캐시된 스냅샷 재사용
    }

    // 새 스냅샷 생성
    const newSnapshot = {
      expression: displayData.displayText,
      result: displayData.resultText ? Number(displayData.resultText) : null,
    };

    // 캐시 업데이트
    this.cachedDisplayData = { ...displayData };
    this.cachedSnapshot = newSnapshot;

    return newSnapshot;
  };

  /**
   * 상태 변경 알림
   */
  private notify(): void {
    // 캐시 초기화 (상태가 변경되었으므로)
    this.cachedDisplayData = null;
    this.cachedSnapshot = null;

    // 리스너에 알림
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 계산기 이벤트 전달 및 UI 업데이트
   */
  private dispatch(event: CalculatorEvent): void {
    this.core.apply(event);
    this.notify();
  }

  /**
   * 통합 입력 처리 메서드
   */
  input(value: string): void {
    if (!isNaN(Number(value))) {
      this.dispatch({ type: "DIGIT_INPUT", digit: value });
    } else if (value === "(" || value === ")") {
      this.dispatch({ type: "PARENTHESIS_INPUT", parenthesis: value });
    } else {
      this.dispatch({ type: "OPERATOR_INPUT", operator: value });
    }
  }

  /**
   * 계산 실행
   */
  calculate(): void {
    this.dispatch({ type: "CALCULATE" });
  }

  /**
   * 모든 상태 초기화
   */
  clear(): void {
    this.dispatch({ type: "CLEAR_ALL" });
  }

  /**
   * 백스페이스 처리
   */
  backspace(): void {
    this.dispatch({ type: "BACKSPACE" });
  }
}

export const calculatorStore = new CalculatorStore();
