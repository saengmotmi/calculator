import {
  CalculatorErrorType,
  CalculatorMode,
  CalculatorState,
  Token,
  initialCalculatorState,
} from "./CalculatorState";
import {
  convertToPostfix,
  ShuntingYardError,
  AlgorithmError,
} from "../algorithms/ShuntingYard";
import {
  shouldUsePreciseCalculation,
  calculateStandard,
  calculateWithPrecision,
  CalculationError,
  CalculationErrorInfo,
} from "../algorithms/Calculator";

/**
 * 알고리즘 오류를 도메인 오류로 변환
 */
function mapAlgorithmErrorToDomainError(error: AlgorithmError): {
  type: CalculatorErrorType;
  details: string;
} {
  switch (error.type) {
    case ShuntingYardError.MISMATCHED_PARENTHESES:
      return {
        type: CalculatorErrorType.SYNTAX_ERROR,
        details: "괄호가 맞지 않습니다",
      };
    case ShuntingYardError.INVALID_TOKEN:
      return {
        type: CalculatorErrorType.SYNTAX_ERROR,
        details: "잘못된 수식 형식입니다",
      };
    default:
      return {
        type: CalculatorErrorType.UNKNOWN_ERROR,
        details: error.details || "알 수 없는 오류가 발생했습니다",
      };
  }
}

/**
 * 계산 오류를 도메인 오류로 변환
 */
function mapCalculationErrorToDomainError(error: CalculationErrorInfo): {
  type: CalculatorErrorType;
  details: string;
} {
  switch (error.type) {
    case CalculationError.DIVISION_BY_ZERO:
      return {
        type: CalculatorErrorType.DIVISION_BY_ZERO,
        details: "0으로 나눌 수 없습니다",
      };
    case CalculationError.INCOMPLETE_EXPRESSION:
      return {
        type: CalculatorErrorType.INCOMPLETE_EXPRESSION,
        details: "수식이 완전하지 않습니다",
      };
    case CalculationError.INVALID_OPERATOR:
      return {
        type: CalculatorErrorType.SYNTAX_ERROR,
        details: "올바르지 않은 연산자입니다",
      };
    case CalculationError.OVERFLOW:
      return {
        type: CalculatorErrorType.UNKNOWN_ERROR,
        details: "계산 결과가 너무 큽니다",
      };
    default:
      return {
        type: CalculatorErrorType.UNKNOWN_ERROR,
        details: error.details || "계산 중 오류가 발생했습니다",
      };
  }
}

/**
 * 숫자 토큰 생성
 */
export function createNumberToken(value: string): Token {
  return { type: "NUMBER", value };
}

/**
 * 연산자 토큰 생성
 */
export function createOperatorToken(value: string): Token {
  return { type: "OPERATOR", value };
}

/**
 * 왼쪽 괄호 토큰 생성
 */
export function createLeftParenToken(): Token {
  return { type: "LEFT_PAREN", value: "(" };
}

/**
 * 오른쪽 괄호 토큰 생성
 */
export function createRightParenToken(): Token {
  return { type: "RIGHT_PAREN", value: ")" };
}

/**
 * 숫자 입력 처리
 */
export function applyDigitInput(
  state: CalculatorState,
  digit: string
): CalculatorState {
  // 결과 상태에서는 새 계산 시작
  if (state.mode === CalculatorMode.RESULT) {
    return {
      ...initialCalculatorState,
      currentInput: digit,
    };
  }

  // 에러 상태에서는 초기화 후 입력
  if (state.mode === CalculatorMode.ERROR) {
    return {
      ...initialCalculatorState,
      currentInput: digit,
    };
  }

  // 일반 상태에서는 현재 입력에 숫자 추가
  return {
    ...state,
    currentInput: state.currentInput + digit,
  };
}

/**
 * 연산자 입력 처리
 */
export function applyOperatorInput(
  state: CalculatorState,
  operator: string
): CalculatorState {
  // 에러 상태에서는 연산자 무시
  if (state.mode === CalculatorMode.ERROR) {
    return state;
  }

  // 결과 상태에서는 이전 결과를 첫 번째 토큰으로 사용
  if (state.mode === CalculatorMode.RESULT && state.result !== null) {
    return {
      tokens: [
        createNumberToken(state.result.toString()),
        createOperatorToken(operator),
      ],
      currentInput: "",
      result: null,
      mode: CalculatorMode.INPUT,
      error: null,
    };
  }

  // 음수 처리 - 수식이 비어있고 '-' 연산자가 입력된 경우
  if (operator === "-" && state.tokens.length === 0 && !state.currentInput) {
    return {
      ...state,
      currentInput: "-",
    };
  }

  // 현재 입력이 있으면 토큰화
  let newTokens = [...state.tokens];
  if (state.currentInput) {
    newTokens.push(createNumberToken(state.currentInput));
  }
  // 마지막 토큰이 연산자면 교체, 아니면 추가
  else if (newTokens.length > 0) {
    const lastToken = newTokens[newTokens.length - 1];
    if (lastToken.type === "OPERATOR") {
      newTokens = newTokens.slice(0, -1);
    }
  }

  // 연산자 추가
  newTokens.push(createOperatorToken(operator));

  return {
    ...state,
    tokens: newTokens,
    currentInput: "",
    mode: CalculatorMode.INPUT,
  };
}

/**
 * 괄호 입력 처리
 */
