import {
  BackspaceButton,
  ClearButton,
  EqualsButton,
  NumberButton,
  OperatorButton,
} from "./types";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "15px",
        fontSize: "18px",
        cursor: "pointer",
        border: "1px solid #ddd",
        backgroundColor: "#f5f5f5",
        transition: "background-color 0.3s",
      }}
    >
      {label}
    </button>
  );
};

export const buttonRows = [
  [
    new NumberButton("7"),
    new NumberButton("8"),
    new NumberButton("9"),
    new OperatorButton("/"),
  ],
  [
    new NumberButton("4"),
    new NumberButton("5"),
    new NumberButton("6"),
    new OperatorButton("*"),
  ],
  [
    new NumberButton("1"),
    new NumberButton("2"),
    new NumberButton("3"),
    new OperatorButton("-"),
  ],
  [
    new NumberButton("0"),
    new OperatorButton("("),
    new OperatorButton(")"),
    new OperatorButton("+"),
  ],
  [new ClearButton(), new BackspaceButton(), new EqualsButton()],
];
