import {
  CalculatorErrorType,
  CalculatorMode,
  CalculatorState,
  Token,
  initialCalculatorState,
} from "./CalculatorState";

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
 * 토큰의 우선순위 반환
 */
function getOperatorPrecedence(operator: string): number {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    default:
      return 0;
  }
}

/**
 * 연산자 적용 처리
 * 큰 숫자에 대해 더 안정적인 연산 제공
 */
function applyOperator(a: number, b: number, operator: string): number {
  // 큰 정수에 대한 안전 체크
  const isLargeInteger =
    (Number.isInteger(a) && Math.abs(a) > Number.MAX_SAFE_INTEGER / 10) ||
    (Number.isInteger(b) && Math.abs(b) > Number.MAX_SAFE_INTEGER / 10);

  // 정수 연산에 대해 BigInt 사용 시도
  if (isLargeInteger && Number.isInteger(a) && Number.isInteger(b)) {
    try {
      let result: bigint;
      const bigA = BigInt(Math.round(a)); // 혹시 모를 부동소수점 오차 방지
      const bigB = BigInt(Math.round(b));

      switch (operator) {
        case "+":
          result = bigA + bigB;
          break;
        case "-":
          result = bigA - bigB;
          break;
        case "*":
          result = bigA * bigB;
          break;
        case "/":
          if (bigB === 0n) {
            throw {
              type: CalculatorErrorType.DIVISION_BY_ZERO,
              details: "Division by zero",
            };
          }

          // BigInt 나눗셈은 소수점 결과를 지원하지 않으므로,
          // 일반 숫자로 변환하여 수행
          return Number(a) / Number(b);
        default:
          throw {
            type: CalculatorErrorType.UNKNOWN_ERROR,
            details: `Unknown operator: ${operator}`,
          };
      }

      // BigInt 결과를 Number로 안전하게 변환 (범위 체크)
      const numberResult = Number(result);
      if (!Number.isFinite(numberResult)) {
        return Number.MAX_SAFE_INTEGER * (result < 0n ? -1 : 1);
      }
      return numberResult;
    } catch (e) {
      // BigInt 처리 실패 시 일반 연산으로 진행
    }
  }

  // 일반 연산
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        throw {
          type: CalculatorErrorType.DIVISION_BY_ZERO,
          details: "Division by zero",
        };
      }
      return a / b;
    default:
      throw {
        type: CalculatorErrorType.UNKNOWN_ERROR,
        details: `Unknown operator: ${operator}`,
      };
  }
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

    // 중위 표기식을 후위 표기식으로 변환 (Shunting Yard 알고리즘)
    const output: Token[] = [];
    const operators: Token[] = [];

    for (const token of tokensToEvaluate) {
      if (token.type === "NUMBER") {
        output.push(token);
      } else if (token.type === "OPERATOR") {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type === "OPERATOR" &&
          getOperatorPrecedence(operators[operators.length - 1].value) >=
            getOperatorPrecedence(token.value)
        ) {
          output.push(operators.pop()!);
        }
        operators.push(token);
      } else if (token.type === "LEFT_PAREN") {
        operators.push(token);
      } else if (token.type === "RIGHT_PAREN") {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type !== "LEFT_PAREN"
        ) {
          output.push(operators.pop()!);
        }

        // 왼쪽 괄호 제거
        if (
          operators.length > 0 &&
          operators[operators.length - 1].type === "LEFT_PAREN"
        ) {
          operators.pop();
        } else {
          throw {
            type: CalculatorErrorType.SYNTAX_ERROR,
            details: "Mismatched parentheses",
          };
        }
      }
    }

    // 남은 연산자 모두 출력
    while (operators.length > 0) {
      const op = operators.pop()!;
      if (op.type === "LEFT_PAREN") {
        throw {
          type: CalculatorErrorType.SYNTAX_ERROR,
          details: "Mismatched parentheses",
        };
      }
      output.push(op);
    }

    // 후위 표기식 계산
    const valueStack: number[] = [];

    for (const token of output) {
      if (token.type === "NUMBER") {
        // 큰 숫자 처리: 문자열 숫자가 안전한 정수 범위를 초과하는지 확인
        const numValue = Number(token.value);
        valueStack.push(numValue);
      } else if (token.type === "OPERATOR") {
        if (valueStack.length < 2) {
          throw {
            type: CalculatorErrorType.INCOMPLETE_EXPRESSION,
            details: "Invalid expression",
          };
        }
        const b = valueStack.pop()!;
        const a = valueStack.pop()!;

        // 안정적인 계산을 위해 개선된 연산자 적용 함수 사용
        const result = applyOperator(a, b, token.value);
        valueStack.push(result);
      }
    }

    // 결과가 정확히 하나여야 함
    if (valueStack.length !== 1) {
      throw {
        type: CalculatorErrorType.INCOMPLETE_EXPRESSION,
        details: "Invalid expression",
      };
    }

    // 결과 반환
    return {
      tokens: [],
      currentInput: "",
      result: valueStack[0],
      mode: CalculatorMode.RESULT,
      error: null,
    };
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
 */
