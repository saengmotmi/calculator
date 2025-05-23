# 테스트 구조 가이드

이 프로젝트는 체계적인 테스트 구조를 통해 코드 품질과 안정성을 보장합니다.

## 📁 디렉토리 구조

```
src/__tests__/
├── unit/           # 단위 테스트
├── integration/    # 통합 테스트
├── e2e/           # E2E 테스트 (향후 추가 예정)
└── README.md      # 이 문서
```

## 🧪 테스트 유형별 설명

### Unit Tests (단위 테스트)

- **위치**: `src/__tests__/unit/`
- **목적**: 개별 모듈, 함수, 클래스의 독립적인 동작 검증
- **특징**:
  - 외부 의존성 없이 실행
  - 빠른 실행 속도
  - 높은 코드 커버리지

**현재 테스트 파일:**

- `CalculatorCore.spec.ts` - 계산기 핵심 로직 테스트
- `CalculatorState.spec.ts` - 상태 모델 테스트

### Integration Tests (통합 테스트)

- **위치**: `src/__tests__/integration/`
- **목적**: 여러 모듈 간의 상호작용 검증
- **특징**:
  - 실제 의존성을 사용
  - 데이터 흐름 검증
  - 시스템 경계 테스트

**현재 테스트 파일:**

- `CalculatorIntegration.spec.ts` - Core와 Store 간 통합 테스트

### E2E Tests (End-to-End 테스트)

- **위치**: `src/__tests__/e2e/`
- **목적**: 사용자 관점에서의 전체 시나리오 검증
- **특징**:
  - 실제 사용자 워크플로우 시뮬레이션
  - UI 상호작용 테스트
  - 접근성 검증

**향후 추가 예정:**

- React Testing Library를 활용한 UI 테스트
- 키보드 네비게이션 테스트
- 접근성 표준 준수 검증

## 🚀 테스트 실행 방법

```bash
# 모든 테스트 실행
npm test

# 단위 테스트만 실행
npm test -- --testPathPattern=unit

# 통합 테스트만 실행
npm test -- --testPathPattern=integration

# 특정 파일 테스트
npm test CalculatorCore.spec.ts

# 커버리지 포함 실행
npm test -- --coverage
```

## 📋 테스트 작성 가이드라인

### 1. 테스트 파일 명명 규칙

- 단위 테스트: `{ModuleName}.spec.ts`
- 통합 테스트: `{FeatureName}Integration.spec.ts`
- E2E 테스트: `{FeatureName}.e2e.spec.tsx`

### 2. 테스트 구조

```typescript
describe("모듈/기능 이름", () => {
  describe("세부 기능 그룹", () => {
    it("구체적인 동작을 설명", () => {
      // Given (준비)
      // When (실행)
      // Then (검증)
    });
  });
});
```

### 3. 테스트 작성 원칙

- **AAA 패턴**: Arrange, Act, Assert
- **단일 책임**: 하나의 테스트는 하나의 동작만 검증
- **독립성**: 테스트 간 의존성 없음
- **반복 가능**: 언제든 동일한 결과

### 4. Mock 사용 가이드

- 단위 테스트: 외부 의존성은 모두 Mock
- 통합 테스트: 핵심 로직은 실제 구현 사용
- E2E 테스트: 실제 환경과 최대한 유사하게

## 🎯 테스트 커버리지 목표

- **단위 테스트**: 90% 이상
- **통합 테스트**: 주요 사용자 시나리오 100%
- **E2E 테스트**: 핵심 워크플로우 100%

## 🔧 테스트 도구

- **테스트 러너**: Vitest
- **어설션 라이브러리**: Vitest (내장)
- **React 테스트**: React Testing Library
- **Mock 라이브러리**: Vitest (내장)

## 📈 지속적 개선

테스트는 코드와 함께 진화해야 합니다:

1. **새 기능 추가 시**: 해당하는 모든 레벨의 테스트 작성
2. **버그 수정 시**: 회귀 방지를 위한 테스트 추가
3. **리팩토링 시**: 테스트가 여전히 유효한지 검증
4. **정기적 검토**: 테스트 커버리지와 품질 점검

---

**참고**: 이 테스트 구조는 프로젝트의 성장과 함께 지속적으로 개선됩니다.
