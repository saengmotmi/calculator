import * as Buttons from "./types";

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

export const ClearButton = () => {};

export const buttonRows = [
  [
    new Buttons.NumberButton("7"),
    new Buttons.NumberButton("8"),
    new Buttons.NumberButton("9"),
    new Buttons.OperatorButton("/"),
  ],
  [
    new Buttons.NumberButton("4"),
    new Buttons.NumberButton("5"),
    new Buttons.NumberButton("6"),
    new Buttons.OperatorButton("*"),
  ],
  [
    new Buttons.NumberButton("1"),
    new Buttons.NumberButton("2"),
    new Buttons.NumberButton("3"),
    new Buttons.OperatorButton("-"),
  ],
  [
    new Buttons.NumberButton("0"),
    new Buttons.OperatorButton("("),
    new Buttons.OperatorButton(")"),
    new Buttons.OperatorButton("+"),
  ],
  [
    new Buttons.ClearButton(),
    new Buttons.BackspaceButton(),
    new Buttons.EqualsButton(),
  ],
];
