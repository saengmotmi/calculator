import { useSyncExternalStore } from "react";

import {
  BackspaceButton,
  ClearButton,
  EqualsButton,
  NumberButton,
  OperatorButton,
} from "./Button/types";
import { calculatorStore } from "./calculatorStore";
import Display from "./Display";
import { Button } from "./Button";

const CalculatorPanel = () => {
  const { expression, result } = useSyncExternalStore(
    calculatorStore.subscribe,
    calculatorStore.getSnapshot
  );

  return (
    <div>
      <Display expression={expression} result={result ?? 0} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {buttonRows.flat().map((btn) => {
          if (btn instanceof ClearButton) {
            return (
              <Button
                key={btn.label}
                label={btn.label}
                onClick={() => calculatorStore.clear()}
              />
            );
          } else if (btn instanceof BackspaceButton) {
            return (
              <Button
                key={btn.label}
                label={btn.label}
                onClick={() => calculatorStore.backspace()}
              />
            );
          } else if (btn instanceof EqualsButton) {
            return (
              <Button
                key={btn.label}
                label={btn.label}
                onClick={() => calculatorStore.calculate()}
              />
            );
          } else {
            return (
              <Button
                key={btn.label}
                label={btn.label}
                onClick={() => calculatorStore.input(btn.label)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default CalculatorPanel;

const buttonRows = [
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
