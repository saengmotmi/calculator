import { describe, it, expect } from "vitest";
import { formatResultWithBigInt } from "./CalculatorPresenter";
import { BigNumber } from "./BigNumber";

describe("큰 숫자 계산 테스트", () => {
  describe("일반 숫자 연산 정밀도 테스트", () => {
    it("일반 덧셈은 정확해야 함", () => {
      expect(123 + 456).toBe(579);
    });

    it("큰 숫자 덧셈은 정밀도 문제가 발생할 수 있음", () => {
      // 다음 두 숫자는 JavaScript에서 정밀도 한계로 인해 다를 수 있음
      const largeNum1 = 9007199254740992; // 2^53
      const largeNum2 = 9007199254740993; // 2^53 + 1

      // 정밀도 한계로 인해 두 숫자가 같게 보일 수 있음 (정밀도 문제 증명)
      expect(largeNum1 === largeNum2).toBe(true);
    });
  });

  describe("BigNumber 클래스 테스트", () => {
    it("문자열에서 올바르게 BigNumber를 생성함", () => {
      const num = new BigNumber("123.456");
      expect(num.toString()).toBe("123.456");

      const intNum = new BigNumber("987654321");
      expect(intNum.toString()).toBe("987654321");
    });

    it("기본 연산이 정확함", () => {
      // 덧셈
      const a = new BigNumber("123.45");
      const b = new BigNumber("67.89");
      expect(a.add(b).toString()).toBe("191.34");

      // 뺄셈
      expect(a.subtract(b).toString()).toBe("55.56");

      // 곱셈
      expect(a.multiply(b).toString()).toBe("8381.0205");

      // 나눗셈
      const divResult = a.divide(b).toString();
      // 정확한 값을 검증하는 대신 정밀도만 확인
      expect(divResult.startsWith("1.81838")).toBe(true);
      // 최소 5자리 이상의 정밀도 제공
      expect(divResult.length > 7).toBe(true);
    });

    it("큰 숫자 연산이 정확함", () => {
      const big1 = new BigNumber("9007199254740993"); // 2^53 + 1
      const big2 = new BigNumber("1");

      // JavaScript Number로는 구분할 수 없지만 BigNumber는 정확함
      expect(big1.add(big2).toString()).toBe("9007199254740994");
    });

    it("소수점 스케일링이 정확함", () => {
      const a = new BigNumber("0.1");
      const b = new BigNumber("0.2");

      // JavaScript에서는 0.1 + 0.2 !== 0.3 이지만 BigNumber는 정확해야 함
      const sum = a.add(b);
      // 정확한 계산 결과를 확인
      expect(sum.toString()).toBe("0.3");

      // 더 복잡한 소수점 연산
      const c = new BigNumber("0.0001");
      const d = new BigNumber("0.0002");

      expect(c.add(d).toString()).toBe("0.0003");
      expect(c.multiply(d).toString()).toBe("0.00000002");
    });

    it("정적 calculate 메서드가 정확함", () => {
      expect(BigNumber.calculate("123", "+", "456")).toBe("579");
      expect(BigNumber.calculate("123", "-", "456")).toBe("-333");
      expect(BigNumber.calculate("123", "*", "456")).toBe("56088");

      const divisionResult = BigNumber.calculate("1", "/", "3");
      // 소수점 정밀도 확인
      expect(divisionResult.startsWith("0.33333")).toBe(true);
    });

    it("에러 처리가 정확함", () => {
      expect(BigNumber.calculate("123", "/", "0")).toBe(
        "Error: Division by zero"
      );
      expect(BigNumber.calculate("123", "?", "456")).toBe(
        "Error: Unknown operator: ?"
      );
    });
  });

  describe("formatResultWithBigInt 함수 테스트", () => {
    it("일반 숫자는 정확히 변환됨", () => {
      expect(formatResultWithBigInt("123")).toBe("123");
      expect(formatResultWithBigInt("456.789")).toBe("456.789");
    });

    it("큰 정수는 정확히 변환됨", () => {
      expect(formatResultWithBigInt("123456789012345678901234567890")).toBe(
        "123456789012345678901234567890"
      );
    });

    it("정밀도 문제가 있는 숫자도 정확히 변환됨", () => {
      const largeNumStr = "9007199254740993"; // 2^53 + 1
      expect(formatResultWithBigInt(largeNumStr)).toBe("9007199254740993");
    });

    it("덧셈 연산 결과가 정확함", () => {
      expect(formatResultWithBigInt("123123123123123123", "+", "1")).toBe(
        "123123123123123124"
      );
    });

    it("뺄셈 연산 결과가 정확함", () => {
      expect(
        formatResultWithBigInt("987654321987654321", "-", "123456789")
      ).toBe("987654321864197532");
    });

    it("곱셈 연산 결과가 정확함", () => {
      // 실제 계산된 결과값으로 테스트 기준 변경
      const result = formatResultWithBigInt(
        "12345678901234",
        "*",
        "98765432109"
      );
      expect(result).toBe("1219326311359340343322506");

      // 간단한 곱셈도 테스트
      expect(formatResultWithBigInt("123456789", "*", "987654321")).toBe(
        "121932631112635269"
      );

      // 작은 숫자 곱셈도 정확해야 함
      expect(formatResultWithBigInt("123", "*", "456")).toBe("56088");
    });

    it("나눗셈은 정확한 정수 부분을 반환함", () => {
      expect(formatResultWithBigInt("1000000000000000000", "/", "3")).toBe(
        "333333333333333333.33333333333333333333"
      );
    });

    it("0으로 나누면 에러 메시지 반환", () => {
      expect(formatResultWithBigInt("123", "/", "0")).toBe(
        "Error: Division by zero"
      );
    });
  });
});
