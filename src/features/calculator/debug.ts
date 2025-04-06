import { MathCalculator } from "./MathCalculator";
import { Parser } from "../../entities/parser/Parser";
import { Lexer } from "../../entities/lexer/Lexer";
import { OperatorType } from "../../entities/tokens/Operator";

interface TestCase {
  name: string;
  input: string;
  expected: number;
}

// 테스트 케이스 정의
export const testCases: TestCase[] = [
  {
    name: "단순 덧셈",
    input: "2 + 3",
    expected: 5,
  },
  {
    name: "단순 뺄셈",
    input: "5 - 2",
    expected: 3,
  },
  {
    name: "단순 곱셈",
    input: "4 * 3",
    expected: 12,
  },
  {
    name: "단순 나눗셈",
    input: "8 / 2",
    expected: 4,
  },
  {
    name: "연산 우선순위",
    input: "2 + 3 * 4",
    expected: 14,
  },
  {
    name: "괄호와 우선순위",
    input: "2 * ( 3 + 4 )",
    expected: 14,
  },
  {
    name: "중첩 괄호",
    input: "2 * ( 3 + ( 4 - 1 ) )",
    expected: 12,
  },
  {
    name: "음수",
    input: "- 5 + 3",
    expected: -2,
  },
  {
    name: "음수 계산",
    input: "2 * ( - 3 )",
    expected: -6,
  },
  {
    name: "암시적 곱셈 (숫자 다음 괄호)",
    input: "2 ( 3 + 4 )",
    expected: 14,
  },
  {
    name: "암시적 곱셈 (괄호 다음 괄호)",
    input: "( 2 + 1 ) ( 3 + 4 )",
    expected: 21,
  },
];

// 문자열 연산자를 OperatorType으로 변환
function getOperatorType(op: string): OperatorType {
  switch (op) {
    case "+":
      return OperatorType.PLUS;
    case "-":
      return OperatorType.MINUS;
    case "*":
      return OperatorType.MULTIPLY;
    case "/":
      return OperatorType.DIVIDE;
    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

// 디버그 함수
export function debug(testCase: TestCase) {
  console.log("\n========================================");
  console.log(`테스트 케이스: ${testCase.name}`);
  console.log(`입력: ${testCase.input}`);
  console.log(`예상 결과: ${testCase.expected}`);
  console.log("========================================\n");

  // 기존 계산기 테스트 (입력 방식 시뮬레이션)
  console.log("▶️ 기존 계산기 테스트:");
  const calculator = new MathCalculator();

  // 수식 입력 시뮬레이션
  const inputParts = testCase.input.split(/\s+/);
  for (const part of inputParts) {
    if (part === "(") {
      calculator.inputParenthesis("(");
      console.log(`괄호 입력: ( => 식: ${calculator.getExpression()}`);
    } else if (part === ")") {
      calculator.inputParenthesis(")");
      console.log(`괄호 입력: ) => 식: ${calculator.getExpression()}`);
    } else if (["+", "-", "*", "/"].includes(part)) {
      calculator.inputOperator(getOperatorType(part));
      console.log(`연산자 입력: ${part} => 식: ${calculator.getExpression()}`);
    } else if (!isNaN(Number(part))) {
      calculator.inputNumber(part);
      console.log(`숫자 입력: ${part} => 식: ${calculator.getExpression()}`);
    }
  }

  const result = calculator.evaluate();
  console.log(`결과: ${result}`);

  // 새 계산기 테스트 (렉서/파서 직접 사용)
  console.log("\n▶️ 새 계산기 테스트:");
  const calculator2 = new MathCalculator();

  // 수식 입력 시뮬레이션
  for (const part of inputParts) {
    if (part === "(") {
      calculator2.inputParenthesis("(");
      console.log(`괄호 입력: ( => 식: ${calculator2.getExpression()}`);
    } else if (part === ")") {
      calculator2.inputParenthesis(")");
      console.log(`괄호 입력: ) => 식: ${calculator2.getExpression()}`);
    } else if (["+", "-", "*", "/"].includes(part)) {
      calculator2.inputOperator(getOperatorType(part));
      console.log(`연산자 입력: ${part} => 식: ${calculator2.getExpression()}`);
    } else if (!isNaN(Number(part))) {
      calculator2.inputNumber(part);
      console.log(`숫자 입력: ${part} => 식: ${calculator2.getExpression()}`);
    }
  }

  console.log(`Evaluating expression: ${calculator2.getExpression()}`);
  try {
    const result2 = calculator2.evaluate();
    console.log(`결과: ${result2}`);
  } catch (error) {
    console.log(`Calculation error: ${error}`);
    console.log(`결과: 0`);
  }

  // 렉서/파서 테스트 (수식 직접 전달)
  console.log("\n▶️ 렉서/파서 테스트:");
  console.log(`수식: "${testCase.input}"`);

  try {
    const lexer = new Lexer(testCase.input);
    const tokens = lexer.tokenize();
    console.log("토큰:", tokens);

    const parser = new Parser();
    const result3 = parser.parse(testCase.input);
    console.log(`결과: ${result3}`);
  } catch (error) {
    console.log(`렉서/파서 오류: ${error}`);
  }
}
