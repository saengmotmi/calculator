/**
 * 범용 상태 관리 스토어
 * 구독/알림 패턴을 구현하는 기본 클래스
 */
export abstract class Store<T> {
  private listeners: Set<() => void> = new Set();
  private cachedSnapshot: T | null = null;
  private isSnapshotValid: boolean = false;

  /**
   * 상태 변경 리스너 등록
   */
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * 현재 상태 스냅샷 반환
   * 캐싱을 통해 불필요한 재계산 방지
   */
  getSnapshot = (): T => {
    if (this.isSnapshotValid && this.cachedSnapshot !== null) {
      return this.cachedSnapshot;
    }

    const newSnapshot = this.createSnapshot();
    this.cachedSnapshot = newSnapshot;
    this.isSnapshotValid = true;
    return newSnapshot;
  };

  /**
   * 상태 변경 알림
   */
  protected notify(): void {
    this.isSnapshotValid = false; // 캐시 무효화
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 스냅샷 생성 (하위 클래스에서 구현)
   */
  protected abstract createSnapshot(): T;
}