export function applyBackspace(state: CalculatorState): CalculatorState {
  // 1. 에러 상태에서는 초기 상태로 리셋
  if (state.mode === CalculatorMode.ERROR) {
    return initialCalculatorState;
  }

  // 2. 결과 상태에서는 결과를 첫 토큰으로 변환하고 입력 모드로 전환
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

  // 3. 현재 입력이 있는 경우: 마지막 문자 제거
  if (state.currentInput.length > 0) {
    const newInput = state.currentInput.slice(0, -1);
    return {
      ...state,
      currentInput: newInput,
    };
  }

  // 4. 토큰이 있는 경우: 마지막 토큰 처리
  if (state.tokens.length > 0) {
    const lastToken = state.tokens[state.tokens.length - 1];

    // 4.1 숫자 토큰이고 두 자리 이상인 경우: 마지막 자릿수 제거
    if (lastToken.type === "NUMBER" && lastToken.value.length > 1) {
      const newValue = lastToken.value.slice(0, -1);
      return {
        ...state,
        tokens: [
          ...state.tokens.slice(0, -1),
          { ...lastToken, value: newValue },
        ],
      };
    }

    // 4.2 그 외의 경우: 토큰 자체를 제거
    return {
      ...state,
      tokens: state.tokens.slice(0, -1),
    };
  }

  // 5. 이미 비어있는 상태면 그대로 유지
  return state;
}

/**
 * 현재 수식만 초기화
 */
export function clearExpression(state: CalculatorState): CalculatorState {
  return {
    ...state,
    tokens: [],
    currentInput: "",
    mode: CalculatorMode.INPUT,
  };
}

/**
 * 상태를 문자열로 변환
 * 순수하게 상태 내용을 문자열로 표현합니다.
 */
export function stateToString(state: CalculatorState): string {
  // 에러 상태인 경우 에러 메시지 반환
  if (state.mode === CalculatorMode.ERROR && state.error) {
    return `Error: ${state.error.details}`;
  }

  // 결과 상태인 경우 결과값 반환
  if (state.mode === CalculatorMode.RESULT && state.result !== null) {
    return state.result.toString();
  }

  // 빈 상태(토큰과 입력이 없는 경우) "0" 반환
  if (state.tokens.length === 0 && state.currentInput === "") {
    return "0";
  }

  // 입력 상태에서는 토큰과 현재 입력을 결합
  let expression = "";

  // 토큰이 있으면 토큰 문자열 구성
  if (state.tokens.length > 0) {
    expression = state.tokens.map((token) => token.value).join(" ");
  }

  // 현재 입력이 있으면 추가
  if (state.currentInput) {
    expression = expression
      ? `${expression} ${state.currentInput}`
      : state.currentInput;
  }

  return expression;
}
