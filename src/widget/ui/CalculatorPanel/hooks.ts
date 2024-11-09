import { useKey } from "react-use";

import { calculatorStore } from "../../../features/calculator/calculatorStore";

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
