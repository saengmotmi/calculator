# 모던 계산기 애플리케이션

![alt text](ui.png)

## 개요

이 프로젝트는 관심사 분리, 도메인 주도 설계, 유지보수 가능한 코드 구조에 중점을 둔 클린 아키텍처 접근 방식으로 구축된 현대적인 계산기 애플리케이션입니다. 이 계산기는 표준 산술 연산, 큰 숫자에 대한 정밀 계산을 지원하며, 0으로 나누기 및 표현식 유효성 검사와 같은 예외 상황을 처리합니다.

## 아키텍처

애플리케이션은 다음과 같은 명확한 레이어가 있는 클린 아키텍처 패턴을 따릅니다:

```mermaid
graph TD
    UI[UI 레이어] --> Store[상태 관리 레이어]
    Store --> Service[서비스 레이어]
    Service --> Domain[도메인 레이어]
    Domain --> Algorithm[알고리즘 레이어]

    subgraph "UI 레이어"
        CalculatorPanel[CalculatorPanel]
        Display[Display]
        Button[Button]
    end

    subgraph "상태 관리 레이어"
        CalculatorStore[CalculatorStore]
        BaseStore[Store<T>]
    end

    subgraph "서비스 레이어"
        CalculatorService[CalculatorService]
        CalculatorPresenter[CalculatorPresenter]
    end

    subgraph "도메인 레이어"
        CalculatorDomain[CalculatorDomain.ts]
        CalculatorState[CalculatorState.ts]
        CalculatorEvent[CalculatorEvent.ts]
    end

    subgraph "알고리즘 레이어"
        ShuntingYard[ShuntingYard.ts]
        Calculator[Calculator.ts]
        BigNumber[BigNumber.ts]
    end
```

### 상태 관리 레이어

상태 관리 레이어는 UI 상태와 구독/알림 패턴을 담당합니다:

- **Store<T>**: 범용 상태 관리 기반 클래스 (구독/알림 패턴)
- **CalculatorStore**: 계산기 전용 상태 관리 (Store<T> 상속)

### 서비스 레이어

서비스 레이어는 비즈니스 로직과 프레젠테이션 로직을 담당합니다:

- **CalculatorService**: 계산기 비즈니스 로직 처리
- **CalculatorPresenter**: 도메인 상태를 UI 표시 형식으로 변환

### 도메인 레이어

도메인 레이어는 계산기의 핵심 비즈니스 로직을 포함합니다:

- **CalculatorDomain.ts**: 계산기 작업을 위한 도메인 로직 구현
- **CalculatorState.ts**: 상태 구조 및 타입 정의
- **CalculatorEvent.ts**: 계산기 도메인 내에서 트리거될 수 있는 이벤트 정의

### 알고리즘 레이어

알고리즘 레이어는 도메인 관심사와 분리된 수학적 알고리즘을 포함합니다:

- **ShuntingYard.ts**: 중위 표현식을 후위 표기법으로 변환하기 위한 Shunting Yard 알고리즘 구현
- **Calculator.ts**: 표현식 평가 및 계산 오류 처리를 위한 로직 포함
- **BigNumber.ts**: 대규모 숫자 및 높은 정밀도가 필요한 연산을 위한 정밀 계산 제공

### UI 레이어

- **CalculatorPanel**: 계산기 UI의 메인 컴포넌트로, 디스플레이와 버튼을 관리
- **Display.tsx**: 계산기 화면을 렌더링하고 현재 입력 또는 결과값 표시
- **Button**: 숫자 및 연산자 입력을 위한 버튼 컴포넌트

## 주요 설계 원칙

1. **관심사 분리**: 상태 관리, 비즈니스 로직, 도메인 로직, 알고리즘이 명확하게 분리됨
2. **단일 책임 원칙**: 각 클래스와 모듈이 하나의 명확한 책임만 가짐
3. **의존성 역전**: 상위 레이어가 하위 레이어에 의존하는 구조
4. **순수 함수**: 핵심 알고리즘은 더 나은 테스트 가능성과 유지보수를 위해 순수 함수로 구현됨
5. **도메인 주도 설계**: 구조가 명확한 경계를 가진 계산기의 도메인 모델을 반영함

## 데이터 흐름

```mermaid
sequenceDiagram
    participant UI as UI 레이어
    participant Store as CalculatorStore
    participant Service as CalculatorService
    participant Domain as 도메인 레이어
    participant Algorithm as 알고리즘 레이어

    UI->>Store: 사용자 입력
    Store->>Service: 비즈니스 로직 호출
    Service->>Domain: 도메인 이벤트 전달
    Domain->>Algorithm: 계산 요청

    alt 성공
        Algorithm-->>Domain: 계산 결과
        Domain-->>Service: 업데이트된 상태
        Service-->>Store: 표시 데이터
        Store-->>UI: 상태 변경 알림
    else 오류
        Algorithm-->>Domain: 알고리즘 오류
        Domain-->>Service: 도메인 오류
        Service-->>Store: 오류 표시 데이터
        Store-->>UI: 오류 상태 알림
    end
```

## 테스트 구조

애플리케이션은 체계적인 테스트 구조를 통해 코드 품질과 안정성을 보장합니다:

```
src/__tests__/
├── unit/           # 단위 테스트
│   ├── CalculatorCore.spec.ts
│   ├── CalculatorState.spec.ts
│   ├── BigNumberCalculations.spec.ts
│   ├── EnhancedCalculator.spec.ts
│   └── backspaceTest.spec.tsx
├── integration/    # 통합 테스트
│   ├── CalculatorIntegration.spec.ts
│   └── index.spec.tsx
├── e2e/           # E2E 테스트 (향후 추가 예정)
└── README.md      # 테스트 가이드
```

### 테스트 커버리지

- **단위 테스트**: 도메인 로직, 수학적 알고리즘의 개별 기능 검증
- **통합 테스트**: 여러 모듈 간의 상호작용 및 데이터 흐름 검증
- **E2E 테스트**: 사용자 관점에서의 전체 시나리오 검증 (향후 추가)

## 시작하기

### 설치

```bash
yarn install
```

### 애플리케이션 실행

```bash
yarn dev
```

### 테스트 실행

```bash
# 모든 테스트 실행
yarn test

# 단위 테스트만 실행
yarn test -- --testPathPattern=unit

# 통합 테스트만 실행
yarn test -- --testPathPattern=integration

# 커버리지 포함 실행
yarn test -- --coverage
```

## 주요 기능

- ✅ 기본 산술 연산 (+, -, \*, /)
- ✅ 괄호를 이용한 연산 우선순위 처리
- ✅ 음수 입력 및 계산
- ✅ 큰 숫자에 대한 정밀 계산
- ✅ 키보드 입력 지원
- ✅ 접근성 (ARIA) 지원
- ✅ 포괄적인 오류 처리
- ✅ 백스페이스 및 클리어 기능

## 아키텍처 개선사항

### Store/Service 분리

- **이전**: `CalculatorStore`에 상태 관리와 비즈니스 로직이 결합
- **개선**:
  - `Store<T>`: 범용 상태 관리 패턴
  - `CalculatorStore`: 계산기 전용 상태 관리
  - `CalculatorService`: 비즈니스 로직 전담

### 장점

1. **재사용성**: `Store<T>` 패턴을 다른 기능에도 활용 가능
2. **테스트 용이성**: 각 레이어를 독립적으로 테스트 가능
3. **유지보수성**: 책임이 명확하게 분리되어 변경 영향도 최소화
4. **확장성**: 새로운 기능 추가 시 기존 구조 재활용 가능
