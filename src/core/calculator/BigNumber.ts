/**
 * 계산기에서 사용하는 정밀한 숫자 표현 클래스
 * BigInt를 내부적으로 사용하면서 소수점 처리도 지원
 */
export class BigNumber {
  private value: bigint;
  private scale: number; // 소수점 이하 자릿수

  /**
   * 문자열이나 숫자로부터 BigNumber 생성
   */
  constructor(value: string | number) {
    const strValue = String(value);

    // 소수점 위치 파악
    if (strValue.includes(".")) {
      const [intPart, fracPart] = strValue.split(".");
      this.scale = fracPart.length;
      // 소수점 이동하여 정수로 변환 (예: "123.45" -> 12345, scale = 2)
      this.value = BigInt(intPart + fracPart);
    } else {
      this.value = BigInt(strValue);
      this.scale = 0;
    }
  }

  /**
   * 덧셈 연산
   */
  add(other: BigNumber): BigNumber {
    // 소수점 자리수 맞추기
    const { v1, v2, newScale } = this.alignDecimals(this, other);

    // 계산 후 새 인스턴스 생성
    const result = new BigNumber("0");
    result.value = v1 + v2;
    result.scale = newScale;

    return result;
  }

  /**
   * 뺄셈 연산
   */
  subtract(other: BigNumber): BigNumber {
    // 소수점 자리수 맞추기
    const { v1, v2, newScale } = this.alignDecimals(this, other);

    // 계산 후 새 인스턴스 생성
    const result = new BigNumber("0");
    result.value = v1 - v2;
    result.scale = newScale;

    return result;
  }

  /**
   * 곱셈 연산
   */
  multiply(other: BigNumber): BigNumber {
    // 계산 후 새 인스턴스 생성
    const result = new BigNumber("0");
    result.value = this.value * other.value;
    // 곱셈 시 소수점 자리수는 더해짐
    result.scale = this.scale + other.scale;

    return result;
  }

  /**
   * 나눗셈 연산
   */
  divide(other: BigNumber, precision: number = 20): BigNumber {
    if (other.value === 0n) {
      throw new Error("Division by zero");
    }

    // 정밀도를 높이기 위해 나눠지는 수에 스케일 적용
    const scaleFactor = 10n ** BigInt(precision);
    const scaledValue = this.value * scaleFactor;

    // 서로 다른 소수점 스케일 조정
    const scaleAdjustment = this.scale - other.scale;

    // 나누기 수행
    const quotient =
      scaleAdjustment >= 0
        ? scaledValue / (other.value * 10n ** BigInt(scaleAdjustment))
        : (scaledValue * 10n ** BigInt(-scaleAdjustment)) / other.value;

    // 결과 생성
    const result = new BigNumber("0");
    result.value = quotient;
    result.scale = precision;

    return result;
  }

  /**
   * 두 BigNumber의 소수점 자리수 맞추기
   */
  private alignDecimals(
    a: BigNumber,
    b: BigNumber
  ): { v1: bigint; v2: bigint; newScale: number } {
    if (a.scale === b.scale) {
      return { v1: a.value, v2: b.value, newScale: a.scale };
    }

    const newScale = Math.max(a.scale, b.scale);

    // 소수점 자리수 조정
    const v1 =
      a.scale < newScale
        ? a.value * 10n ** BigInt(newScale - a.scale)
        : a.value;

    const v2 =
      b.scale < newScale
        ? b.value * 10n ** BigInt(newScale - b.scale)
        : b.value;

    return { v1, v2, newScale };
  }

  /**
   * 0인지 확인
   */
  isZero(): boolean {
    return this.value === 0n;
  }

  /**
   * 문자열로 변환 (계산기 표시용)
   */
  toString(): string {
    if (this.scale === 0) {
      return this.value.toString();
    }

    const strValue = this.value.toString();

    // 소수점 위치 계산
    if (strValue.length <= this.scale) {
      // "0.00123" 같은 형태
      const padded = strValue.padStart(this.scale + 1, "0");
      return `0.${padded.slice(1).padStart(this.scale, "0")}`;
    }

    // "123.45" 같은 형태
    const intPart = strValue.slice(0, strValue.length - this.scale);
    const fracPart = strValue.slice(strValue.length - this.scale);

    // 소수점 이하 후행 0 제거
    const trimmedFracPart = fracPart.replace(/0+$/, "");

    return trimmedFracPart.length > 0
      ? `${intPart}.${trimmedFracPart}`
      : intPart;
  }

  /**
   * 문자열에서 BigNumber 생성하는 정적 메서드
   */
  static from(value: string | number): BigNumber {
    return new BigNumber(value);
  }

  /**
   * 두 값으로 연산 수행하는 정적 메서드
   */
  static calculate(a: string, operator: string, b: string): string {
    try {
      const num1 = BigNumber.from(a);
      const num2 = BigNumber.from(b);

      switch (operator) {
        case "+":
          return num1.add(num2).toString();
        case "-":
          return num1.subtract(num2).toString();
        case "*":
          return num1.multiply(num2).toString();
        case "/":
          return num1.divide(num2).toString();
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    } catch (e) {
      if (e instanceof Error && e.message === "Division by zero") {
        return "Error: Division by zero";
      }
      return `Error: ${e instanceof Error ? e.message : "Calculation error"}`;
    }
  }
}
