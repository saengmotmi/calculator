import {
  ButtonConfig,
  CalculatorActions,
  createNumberButton,
  createOperatorButton,
  createEqualsButton,
  createClearButton,
  createBackspaceButton,
} from "./types";

interface ButtonProps {
  label: string;
  onClick: () => void;
  "aria-label": string;
}

/**
 * 개선된 Button 컴포넌트 (의존성 주입 기반)
 */
export const Button = ({
  label,
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        padding: "20px",
        fontSize: "18px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#f9f9f9",
        cursor: "pointer",
        minHeight: "60px",
      }}
    >
      {label}
    </button>
  );
};

/**
 * 함수형 버튼 레이아웃 생성
 */
export function createButtonLayout(
  actions: CalculatorActions
): ButtonConfig[][] {
  return [
    [
      createClearButton(),
      createBackspaceButton(),
      createOperatorButton("("),
      createOperatorButton(")"),
    ],
    [
      createNumberButton("7"),
      createNumberButton("8"),
      createNumberButton("9"),
      createOperatorButton("/"),
    ],
    [
      createNumberButton("4"),
      createNumberButton("5"),
      createNumberButton("6"),
      createOperatorButton("*"),
    ],
    [
      createNumberButton("1"),
      createNumberButton("2"),
      createNumberButton("3"),
      createOperatorButton("-"),
    ],
    [
      createNumberButton("0"),
      createOperatorButton("."),
      createEqualsButton(),
      createOperatorButton("+"),
    ],
  ];
}
