// ExpressionTokenizer.ts - 토큰화 유틸리티
export function tokenizeExpression(expression: string): string[] {
  const tokens: string[] = [];
  let currentNumber = "";

  for (const char of expression) {
    if (/\d/.test(char) || char === ".") {
      currentNumber += char;
    } else if ("+-*/()".includes(char)) {
      if (currentNumber) {
        tokens.push(currentNumber);
        currentNumber = "";
      }
      tokens.push(char);
    } else if (/\s/.test(char)) {
      continue;
    } else {
      throw new Error(`Invalid character in expression: ${char}`);
    }
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  return tokens;
}
