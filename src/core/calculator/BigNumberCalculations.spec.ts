import { describe, it, expect } from "vitest";
import { formatResultWithBigInt } from "./CalculatorPresenter";

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