export function applyParenthesisInput(
  state: CalculatorState,
  parenthesis: string
): CalculatorState {
  // 에러 상태에서는 괄호 무시
  if (state.mode === CalculatorMode.ERROR) {
    return state;
  }

  // 결과 상태에서 여는 괄호는 새 계산 시작, 닫는 괄호는 결과를 사용
  if (state.mode === CalculatorMode.RESULT) {
    if (parenthesis === "(") {
      return {
        ...initialCalculatorState,
        tokens: [createLeftParenToken()],
      };
    } else if (state.result !== null) {
      return {
        tokens: [
          createNumberToken(state.result.toString()),
          createRightParenToken(),
        ],
        currentInput: "",
        result: null,
        mode: CalculatorMode.INPUT,
        error: null,
      };
    }
  }

  // 새 토큰 배열 생성
  let newTokens = [...state.tokens];

  // 현재 입력이 있으면 토큰으로 변환
  if (state.currentInput) {
    newTokens.push(createNumberToken(state.currentInput));

    // 숫자 뒤에 여는 괄호는 곱셈으로 처리
    if (parenthesis === "(") {
      newTokens.push(createOperatorToken("*"));
    }
  }

  // 괄호 토큰 추가
  if (parenthesis === "(") {
    newTokens.push(createLeftParenToken());
  } else {
    newTokens.push(createRightParenToken());
  }

  return {
    ...state,
    tokens: newTokens,
    currentInput: "",
    mode: CalculatorMode.INPUT,
  };
}

/**
 * 표현식 계산 처리
 */
export function evaluateExpression(state: CalculatorState): CalculatorState {
  try {
    // 입력 중인 숫자가 있으면 토큰에 추가
    let tokensToEvaluate = [...state.tokens];
    if (state.currentInput) {
      tokensToEvaluate.push(createNumberToken(state.currentInput));
    }

    // 토큰이 없으면 0 반환
    if (tokensToEvaluate.length === 0) {
      return {
        ...state,
        result: 0,
        mode: CalculatorMode.RESULT,
      };
    }

    // 정밀 계산이 필요한지 확인
    const needsPreciseCalculation =
      shouldUsePreciseCalculation(tokensToEvaluate);

    let postfixTokens: Token[];

    try {
      // 중위 표기식을 후위 표기식으로 변환
      postfixTokens = convertToPostfix(tokensToEvaluate);
    } catch (algorithmError) {
      // Shunting Yard 알고리즘 오류를 도메인 오류로 변환
      const domainError = mapAlgorithmErrorToDomainError(
        algorithmError as AlgorithmError
      );
      throw domainError;
    }

    try {
      // 계산 수행 (필요시 정밀 계산 사용)
      const result = needsPreciseCalculation
        ? calculateWithPrecision(postfixTokens)
        : calculateStandard(postfixTokens);

      // 결과 반환
      return {
        tokens: [],
        currentInput: "",
        result,
        mode: CalculatorMode.RESULT,
        error: null,
      };
    } catch (calculationError) {
      // 계산 알고리즘 오류를 도메인 오류로 변환
      const domainError = mapCalculationErrorToDomainError(
        calculationError as CalculationErrorInfo
      );
      throw domainError;
    }
  } catch (err) {
    return {
      ...state,
      mode: CalculatorMode.ERROR,
      error: err as { type: CalculatorErrorType; details: string },
    };
  }
}

/**
 * 백스페이스 처리
 * 도메인 규칙에 따라 상태를 일관되게 관리합니다.
 */
export function applyBackspace(state: CalculatorState): CalculatorState {
  // 에러 상태에서는 초기화
  if (state.mode === CalculatorMode.ERROR) {
    return { ...initialCalculatorState };
  }

  // 결과 상태에서는 결과를 토큰으로 변환하고 입력 모드로 전환
  if (state.mode === CalculatorMode.RESULT) {
    const result = state.result;
    return {
      tokens: result !== null ? [createNumberToken(result.toString())] : [],
      currentInput: "",
      result: null,
      mode: CalculatorMode.INPUT,
      error: null,
    };
  }

  // 현재 입력이 있으면 마지막 문자 삭제
  if (state.currentInput.length > 0) {
    return {
      ...state,
      currentInput: state.currentInput.slice(0, -1),
    };
  }

  // 토큰이 없으면 변경 없음
  if (state.tokens.length === 0) {
    return state;
  }

  // 마지막 토큰 처리
  const lastToken = state.tokens[state.tokens.length - 1];

  // 숫자 토큰이고 두 자리 이상인 경우: 마지막 자릿수만 제거
  if (lastToken.type === "NUMBER" && lastToken.value.length > 1) {
    const newValue = lastToken.value.slice(0, -1);
    return {
      ...state,
      tokens: [...state.tokens.slice(0, -1), { ...lastToken, value: newValue }],
    };
  }

  // 토큰 자체를 제거 (한 자리 숫자이거나 다른 토큰 타입)
  return {
    ...state,
    tokens: state.tokens.slice(0, -1),
  };
}

/**
 * 수식 초기화 (결과는 유지)
 */
export function clearExpression(state: CalculatorState): CalculatorState {
  // 이전 결과 유지
  const prevResult = state.mode === CalculatorMode.RESULT ? state.result : null;

  return {
    tokens: [],
    currentInput: "",
    result: prevResult,
    mode: CalculatorMode.INPUT,
    error: null,
  };
}
