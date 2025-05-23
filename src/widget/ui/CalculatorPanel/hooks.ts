import { useKey } from "react-use";
import { useSyncExternalStore } from "react";

import { calculatorStore } from "../../../features/calculator/calculatorStore";

/**
 * 계산기 표시 데이터를 위한 커스텀 훅
 * Store에서 이미 변환된 UI 스냅샷을 반환
 */
export const useCalculatorDisplay = () => {
  return useSyncExternalStore(
    calculatorStore.subscribe,
    calculatorStore.getSnapshot
  );
};

export const useCalculatorKeyInput = () => {
  useKey("1", () => calculatorStore.input("1"));
  useKey("2", () => calculatorStore.input("2"));
  useKey("3", () => calculatorStore.input("3"));
  useKey("4", () => calculatorStore.input("4"));
  useKey("5", () => calculatorStore.input("5"));
  useKey("6", () => calculatorStore.input("6"));
  useKey("7", () => calculatorStore.input("7"));
  useKey("8", () => calculatorStore.input("8"));
  useKey("9", () => calculatorStore.input("9"));
  useKey("0", () => calculatorStore.input("0"));

  // 연산자 키 입력 처리
  useKey("+", () => calculatorStore.input("+"));
  useKey("-", () => calculatorStore.input("-"));
  useKey("*", () => calculatorStore.input("*"));
  useKey("/", () => calculatorStore.input("/"));

  // 괄호 키 입력 처리
  useKey("(", () => calculatorStore.input("("));
  useKey(")", () => calculatorStore.input(")"));

  // 기타 키 처리
  useKey("Enter", () => calculatorStore.calculate());
  useKey("Backspace", () => calculatorStore.backspace());
  useKey("Escape", () => calculatorStore.clear());
};
